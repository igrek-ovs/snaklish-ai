import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Word } from './word.entity';
import { WordTranslation } from '../word-translation/word-translation.entity';
import { CreateWordDto } from './dto/create-word.dto';
import { UpdateWordDto } from './dto/update-word.dto';

@Injectable()
export class WordService {
  constructor(
    @InjectRepository(Word)
    private wordRepository: Repository<Word>,
    @InjectRepository(WordTranslation)
    private translationRepository: Repository<WordTranslation>,
  ) {}

  async getAll(): Promise<Word[]> {
    return this.wordRepository.find({ relations: ['translations'] });
  }

  async getById(id: number): Promise<Word> {
    const word = await this.wordRepository.findOne({
      where: { id },
      relations: ['translations'],
    });

    if (!word) {
      throw new NotFoundException(`Слово с ID ${id} не найдено`);
    }
    return word;
  }

  async create(dto: CreateWordDto): Promise<Word> {
    const word = this.wordRepository.create({ level: dto.level, word: dto.word });
    const savedWord = await this.wordRepository.save(word);

    return this.getById(savedWord.id);
  }

  async update(id: number, dto: UpdateWordDto): Promise<Word> {
    await this.wordRepository.update(id, dto);
    return this.getById(id);
  }

  async delete(id: number): Promise<void> {
    const result = await this.wordRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Слово с ID ${id} не найдено`);
    }
  }
}
