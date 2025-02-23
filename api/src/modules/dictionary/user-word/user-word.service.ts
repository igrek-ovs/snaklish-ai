import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserWord } from './user-word.entity';
import { User } from '../../user/user.entity';
import { Word } from '../word/word.entity';
import { AddUserWordDto } from './dto/add-user-word.dto';
import { UpdateUserWordDto } from './dto/update-user-word.dto';

@Injectable()
export class UserWordService {
  constructor(
    @InjectRepository(UserWord)
    private userWordRepository: Repository<UserWord>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Word)
    private wordRepository: Repository<Word>,
  ) {}

  async addWordToUser(userId: string, dto: AddUserWordDto): Promise<UserWord> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException(`Пользователь с ID ${userId} не найден`);

    const word = await this.wordRepository.findOne({ where: { id: dto.wordId } });
    if (!word) throw new NotFoundException(`Слово с ID ${dto.wordId} не найдено`);

    let userWord = await this.userWordRepository.findOne({
      where: { user, word },
    });

    if (!userWord) {
      userWord = this.userWordRepository.create({ user, word, isLearnt: dto.isLearnt });
      await this.userWordRepository.save(userWord);
    }

    return userWord;
  }

  async getAllLearnedWords(userId: string): Promise<UserWord[]> {
    return this.userWordRepository.find({
      where: { user: { id: userId }, isLearnt: true },
      relations: ['word'],
    });
  }

  async getAllUnlearnedWords(userId: string): Promise<UserWord[]> {
    return this.userWordRepository.find({
      where: { user: { id: userId }, isLearnt: false },
      relations: ['word'],
    });
  }

  async getUserPoints(userId: string): Promise<number> {
    return this.userWordRepository.count({
      where: { user: { id: userId }, isLearnt: true },
    });
  }

  async updateUserWord(userId: string, wordId: number, dto: UpdateUserWordDto): Promise<UserWord> {
    const userWord = await this.userWordRepository.findOne({
      where: { user: { id: userId }, word: { id: wordId } },
    });

    if (!userWord) {
      throw new NotFoundException(`Слово с ID ${wordId} не найдено у пользователя`);
    }

    userWord.isLearnt = dto.isLearnt;
    await this.userWordRepository.save(userWord);

    return userWord;
  }
}
