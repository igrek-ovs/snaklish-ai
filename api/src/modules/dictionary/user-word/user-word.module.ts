import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserWordService } from './user-word.service';
import { UserWordController } from './user-word.controller';
import { UserWord } from './user-word.entity';
import { User } from '../../user/user.entity';
import { Word } from '../word/word.entity';
import { WordTranslation } from '../word-translation/word-translation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserWord, User, WordTranslation])],
  controllers: [UserWordController],
  providers: [UserWordService],
  exports: [UserWordService],
})
export class UserWordModule {}
