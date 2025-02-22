import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAnswer } from './user-answer.entity';
import { UserAnswerService } from './user-answer.service';
import { UserAnswerController } from './user-answer.controller';
import { User } from '../../user/user.entity';
import { Exercise } from '../exercise/exercise.entity';
import { ExerciseOption } from '../exercise-option/exercise-option.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserAnswer, User, Exercise, ExerciseOption])],
  controllers: [UserAnswerController],
  providers: [UserAnswerService],
  exports: [UserAnswerService],
})
export class UserAnswerModule {}
