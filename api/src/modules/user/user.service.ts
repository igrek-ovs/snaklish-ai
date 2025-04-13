import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserDto } from './dto/user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.entity';
import { GetUserResultDto } from './dto/get-user-result.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  private readonly logger = new Logger(UserService.name);

  async create(userDto: UserDto): Promise<GetUserResultDto> {
    const existingUser = await this.userRepository.findOne({
      where: { email: userDto.email },
    });
    if (existingUser) {
      this.logger.error('User with this email already exists');
      throw new ConflictException('Пользователь с таким email уже существует');
    }

    const hashedPassword = await bcrypt.hash(userDto.password, 10);
    const newUser = this.userRepository.create({
      ...userDto,
      passwordHash: hashedPassword,
    });

    const savedUser = await this.userRepository.save(newUser);

    return {
      id: savedUser.id,
      name: savedUser.name,
      email: savedUser.email,
      isEmailConfirmed: savedUser.isEmailConfirmed,
      role: savedUser.role,
    };
  }

  async update(id: string, newUser: UpdateUserDto): Promise<GetUserResultDto> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      this.logger.error('User not found');
      throw new NotFoundException('Пользователь не найден');
    }

    if (newUser.email && newUser.email !== user.email) {
      user.isEmailConfirmed = false;
    }

    Object.assign(user, newUser);
    const updatedUser = await this.userRepository.save(user);

    return {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      isEmailConfirmed: updatedUser.isEmailConfirmed,
      role: updatedUser.role,
    };
  }

  async changePassword(
    id: string,
    password: string,
  ): Promise<GetUserResultDto> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      this.logger.error('User not found');
      throw new NotFoundException('Пользователь не найден');
    }

    user.passwordHash = await bcrypt.hash(password, 10);
    const updatedUser = await this.userRepository.save(user);

    return {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      isEmailConfirmed: updatedUser.isEmailConfirmed,
      role: updatedUser.role,
    };
  }

  async confirmUserEmail(userId: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Пользователь не найден');

    if (user.isEmailConfirmed) {
      throw new BadRequestException('Email уже подтвержден');
    }

    user.isEmailConfirmed = true;
    await this.userRepository.save(user);
  }

  async delete(id: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Пользователь не найден');

    await this.userRepository.remove(user);
  }

  async getById(id: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) return null;

    return user;
  }

  async getByEmail(email: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) return null;

    return user;
  }

  async getAll(): Promise<GetUserResultDto[]> {
    const users = await this.userRepository.find();

    if (!users) return [];

    return users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      isEmailConfirmed: user.isEmailConfirmed,
      role: user.role,
    }));
  }

  async getUserByEmailAndPassword(
    email: string,
    password: string,
  ): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email },
      select: ['id', 'name', 'email', 'passwordHash', 'role'],
    });

    if (!user) throw new NotFoundException('Неверный email или пароль');

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid)
      throw new BadRequestException('Неверный email или пароль');

    return user;
  }
}
