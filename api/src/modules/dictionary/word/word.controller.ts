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

@ApiBearerAuth()
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
