import {
  Injectable,
  UnauthorizedException,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { RefreshTokenService } from '../refresh-token/refresh-token.service';
import * as bcrypt from 'bcrypt';
import { UserRole } from '../user/user.entity';
import { UserDto } from '../user/dto/user.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  async register(user: UserDto) {
    try {
      const createdUser = await this.userService.create(user);
      this.logger.log(`User registered with ID: ${createdUser.id}`);

      return this.createTokens(createdUser.id, createdUser.role);
    } catch (error) {
      this.logger.error(
        `Failed to register user: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('Failed to register user');
    }
  }

  async login(email: string, password: string) {
    try {
      const user = await this.userService.getByEmail(email);
      if (!user) {
        this.logger.warn(`Login failed: user with email ${email} not found`);
        throw new UnauthorizedException('Invalid email or password');
      }

      const passwordMatches = await bcrypt.compare(password, user.passwordHash);
      if (!passwordMatches) {
        this.logger.warn(`Login failed: invalid password for email ${email}`);
        throw new UnauthorizedException('Invalid email or password');
      }

      this.logger.log(`User logged in with email: ${email}`);
      return this.createTokens(user.id, user.role);
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;

      this.logger.error(
        `Login failed for email ${email}: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('Failed to log in');
    }
  }

  async createTokens(userId: string, role: UserRole) {
    try {
      const accessToken = this.createAccessToken(userId, role);
      const refreshToken =
        await this.refreshTokenService.generateRefreshToken(userId);

      this.logger.log(
        `Tokens generated for user ID: ${userId} (role: ${role})`,
      );
      return { accessToken, refreshToken };
    } catch (error) {
      this.logger.error(
        `Failed to create tokens for user ID ${userId}: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('Failed to create tokens');
    }
  }

  createAccessToken(userId: string, role: string): string {
    return this.jwtService.sign(
      { userId, role },
      { secret: process.env.JWT_SECRET, expiresIn: '30s' },
    );
  }

  async refreshToken(oldRefreshToken: string) {
    try {
      const user =
        await this.refreshTokenService.validateRefreshToken(oldRefreshToken);

      if (!user) {
        this.logger.warn('Invalid refresh token attempt');
        throw new UnauthorizedException('Invalid refresh token');
      }

      const newAccessToken = this.createAccessToken(user.id, user.role);
      this.logger.log(`Refresh token validated for user ID: ${user.id}`);

      return { accessToken: newAccessToken };
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;

      this.logger.error(
        `Failed to refresh token: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('Failed to refresh token');
    }
  }

  async logout(userId: string) {
    try {
      await this.refreshTokenService.removeRefreshToken(userId);
      this.logger.log(`User logged out with ID: ${userId}`);
    } catch (error) {
      this.logger.error(
        `Failed to log out user ID ${userId}: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('Failed to log out');
    }
  }
}
