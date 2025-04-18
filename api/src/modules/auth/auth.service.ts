import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { RefreshTokenService } from '../refresh-token/refresh-token.service';
import * as bcrypt from 'bcrypt';
import { UserRole } from '../user/user.entity';
import { UserDto } from '../user/dto/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  async register(user: UserDto) {
    const createdUser = await this.userService.create(user);
    return this.createTokens(createdUser.id, createdUser.role);
  }

  async login(email: string, password: string) {
    const user = await this.userService.getByEmail(email);
    if (!user) throw new UnauthorizedException('Неверный email или пароль');

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatches)
      throw new UnauthorizedException('Неверный email или пароль');

    return this.createTokens(user.id, user.role);
  }

  async createTokens(userId: string, role: UserRole) {
    const accessToken = this.createAccessToken(userId, role);

    const refreshToken =
      await this.refreshTokenService.generateRefreshToken(userId);

    return { accessToken, refreshToken };
  }

  createAccessToken(userId: string, role: string): string {
    return this.jwtService.sign(
      { userId, role },
      { secret: process.env.JWT_SECRET, expiresIn: '30s' },
    );
  }

  async refreshToken(oldRefreshToken: string) {
    const user =
      await this.refreshTokenService.validateRefreshToken(oldRefreshToken);
    if (!user)
      throw new UnauthorizedException('Недействительный refresh токен');

    const newAccessToken = this.createAccessToken(user.id, user.role);

    return { accessToken: newAccessToken };
  }

  async logout(userId: string) {
    await this.refreshTokenService.removeRefreshToken(userId);
  }
}
