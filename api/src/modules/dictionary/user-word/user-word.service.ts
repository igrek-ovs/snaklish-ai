import {
  Injectable,
  NotFoundException,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserWord } from './user-word.entity';
import { User } from '../../user/user.entity';
import { WordTranslation } from '../word-translation/word-translation.entity';
import { AddUserWordDto } from './dto/add-user-word.dto';
import { UpdateUserWordDto } from './dto/update-user-word.dto';

@Injectable()
export class UserWordService {
  private readonly logger = new Logger(UserWordService.name);

  constructor(
    @InjectRepository(UserWord)
    private userWordRepository: Repository<UserWord>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(WordTranslation)
    private translationRepository: Repository<WordTranslation>,
  ) {}

  async addWordToUser(userId: string, dto: AddUserWordDto): Promise<UserWord> {
    try {
      const translation = await this.translationRepository.findOneBy({
        id: dto.translationId,
      });
      if (!translation) {
        throw new NotFoundException(
          `Translation with ID ${dto.translationId} not found`,
        );
      }

      let userWord = await this.userWordRepository.findOne({
        where: {
          user: { id: userId },
          translation: { id: dto.translationId },
        },
      });

      if (!userWord) {
        // 3) И здесь тоже userWordRepository
        userWord = this.userWordRepository.create({
          user: { id: userId } as any,
          translation: { id: dto.translationId } as any,
          isLearnt: dto.isLearnt,
        });
        userWord = await this.userWordRepository.save(userWord);
        this.logger.log(
          `Added new word to user: userId=${userId}, translationId=${dto.translationId}`,
        );
      }

      return userWord;
    } catch (err) {
      if (err instanceof NotFoundException) throw err;
      this.logger.error(
        `Failed to add word to userId=${userId}: ${err.message}`,
        err.stack,
      );
      throw new InternalServerErrorException('Failed to add word to user');
    }
  }

  async getAllLearnedWords(userId: string): Promise<UserWord[]> {
    try {
      const words = await this.userWordRepository.find({
        where: { user: { id: userId }, isLearnt: true },
        relations: ['translation', 'translation.word'],
      });
      this.logger.log(
        `Fetched ${words.length} learned words for userId=${userId}`,
      );
      return words;
    } catch (error) {
      this.logger.error(
        `Failed to fetch learned words for userId=${userId}: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Failed to fetch learned words for user',
      );
    }
  }

  async getAllUnlearnedWords(userId: string): Promise<UserWord[]> {
    try {
      const words = await this.userWordRepository.find({
        where: { user: { id: userId }, isLearnt: false },
        relations: ['translation', 'translation.word'],
      });
      this.logger.log(
        `Fetched ${words.length} unlearned words for userId=${userId}`,
      );
      return words;
    } catch (error) {
      this.logger.error(
        `Failed to fetch unlearned words for userId=${userId}: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Failed to fetch unlearned words for user',
      );
    }
  }

  async getUserPoints(userId: string): Promise<number> {
    try {
      const count = await this.userWordRepository.count({
        where: { user: { id: userId }, isLearnt: true },
      });
      this.logger.log(
        `User points (learned words count) for userId=${userId}: ${count}`,
      );
      return count;
    } catch (error) {
      this.logger.error(
        `Failed to count user points for userId=${userId}: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('Failed to get user points');
    }
  }

  async updateUserWord(
    userId: string,
    translationId: number,
    dto: UpdateUserWordDto,
  ): Promise<UserWord> {
    try {
      const userWord = await this.userWordRepository.findOne({
        where: { user: { id: userId }, translation: { id: translationId } },
      });

      if (!userWord) {
        this.logger.warn(
          `UserWord not found for userId=${userId}, translationId=${translationId}`,
        );
        throw new NotFoundException(
          `Translation with ID ${translationId} not found for user`,
        );
      }

      userWord.isLearnt = dto.isLearnt;
      await this.userWordRepository.save(userWord);
      this.logger.log(
        `UserWord updated: userId=${userId}, translationId=${translationId}, isLearnt=${dto.isLearnt}`,
      );

      return userWord;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      this.logger.error(
        `Failed to update UserWord for userId=${userId}, translationId=${translationId}: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('Failed to update user word');
    }
  }

  async getWordsByLanguage(
    userId: string,
    language: string,
    isLearnt?: boolean,
  ): Promise<UserWord[]> {
    try {
      const where: any = {
        user: { id: userId },
        translation: { language },
      };

      if (isLearnt !== undefined) {
        where.isLearnt = isLearnt;
      }

      const words = await this.userWordRepository.find({
        where,
        relations: ['translation', 'translation.word'],
      });

      this.logger.log(
        `Fetched ${words.length} words for userId=${userId} by language=${language} (isLearnt=${isLearnt})`,
      );

      return words;
    } catch (error) {
      this.logger.error(
        `Failed to fetch words by language for userId=${userId}, language=${language}: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Failed to fetch words by language',
      );
    }
  }
}
