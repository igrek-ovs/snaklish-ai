import {
  Injectable,
  NotFoundException,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  private readonly logger = new Logger(CategoryService.name);

  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async findAll(): Promise<Category[]> {
    try {
      const categories = await this.categoryRepository.find();
      this.logger.log(`Fetched ${categories.length} categories`);
      return categories;
    } catch (error) {
      this.logger.error(
        `Failed to fetch categories: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('Failed to fetch categories');
    }
  }

  async findOne(id: number): Promise<Category> {
    try {
      const category = await this.categoryRepository.findOne({ where: { id } });
      if (!category) {
        this.logger.warn(`Category with ID ${id} not found`);
        throw new NotFoundException(`Category with ID ${id} not found`);
      }
      this.logger.log(`Fetched category with ID: ${id}`);
      return category;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      this.logger.error(
        `Failed to fetch category with ID ${id}: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('Failed to fetch category');
    }
  }

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    try {
      const category = this.categoryRepository.create(createCategoryDto);
      const savedCategory = await this.categoryRepository.save(category);
      this.logger.log(`Category created with ID: ${savedCategory.id}`);
      return savedCategory;
    } catch (error) {
      this.logger.error(
        `Failed to create category: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('Failed to create category');
    }
  }

  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    try {
      const category = await this.findOne(id);
      const updatedCategory = Object.assign(category, updateCategoryDto);
      const savedCategory = await this.categoryRepository.save(updatedCategory);
      this.logger.log(`Category updated with ID: ${id}`);
      return savedCategory;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      this.logger.error(
        `Failed to update category with ID ${id}: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('Failed to update category');
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const result = await this.categoryRepository.delete(id);
      if (result.affected === 0) {
        this.logger.warn(`Category with ID ${id} not found for deletion`);
        throw new NotFoundException(`Category with ID ${id} not found`);
      }
      this.logger.log(`Category deleted with ID: ${id}`);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      this.logger.error(
        `Failed to delete category with ID ${id}: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('Failed to delete category');
    }
  }
}
