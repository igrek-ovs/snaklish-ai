import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { LessonModule } from './modules/lesson/lesson/lesson.module';
import { ExerciseModule } from './modules/lesson/exercise/exercise.module';
import { ExerciseOptionModule } from './modules/lesson/exercise-option/exercise-option.module';
import { LessonProgressModule } from './modules/lesson/lesson-progress/lesson-progress.module';
import { UserAnswerModule } from './modules/lesson/user-answer/user-answer.module';
import { EmailVerificationModule } from './modules/email-verification/email-verification.module';
import { WordModule } from './modules/dictionary/word/word.module';
import { WordTranslationModule } from './modules/dictionary/word-translation/word-translation.module';
import { UserWordModule } from './modules/dictionary/user-word/user-word.module';
import { MulterModule } from '@nestjs/platform-express';
import { CategoryModule } from './modules/dictionary/category/category.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuditLog, AuditLogSchema } from './modules/audit-log/audit-log.schema';
import { AuditLogService } from './modules/audit-log/audit-log.service';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AuditLogInterceptor } from './common/interceptors/journaling.incterceptor';
import { AuditLogModule } from './modules/audit-log/audit-log.module';
import { OpenaiModule } from './modules/openai/openai.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://root:password@localhost:27017', {
      dbName: 'my_mongo_db',
    }),
    MongooseModule.forFeature([
      { name: AuditLog.name, schema: AuditLogSchema },
    ]),
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [join(process.cwd(), 'dist/**/*.entity.js')],
        synchronize: false,
        timezone: 'Z',
      }),
    }),
    UserModule,
    AuthModule,
    LessonModule,
    ExerciseModule,
    ExerciseOptionModule,
    LessonProgressModule,
    UserAnswerModule,
    EmailVerificationModule,
    WordModule,
    WordTranslationModule,
    UserWordModule,
    CategoryModule,
    AuditLogModule,
    OpenaiModule,
    MulterModule.register({
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  ],
  controllers: [],
  providers: [
    AuditLogService,
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditLogInterceptor,
    },
  ],
})
export class AppModule {}
