import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserWord } from './user-word.entity';
import { User } from '../../user/user.entity';
import { WordTranslation } from '../word-translation/word-translation.entity';
import { AddUserWordDto } from './dto/add-user-word.dto';
import { UpdateUserWordDto } from './dto/update-user-word.dto';

@Injectable()
export class UserWordService {
  constructor(
    @InjectRepository(UserWord)
    private userWordRepository: Repository<UserWord>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(WordTranslation)
    private translationRepository: Repository<WordTranslation>,
  ) {}

  async addWordToUser(userId: string, dto: AddUserWordDto): Promise<UserWord> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user)
      throw new NotFoundException(`Пользователь с ID ${userId} не найден`);

    const translation = await this.translationRepository.findOne({
      where: { id: dto.translationId },
      relations: ['word'], // если нужно сохранить доступ к слову
    });
    if (!translation)
      throw new NotFoundException(
        `Перевод с ID ${dto.translationId} не найден`,
      );

    let userWord = await this.userWordRepository.findOne({
      where: { user, translation },
    });

    if (!userWord) {
      userWord = this.userWordRepository.create({
        user,
        translation,
        isLearnt: dto.isLearnt,
      });
      await this.userWordRepository.save(userWord);
    }

    return userWord;
  }

  async getAllLearnedWords(userId: string): Promise<UserWord[]> {
    return this.userWordRepository.find({
      where: { user: { id: userId }, isLearnt: true },
      relations: ['translation', 'translation.word'], // включаем слово через перевод
    });
  }

  async getAllUnlearnedWords(userId: string): Promise<UserWord[]> {
    return this.userWordRepository.find({
      where: { user: { id: userId }, isLearnt: false },
      relations: ['translation', 'translation.word'],
    });
  }

  async getUserPoints(userId: string): Promise<number> {
    return this.userWordRepository.count({
      where: { user: { id: userId }, isLearnt: true },
    });
  }

  async updateUserWord(
    userId: string,
    translationId: number,
    dto: UpdateUserWordDto,
  ): Promise<UserWord> {
    const userWord = await this.userWordRepository.findOne({
      where: { user: { id: userId }, translation: { id: translationId } },
    });

    if (!userWord) {
      throw new NotFoundException(
        `Перевод с ID ${translationId} не найден у пользователя`,
      );
    }

    userWord.isLearnt = dto.isLearnt;
    await this.userWordRepository.save(userWord);

    return userWord;
  }

  // Дополнительный метод для получения слов по языку
  async getWordsByLanguage(
    userId: string,
    language: string,
    isLearnt?: boolean,
  ): Promise<UserWord[]> {
    const where: any = {
      user: { id: userId },
      translation: { language },
    };

    if (isLearnt) {
      where.isLearnt = isLearnt;
    }

    return this.userWordRepository.find({
      where,
      relations: ['translation', 'translation.word'],
    });
  }
}
