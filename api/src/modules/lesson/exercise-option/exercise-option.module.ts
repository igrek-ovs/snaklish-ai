import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExerciseOption } from './exercise-option.entity';
import { ExerciseOptionService } from './exercise-option.service';
import { ExerciseOptionController } from './exercise-option.controller';
import { Exercise } from '../exercise/exercise.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ExerciseOption, Exercise])],
  controllers: [ExerciseOptionController],
  providers: [ExerciseOptionService],
  exports: [ExerciseOptionService],
})
export class ExerciseOptionModule {}
