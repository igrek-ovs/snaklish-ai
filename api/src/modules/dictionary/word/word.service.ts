import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Word } from './word.entity';
import { WordTranslation } from '../word-translation/word-translation.entity';
import { CreateWordDto } from './dto/create-word.dto';
import { UpdateWordDto } from './dto/update-word.dto';
import { Category } from '../category/category.entity';
import {SearchWordsDto} from "./dto/search-words.dto";

@Injectable()
export class WordService {
  private readonly logger = new Logger(WordService.name);

  constructor(
    @InjectRepository(Word)
    private wordRepository: Repository<Word>,
    @InjectRepository(WordTranslation)
    private translationRepository: Repository<WordTranslation>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async getAll(): Promise<Word[]> {
    try {
      const words = await this.wordRepository.find({
        relations: ['translations', 'category'],
      });
      this.logger.log(`Fetched ${words.length} words`);
      return words;
    } catch (error) {
      this.logger.error(`Failed to fetch words: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to fetch words');
    }
  }

  async getById(id: number): Promise<Word> {
    try {
      const word = await this.wordRepository.findOne({
        where: { id },
        relations: ['translations', 'category'],
      });
      if (!word) {
        this.logger.warn(`Word with ID ${id} not found`);
        throw new NotFoundException(`Word with ID ${id} not found`);
      }
      this.logger.log(`Fetched word with ID: ${id}`);
      return word;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      this.logger.error(
        `Failed to fetch word with ID ${id}: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('Failed to fetch word');
    }
  }

  async create(dto: CreateWordDto): Promise<Word> {
    try {
      const word = this.wordRepository.create({
        level: dto.level,
        word: dto.word,
        transcription: dto.transcription,
        examples: dto.examples,
      });

      if (dto.categoryId) {
        const category = await this.categoryRepository.findOne({
          where: { id: dto.categoryId },
        });
        if (!category) {
          this.logger.warn(`Category with ID ${dto.categoryId} not found`);
          throw new NotFoundException(
            `Category with ID ${dto.categoryId} not found`,
          );
        }
        word.category = category;
      }

      const savedWord = await this.wordRepository.save(word);
      this.logger.log(`Word created with ID: ${savedWord.id}`);
      return this.getById(savedWord.id);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      this.logger.error(`Failed to create word: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to create word');
    }
  }

  async update(id: number, dto: UpdateWordDto): Promise<Word> {
    try {
      const word = await this.wordRepository.findOne({ where: { id } });
      if (!word) {
        this.logger.warn(`Word with ID ${id} not found`);
        throw new NotFoundException(`Word with ID ${id} not found`);
      }

      if (dto.categoryId !== undefined) {
        const category = await this.categoryRepository.findOne({
          where: { id: dto.categoryId },
        });
        if (!category) {
          this.logger.warn(`Category with ID ${dto.categoryId} not found`);
          throw new NotFoundException(
            `Category with ID ${dto.categoryId} not found`,
          );
        }
        word.category = category;
      }

      const updatedWord = this.wordRepository.merge(word, dto);
      await this.wordRepository.save(updatedWord);
      this.logger.log(`Word updated with ID: ${id}`);
      return this.getById(id);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      this.logger.error(
        `Failed to update word with ID ${id}: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('Failed to update word');
    }
  }

  async delete(id: number): Promise<void> {
    try {
      const result = await this.wordRepository.delete(id);
      if (result.affected === 0) {
        this.logger.warn(`Word with ID ${id} not found for deletion`);
        throw new NotFoundException(`Word with ID ${id} not found`);
      }
      this.logger.log(`Word deleted with ID: ${id}`);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      this.logger.error(
        `Failed to delete word with ID ${id}: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('Failed to delete word');
    }
  }

  async addImage(id: number, imageBuffer: Buffer): Promise<Word> {
    try {
      const word = await this.wordRepository.findOne({ where: { id } });
      if (!word) {
        this.logger.warn(`Word with ID ${id} not found`);
        throw new NotFoundException(`Word with ID ${id} not found`);
      }
      if (!imageBuffer || imageBuffer.length === 0) {
        this.logger.warn(`No image provided for word ID ${id}`);
        throw new BadRequestException('No image provided');
      }
      word.img = imageBuffer;
      await this.wordRepository.save(word);
      this.logger.log(`Image added to word with ID: ${id}`);
      return word;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      )
        throw error;

      this.logger.error(
        `Failed to add image to word with ID ${id}: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('Failed to add image to word');
    }
  }

  async advancedSearch(filters: SearchWordsDto): Promise<Word[]> {
    try {
      const query = this.wordRepository
        .createQueryBuilder('word')
        .leftJoinAndSelect('word.translations', 'translation')
        .leftJoinAndSelect('word.category', 'category');

      if (filters.id) {
        query.andWhere('word.id = :id', { id: filters.id });
      }

      if (filters.word) {
        query.andWhere('word.word LIKE :word', { word: `%${filters.word}%` });
      }

      if (filters.transcription) {
        query.andWhere('word.transcription LIKE :transcription', {
          transcription: `%${filters.transcription}%`,
        });
      }

      if (filters.translation) {
        query.andWhere('translation.translation LIKE :translation', {
          translation: `%${filters.translation}%`,
        });
      }

      if (filters.category) {
        query.andWhere('category.name LIKE :category', {
          category: `%${filters.category}%`,
        });
      }

      const results = await query.getMany();
      this.logger.log(`Advanced search returned ${results.length} results`);
      return results;
    } catch (error) {
      this.logger.error(
        `Failed to perform advanced search: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Failed to perform advanced search',
      );
    }
  }
}
