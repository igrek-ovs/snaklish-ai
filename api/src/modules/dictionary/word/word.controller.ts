import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { WordService } from './word.service';
import { CreateWordDto } from './dto/create-word.dto';
import { UpdateWordDto } from './dto/update-word.dto';
import { Word } from './word.entity';

@ApiTags('Слова')
@Controller('words')
export class WordController {
  constructor(private readonly wordService: WordService) {}

  @ApiOperation({ summary: 'Получить все слова' })
  @Get()
  async getAll(): Promise<Word[]> {
    return this.wordService.getAll();
  }

  @ApiOperation({ summary: 'Получить слово по ID' })
  @Get(':id')
  async getById(@Param('id') id: number): Promise<Word> {
    return this.wordService.getById(id);
  }

  @ApiOperation({ summary: 'Добавить новое слово' })
  @Post()
  async create(@Body() dto: CreateWordDto): Promise<Word> {
    return this.wordService.create(dto);
  }

  @ApiOperation({ summary: 'Обновить слово' })
  @Put(':id')
  async update(@Param('id') id: number, @Body() dto: UpdateWordDto): Promise<Word> {
    return this.wordService.update(id, dto);
  }

  @ApiOperation({ summary: 'Удалить слово' })
  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return this.wordService.delete(id);
  }
}
