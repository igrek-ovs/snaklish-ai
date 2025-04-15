import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
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
  constructor(
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
    @InjectRepository(User) // ✅ Добавляем InjectRepository!
    private userRepository: Repository<User>,
  ) {}

  async generateRefreshToken(userId: string): Promise<string> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Пользователь не найден');

    const refreshSecret = process.env.JWT_REFRESH_SECRET;
    if (!refreshSecret) {
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
    return token;
  }

  async validateRefreshToken(
    token: string,
  ): Promise<RefreshTokenPayloadDto | null> {
    const refreshTokens = await this.refreshTokenRepository.find({
      relations: ['user'],
    });

    for (const tokenEntity of refreshTokens) {
      const isMatch = await bcrypt.compare(token, tokenEntity.token);
      if (isMatch && tokenEntity.user) {
        return {
          id: tokenEntity.user.id,
          role: tokenEntity.user.role,
        };
      }
    }

    return null;
  }

  async removeRefreshToken(userId: string): Promise<void> {
    await this.refreshTokenRepository.delete({ user: { id: userId } });
  }
}
