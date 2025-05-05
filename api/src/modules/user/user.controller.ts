import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { GetUserResultDto } from './dto/get-user-result.dto';
import { UserService } from './user.service';
import { UserDto } from './dto/user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
@ApiBearerAuth()
@ApiTags('Пользователи')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Получить текущего пользователя' })
  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  async getMe(@Req() req): Promise<GetUserResultDto | null> {
    return this.userService.getById(req.user.id);
  }

  @ApiOperation({ summary: 'Получить всех пользователей' })
  @Get()
  async getAll(): Promise<GetUserResultDto[]> {
    return this.userService.getAll();
  }

  // @UseGuards(AuthGuard('jwt'), RolesGuard)
  // @Roles('admin')
  @ApiOperation({ summary: 'Создать пользователя' })
  @Post()
  async create(@Body() userDto: UserDto): Promise<GetUserResultDto> {
    return this.userService.create(userDto);
  }

  @ApiOperation({ summary: 'Обновить данные текущего пользователя' })
  @UseGuards(AuthGuard('jwt'))
  @Put('me')
  async update(
    @Req() req,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<GetUserResultDto> {
    return this.userService.update(req.user.id, updateUserDto);
  }

  @ApiOperation({ summary: 'Обновить пароль текущего пользователя' })
  @UseGuards(AuthGuard('jwt'))
  @Put('me/password')
  async changePassword(
    @Req() req,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<GetUserResultDto> {
    return this.userService.changePassword(
      req.user.id,
      changePasswordDto.password,
    );
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Удалить пользователя' })
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.userService.delete(id);
  }
}
