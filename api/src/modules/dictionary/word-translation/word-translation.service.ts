import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WordTranslation } from './word-translation.entity';
import { CreateWordTranslationDto } from './dto/create-word-translation.dto';
import { UpdateWordTranslationDto } from './dto/update-word-translation.dto';
import { Word } from '../word/word.entity';

@Injectable()
export class WordTranslationService {
  constructor(
    @InjectRepository(WordTranslation)
    private translationRepository: Repository<WordTranslation>,
    @InjectRepository(Word)
    private wordRepository: Repository<Word>,
  ) {}

  async getAll(): Promise<WordTranslation[]> {
    return this.translationRepository.find({ relations: ['word'] });
  }

  async getById(id: number): Promise<WordTranslation> {
    const translation = await this.translationRepository.findOne({
      where: { id },
      relations: ['word'],
    });

    if (!translation) {
      throw new NotFoundException(`Перевод с ID ${id} не найден`);
    }
    return translation;
  }

  async create(dto: CreateWordTranslationDto): Promise<WordTranslation> {
    const word = await this.wordRepository.findOne({
      where: { id: dto.wordId },
    });

    if (!word) {
      throw new NotFoundException(`Слово с ID ${dto.wordId} не найдено`);
    }

    const translation = this.translationRepository.create({
      word,
      translation: dto.translation,
      language: dto.language,
    });

    return this.translationRepository.save(translation);
  }

  async update(
    id: number,
    dto: UpdateWordTranslationDto,
  ): Promise<WordTranslation> {
    const translation = await this.translationRepository.findOne({
      where: { id },
    });

    if (!translation) {
      throw new NotFoundException(`Перевод с ID ${id} не найден`);
    }

    await this.translationRepository.update(id, dto);
    return this.getById(id);
  }

  async delete(id: number): Promise<void> {
    const result = await this.translationRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Перевод с ID ${id} не найден`);
    }
  }
}
