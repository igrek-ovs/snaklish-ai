import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { AuthController } from './auth.controller';
import { RefreshTokenModule } from '../refresh-token/refresh-token.module';
import { UserModule } from '../user/user.module'; // ✅ Добавляем!

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
    RefreshTokenModule, // ✅ Уже импортируем RefreshTokenModule, он сам экспортит сервис
    UserModule, // ✅ Теперь UserService доступен
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy], // ❌ Убираем RefreshTokenService и UserService (они уже экспортируются)
  exports: [AuthService],
})
export class AuthModule {}
