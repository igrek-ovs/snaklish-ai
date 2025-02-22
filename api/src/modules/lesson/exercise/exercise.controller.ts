import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { ExerciseService } from './exercise.service';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { Exercise } from './exercise.entity';

@Controller('exercises')
export class ExerciseController {
  constructor(private readonly exerciseService: ExerciseService) {}

  @Get()
  getAllExercises(): Promise<Exercise[]> {
    return this.exerciseService.getAllExercises();
  }

  @Get(':id')
  getExerciseById(@Param('id') id: number): Promise<Exercise> {
    return this.exerciseService.getExerciseById(id);
  }

  @Post()
  createExercise(@Body() createExerciseDto: CreateExerciseDto): Promise<Exercise> {
    return this.exerciseService.createExercise(createExerciseDto);
  }

  @Patch(':id')
  updateExercise(
    @Param('id') id: number,
    @Body() updateExerciseDto: UpdateExerciseDto,
  ): Promise<Exercise> {
    return this.exerciseService.updateExercise(id, updateExerciseDto);
  }

  @Delete(':id')
  deleteExercise(@Param('id') id: number): Promise<void> {
    return this.exerciseService.deleteExercise(id);
  }
}
