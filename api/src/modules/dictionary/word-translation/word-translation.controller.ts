import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { WordTranslationService } from './word-translation.service';
import { WordTranslation } from './word-translation.entity';
import { CreateWordTranslationDto } from './dto/create-word-translation.dto';
import { UpdateWordTranslationDto } from './dto/update-word-translation.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';

@ApiTags('Переводы слов')
@Controller('word-translations')
export class WordTranslationController {
  constructor(private readonly translationService: WordTranslationService) {}

  @ApiOperation({ summary: 'Получить все переводы' })
  @Get()
  async getAll(): Promise<WordTranslation[]> {
    return this.translationService.getAll();
  }

  @ApiOperation({ summary: 'Получить перевод по ID' })
  @Get(':id')
  async getById(@Param('id') id: number): Promise<WordTranslation> {
    return this.translationService.getById(id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Создать перевод слова' })
  @Post()
  async create(
    @Body() dto: CreateWordTranslationDto,
  ): Promise<WordTranslation> {
    return this.translationService.create(dto);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Обновить перевод' })
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateWordTranslationDto,
  ): Promise<WordTranslation> {
    return this.translationService.update(id, dto);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Удалить перевод' })
  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return this.translationService.delete(id);
  }
}
