import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmailVerification } from './email-verification.entity';
import { User } from '../user/user.entity';
import * as nodemailer from 'nodemailer';
import * as crypto from 'crypto';

@Injectable()
export class EmailVerificationService {
  constructor(
    @InjectRepository(EmailVerification)
    private verificationRepo: Repository<EmailVerification>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  private generateCode(): string {
    return crypto.randomInt(100000, 999999).toString();
  }

  async sendVerificationEmail(userId: string): Promise<void> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Пользователь не найден');

    const code = this.generateCode();

    await this.verificationRepo.delete({ user });

    const verification = this.verificationRepo.create({ user, code });
    await this.verificationRepo.save(verification);

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: '"Snaklish AI" <no-reply@snaklish.com>',
      to: user.email,
      subject: 'Подтверждение email',
      text: `Ваш код подтверждения: ${code}`,
    });
  }

  async verifyEmail(userId: string, code: string): Promise<void> {
    const verification = await this.verificationRepo.findOne({
      where: { user: { id: userId }, isUsed: false },
    });

    if (!verification) throw new NotFoundException('Код не найден или уже использован');

    if (verification.code !== code) {
      throw new BadRequestException('Неверный код');
    }

    verification.isUsed = true;
    await this.verificationRepo.save(verification);

    await this.userRepo.update(userId, { isEmailConfirmed: true });
  }
}
