import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshTokenService } from './refresh-token.service';
import { RefreshToken } from './refresh-token.entity';
import { User } from '../user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RefreshToken, User])], // ✅ Добавляем User!
  providers: [RefreshTokenService],
  exports: [RefreshTokenService, TypeOrmModule], // ✅ Экспортируем TypeOrmModule
})
export class RefreshTokenModule {}
