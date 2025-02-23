import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WordTranslationService } from './word-translation.service';
import { WordTranslationController } from './word-translation.controller';
import { WordTranslation } from './word-translation.entity';
import { Word } from '../word/word.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WordTranslation, Word])],
  controllers: [WordTranslationController],
  providers: [WordTranslationService],
  exports: [WordTranslationService],
})
export class WordTranslationModule {}
