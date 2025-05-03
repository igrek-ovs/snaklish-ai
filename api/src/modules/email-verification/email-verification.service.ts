import {
  Injectable,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmailVerification } from './email-verification.entity';
import { User } from '../user/user.entity';
import * as nodemailer from 'nodemailer';
import * as crypto from 'crypto';

@Injectable()
export class EmailVerificationService {
  private readonly logger = new Logger(EmailVerificationService.name);

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
    try {
      const user = await this.userRepo.findOne({ where: { id: userId } });
      if (!user) {
        this.logger.warn(`User with ID ${userId} not found`);
        throw new NotFoundException('User not found');
      }

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
        subject: 'Email Confirmation',
        text: `Your confirmation code is: ${code}`,
      });

      this.logger.log(
        `Verification email sent to userId=${userId}, email=${user.email}`,
      );
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      this.logger.error(
        `Failed to send verification email to userId=${userId}: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Failed to send verification email',
      );
    }
  }

  async verifyEmail(userId: string, code: string): Promise<void> {
    try {
      const verification = await this.verificationRepo.findOne({
        where: { user: { id: userId }, isUsed: false },
      });

      if (!verification) {
        this.logger.warn(
          `Verification code not found or already used for userId=${userId}`,
        );
        throw new NotFoundException('Code not found or already used');
      }

      if (verification.code !== code) {
        this.logger.warn(
          `Invalid code provided for userId=${userId}, providedCode=${code}`,
        );
        throw new BadRequestException('Invalid code');
      }

      verification.isUsed = true;
      await this.verificationRepo.save(verification);

      await this.userRepo.update(userId, { isEmailConfirmed: true });
      this.logger.log(`Email verified successfully for userId=${userId}`);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      )
        throw error;

      this.logger.error(
        `Failed to verify email for userId=${userId}: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('Failed to verify email');
    }
  }
}
