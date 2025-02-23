import { Controller, Get, Post, Body, Req, UseGuards, Param, Patch } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UserWordService } from './user-word.service';
import { AuthGuard } from '@nestjs/passport';
import { AddUserWordDto } from './dto/add-user-word.dto';
import { UserWord } from './user-word.entity';
import { UpdateUserWordDto } from './dto/update-user-word.dto';

@ApiTags('Слова пользователя')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('user-words')
export class UserWordController {
  constructor(private readonly userWordService: UserWordService) {}

  @ApiOperation({ summary: 'Добавить слово в список пользователя' })
  @Post()
  async addWordToUser(@Req() req, @Body() dto: AddUserWordDto): Promise<UserWord> {
    return this.userWordService.addWordToUser(req.user.id, dto);
  }

  @ApiOperation({ summary: 'Обновить статус изучения слова' })
  @Patch(':wordId')
  async updateUserWord(
    @Req() req,
    @Param('wordId') wordId: number,
    @Body() dto: UpdateUserWordDto
  ): Promise<UserWord> {
    return this.userWordService.updateUserWord(req.user.id, wordId, dto);
  }

  @ApiOperation({ summary: 'Получить все выученные слова' })
  @Get('learned')
  async getAllLearnedWords(@Req() req): Promise<UserWord[]> {
    return this.userWordService.getAllLearnedWords(req.user.id);
  }

  @ApiOperation({ summary: 'Получить все невыученные слова' })
  @Get('unlearned')
  async getAllUnlearnedWords(@Req() req): Promise<UserWord[]> {
    return this.userWordService.getAllUnlearnedWords(req.user.id);
  }

  @ApiOperation({ summary: 'Получить количество выученных слов (поинты)' })
  @Get('points')
  async getUserPoints(@Req() req): Promise<number> {
    return this.userWordService.getUserPoints(req.user.id);
  }
}
