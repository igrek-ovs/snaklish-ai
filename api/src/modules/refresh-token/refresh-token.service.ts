import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefreshToken } from './refresh-token.entity';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { User } from '../user/user.entity';
import { RefreshTokenPayloadDto } from './dto/validate--refresh-token-result.dto';

@Injectable()
export class RefreshTokenService {
  private readonly logger = new Logger(RefreshTokenService.name);

  constructor(
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async generateRefreshToken(userId: string): Promise<string> {
    try {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        this.logger.warn(`User with ID ${userId} not found`);
        throw new NotFoundException(`User with ID ${userId} not found`);
      }

      const refreshSecret = process.env.JWT_REFRESH_SECRET;
      if (!refreshSecret) {
        this.logger.error(
          'JWT_REFRESH_SECRET is not defined in environment variables',
        );
        throw new Error(
          'JWT_REFRESH_SECRET is not defined in environment variables',
        );
      }

      const token = jwt.sign({ userId }, refreshSecret, { expiresIn: '7d' });
      const hashedToken = await bcrypt.hash(token, 10);

      const refreshToken = this.refreshTokenRepository.create({
        token: hashedToken,
        user,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });

      await this.refreshTokenRepository.save(refreshToken);
      this.logger.log(`Generated and saved refresh token for userId=${userId}`);

      return token;
    } catch (error) {
      this.logger.error(
        `Failed to generate refresh token for userId=${userId}: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Failed to generate refresh token',
      );
    }
  }

  async validateRefreshToken(
    token: string,
  ): Promise<RefreshTokenPayloadDto | null> {
    try {
      const refreshTokens = await this.refreshTokenRepository.find({
        relations: ['user'],
      });

      for (const tokenEntity of refreshTokens) {
        const isMatch = await bcrypt.compare(token, tokenEntity.token);
        if (isMatch && tokenEntity.user) {
          this.logger.log(
            `Validated refresh token for userId=${tokenEntity.user.id}`,
          );
          return {
            id: tokenEntity.user.id,
            role: tokenEntity.user.role,
          };
        }
      }

      this.logger.warn('Refresh token validation failed');
      return null;
    } catch (error) {
      this.logger.error(
        `Failed to validate refresh token: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Failed to validate refresh token',
      );
    }
  }

  async removeRefreshToken(userId: string): Promise<void> {
    try {
      const result = await this.refreshTokenRepository.delete({
        user: { id: userId },
      });

      if (result.affected === 0) {
        this.logger.warn(
          `No refresh tokens found to remove for userId=${userId}`,
        );
      } else {
        this.logger.log(`Removed refresh token(s) for userId=${userId}`);
      }
    } catch (error) {
      this.logger.error(
        `Failed to remove refresh token for userId=${userId}: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('Failed to remove refresh token');
    }
  }
}
