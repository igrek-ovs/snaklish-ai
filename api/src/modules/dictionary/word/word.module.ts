import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Word } from './word.entity';
import { WordTranslation } from '../word-translation/word-translation.entity';
import { WordService } from './word.service';
import { WordController } from './word.controller';
import { Category } from '../category/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Word, WordTranslation, Category])],
  providers: [WordService],
  controllers: [WordController],
  exports: [WordService],
})
export class WordModule {}
