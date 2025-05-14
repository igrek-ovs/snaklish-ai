import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { WordService } from './word.service';
import { CreateWordDto } from './dto/create-word.dto';
import { UpdateWordDto } from './dto/update-word.dto';
import { Word } from './word.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { SearchWordsDto } from './dto/search-words.dto';

@ApiBearerAuth()
@ApiTags('Слова')
@Controller('words')
export class WordController {
  constructor(private readonly wordService: WordService) {}

  @ApiOperation({ summary: 'Получить все слова' })
  @Get()
  async getAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ): Promise<{ items: Word[]; total: number }> {
    return this.wordService.getAll(page, limit);
  }

  @ApiOperation({ summary: 'Advanced search for words' })
  @Get('search')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async search(@Query() query: SearchWordsDto) {
    const pageNumber = Number(query.pageNumber) || 1;
    const pageSize = Number(query.pageSize) || 10;
    const filters = { ...query } as any;
    delete filters.pageNumber;
    delete filters.pageSize;

    return this.wordService.advancedSearch(filters, pageNumber, pageSize);
  }

  @ApiOperation({ summary: 'Получить слово по ID' })
  @Get(':id')
  async getById(@Param('id') id: number): Promise<Word> {
    return this.wordService.getById(id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Добавить новое слово' })
  @Post()
  async create(@Body() dto: CreateWordDto): Promise<Word> {
    return this.wordService.create(dto);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Обновить слово' })
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateWordDto,
  ): Promise<Word> {
    return this.wordService.update(id, dto);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Удалить слово' })
  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return this.wordService.delete(id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Добавить изображение к слову' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @Post(':id/image')
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(
    @Param('id') id: number,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Word> {
    return this.wordService.addImage(id, file.buffer);
  }
}
