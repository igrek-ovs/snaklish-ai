import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  ParseIntPipe,
  UseGuards,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { Category } from './category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { SearchCategoriesDto } from './dto/search-categories.dto';

@ApiBearerAuth()
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async findAll(): Promise<Category[]> {
    return this.categoryService.findAll();
  }

  @ApiOperation({ summary: 'Advanced search for categories' })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  @Get('search')
  async search(@Query() filters: SearchCategoriesDto): Promise<Category[]> {
    return this.categoryService.advancedSearch(filters);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Category> {
    return this.categoryService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Post()
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    return this.categoryService.create(createCategoryDto);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.categoryService.remove(id);
  }
}
