import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { ExerciseOptionService } from './exercise-option.service';
import { CreateExerciseOptionDto } from './dto/create-exercise-option.dto';
import { UpdateExerciseOptionDto } from './dto/update-exercise-option.dto';
import { ExerciseOption } from './exercise-option.entity';

@Controller('exercise-options')
export class ExerciseOptionController {
  constructor(private readonly optionService: ExerciseOptionService) {}

  @Get(':exerciseId')
  getOptions(@Param('exerciseId') exerciseId: number): Promise<ExerciseOption[]> {
    return this.optionService.getOptionsByExercise(exerciseId);
  }

  @Post()
  createOption(@Body() createOptionDto: CreateExerciseOptionDto): Promise<ExerciseOption> {
    return this.optionService.createOption(createOptionDto);
  }

  @Patch(':id')
  updateOption(
    @Param('id') id: number,
    @Body() updateOptionDto: UpdateExerciseOptionDto,
  ): Promise<ExerciseOption|null> {
    return this.optionService.updateOption(id, updateOptionDto);
  }

  @Delete(':id')
  deleteOption(@Param('id') id: number): Promise<void> {
    return this.optionService.deleteOption(id);
  }
}
