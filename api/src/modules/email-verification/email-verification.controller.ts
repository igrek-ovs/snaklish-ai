import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { EmailVerificationService } from './email-verification.service';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { VerifyEmailDto } from './dto/verify-email.dto';

@ApiTags('Email подтверждение')
@Controller('auth')
export class EmailVerificationController {
  constructor(private emailVerificationService: EmailVerificationService) {}

  @ApiOperation({ summary: 'Отправить код подтверждения email' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('send-verification')
  async sendVerification(@Req() req): Promise<void> {
    return this.emailVerificationService.sendVerificationEmail(req.user.id);
  }

  @ApiOperation({ summary: 'Подтвердить email через код' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiBody({ type: VerifyEmailDto })  // 👈 Добавляем это
  @Post('verify-email')
  async verifyEmail(@Req() req, @Body() dto: VerifyEmailDto): Promise<void> {
    return this.emailVerificationService.verifyEmail(req.user.id, dto.code);
  }
}
