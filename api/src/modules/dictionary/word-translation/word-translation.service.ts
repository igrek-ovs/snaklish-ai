import {
  Injectable,
  NotFoundException,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WordTranslation } from './word-translation.entity';
import { CreateWordTranslationDto } from './dto/create-word-translation.dto';
import { UpdateWordTranslationDto } from './dto/update-word-translation.dto';
import { Word } from '../word/word.entity';

@Injectable()
export class WordTranslationService {
  private readonly logger = new Logger(WordTranslationService.name);

  constructor(
    @InjectRepository(WordTranslation)
    private translationRepository: Repository<WordTranslation>,
    @InjectRepository(Word)
    private wordRepository: Repository<Word>,
  ) {}

  async getAll(): Promise<WordTranslation[]> {
    try {
      const translations = await this.translationRepository.find({
        relations: ['word'],
      });
      this.logger.log(`Fetched ${translations.length} translations`);
      return translations;
    } catch (error) {
      this.logger.error(
        `Failed to fetch translations: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('Failed to fetch translations');
    }
  }

  async getById(id: number): Promise<WordTranslation> {
    try {
      const translation = await this.translationRepository.findOne({
        where: { id },
        relations: ['word'],
      });

      if (!translation) {
        this.logger.warn(`Translation with ID ${id} not found`);
        throw new NotFoundException(`Translation with ID ${id} not found`);
      }
      this.logger.log(`Fetched translation with ID: ${id}`);
      return translation;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      this.logger.error(
        `Failed to fetch translation with ID ${id}: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('Failed to fetch translation');
    }
  }

  async create(dto: CreateWordTranslationDto): Promise<WordTranslation> {
    try {
      const word = await this.wordRepository.findOne({
        where: { id: dto.wordId },
      });

      if (!word) {
        this.logger.warn(`Word with ID ${dto.wordId} not found`);
        throw new NotFoundException(`Word with ID ${dto.wordId} not found`);
      }

      const translation = this.translationRepository.create({
        word,
        translation: dto.translation,
        language: dto.language,
      });

      const savedTranslation =
        await this.translationRepository.save(translation);
      this.logger.log(
        `Created translation with ID: ${savedTranslation.id} for wordId: ${dto.wordId}`,
      );
      return savedTranslation;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      this.logger.error(
        `Failed to create translation: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('Failed to create translation');
    }
  }

  async update(
    id: number,
    dto: UpdateWordTranslationDto,
  ): Promise<WordTranslation> {
    try {
      const translation = await this.translationRepository.findOne({
        where: { id },
      });

      if (!translation) {
        this.logger.warn(`Translation with ID ${id} not found`);
        throw new NotFoundException(`Translation with ID ${id} not found`);
      }

      await this.translationRepository.update(id, dto);
      this.logger.log(`Updated translation with ID: ${id}`);
      return this.getById(id);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      this.logger.error(
        `Failed to update translation with ID ${id}: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('Failed to update translation');
    }
  }

  async delete(id: number): Promise<void> {
    try {
      const result = await this.translationRepository.delete(id);
      if (result.affected === 0) {
        this.logger.warn(`Translation with ID ${id} not found for deletion`);
        throw new NotFoundException(`Translation with ID ${id} not found`);
      }
      this.logger.log(`Deleted translation with ID: ${id}`);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      this.logger.error(
        `Failed to delete translation with ID ${id}: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('Failed to delete translation');
    }
  }
}
