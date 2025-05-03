import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  InternalServerErrorException,
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
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(userDto: UserDto): Promise<GetUserResultDto> {
    const existingUser = await this.userRepository.findOne({
      where: { email: userDto.email },
    });
    if (existingUser) {
      this.logger.error(`User with email ${userDto.email} already exists`);
      throw new ConflictException('User with this email already exists');
    }

    try {
      const hashedPassword = await bcrypt.hash(userDto.password, 10);
      const newUser = this.userRepository.create({
        ...userDto,
        passwordHash: hashedPassword,
      });

      const savedUser = await this.userRepository.save(newUser);

      this.logger.log(`User created with ID: ${savedUser.id}`);

      return {
        id: savedUser.id,
        name: savedUser.name,
        email: savedUser.email,
        isEmailConfirmed: savedUser.isEmailConfirmed,
        role: savedUser.role,
      };
    } catch (error) {
      this.logger.error(`Failed to create user: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  async update(id: string, newUser: UpdateUserDto): Promise<GetUserResultDto> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      this.logger.error(`User with ID ${id} not found`);
      throw new NotFoundException('User not found');
    }

    if (newUser.email && newUser.email !== user.email) {
      user.isEmailConfirmed = false;
    }

    Object.assign(user, newUser);

    try {
      const updatedUser = await this.userRepository.save(user);
      this.logger.log(`User updated with ID: ${updatedUser.id}`);

      return {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        isEmailConfirmed: updatedUser.isEmailConfirmed,
        role: updatedUser.role,
      };
    } catch (error) {
      this.logger.error(
        `Failed to update user with ID ${id}: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('Failed to update user');
    }
  }

  async changePassword(
    id: string,
    password: string,
  ): Promise<GetUserResultDto> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      this.logger.error(`User with ID ${id} not found`);
      throw new NotFoundException('User not found');
    }

    try {
      user.passwordHash = await bcrypt.hash(password, 10);
      const updatedUser = await this.userRepository.save(user);
      this.logger.log(`Password changed for user ID: ${updatedUser.id}`);

      return {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        isEmailConfirmed: updatedUser.isEmailConfirmed,
        role: updatedUser.role,
      };
    } catch (error) {
      this.logger.error(
        `Failed to change password for user ID ${id}: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('Failed to change password');
    }
  }

  async confirmUserEmail(userId: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      this.logger.error(`User with ID ${userId} not found`);
      throw new NotFoundException('User not found');
    }

    if (user.isEmailConfirmed) {
      this.logger.warn(`Email already confirmed for user ID: ${userId}`);
      throw new BadRequestException('Email is already confirmed');
    }

    try {
      user.isEmailConfirmed = true;
      await this.userRepository.save(user);
      this.logger.log(`Email confirmed for user ID: ${userId}`);
    } catch (error) {
      this.logger.error(
        `Failed to confirm email for user ID ${userId}: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('Failed to confirm email');
    }
  }

  async delete(id: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      this.logger.error(`User with ID ${id} not found`);
      throw new NotFoundException('User not found');
    }

    try {
      await this.userRepository.remove(user);
      this.logger.log(`User deleted with ID: ${id}`);
    } catch (error) {
      this.logger.error(
        `Failed to delete user with ID ${id}: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('Failed to delete user');
    }
  }

  async getById(id: string): Promise<User | null> {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) {
        this.logger.warn(`User with ID ${id} not found`);
        return null;
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { passwordHash, ...userWithoutPassword } = user;
      return userWithoutPassword as User;
    } catch (error) {
      this.logger.error(
        `Failed to get user by ID ${id}: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('Failed to retrieve user');
    }
  }

  async getByEmail(email: string): Promise<User | null> {
    try {
      const user = await this.userRepository.findOne({ where: { email } });
      if (!user) {
        this.logger.warn(`User with email ${email} not found`);
        return null;
      }

      return user;
    } catch (error) {
      this.logger.error(
        `Failed to get user by email ${email}: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('Failed to retrieve user');
    }
  }

  async getAll(): Promise<GetUserResultDto[]> {
    try {
      const users = await this.userRepository.find();
      if (!users || users.length === 0) {
        this.logger.warn('No users found');
        return [];
      }

      this.logger.log(`Fetched ${users.length} users`);

      return users.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        isEmailConfirmed: user.isEmailConfirmed,
        role: user.role,
      }));
    } catch (error) {
      this.logger.error(`Failed to fetch users: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to fetch users');
    }
  }

  async getUserByEmailAndPassword(
    email: string,
    password: string,
  ): Promise<User> {
    try {
      const user = await this.userRepository.findOne({
        where: { email },
        select: ['id', 'name', 'email', 'passwordHash', 'role'],
      });

      if (!user) {
        this.logger.warn(
          `Invalid email or password attempt for email: ${email}`,
        );
        throw new NotFoundException('Invalid email or password');
      }

      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
      if (!isPasswordValid) {
        this.logger.warn(`Invalid password attempt for email: ${email}`);
        throw new BadRequestException('Invalid email or password');
      }

      this.logger.log(`User authenticated with email: ${email}`);
      return user;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error; // ці помилки вже кинуті вище
      }
      this.logger.error(
        `Failed to authenticate user with email ${email}: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('Failed to authenticate user');
    }
  }
}
