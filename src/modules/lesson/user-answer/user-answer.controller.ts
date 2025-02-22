import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { UserAnswerService } from './user-answer.service';
import { CreateUserAnswerDto } from './dto/create-user-answer.dto';
import { UserAnswer } from './user-answer.entity';

@Controller('user-answers')
export class UserAnswerController {
  constructor(private readonly userAnswerService: UserAnswerService) {}

  @Get(':userId')
  getUserAnswers(@Param('userId') userId: string): Promise<UserAnswer[]> {
    return this.userAnswerService.getAnswersByUser(userId);
  }

  @Post()
  submitAnswer(@Body() createUserAnswerDto: CreateUserAnswerDto): Promise<UserAnswer> {
    return this.userAnswerService.submitAnswer(createUserAnswerDto);
  }

  @Delete(':id')
  deleteUserAnswer(@Param('id') id: number): Promise<void> {
    return this.userAnswerService.deleteUserAnswer(id);
  }
}
