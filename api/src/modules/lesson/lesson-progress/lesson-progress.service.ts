import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LessonProgress } from './lesson-progress.entity';
import { User } from '../../user/user.entity';
import { Lesson } from '../lesson/lesson.entity';
import { UpdateLessonProgressDto } from './dto/update-lesson-progress.dto';

@Injectable()
export class LessonProgressService {
  constructor(
    @InjectRepository(LessonProgress)
    private lessonProgressRepository: Repository<LessonProgress>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Lesson)
    private lessonRepository: Repository<Lesson>,
  ) {}

  async getUserLessonProgress(userId: string): Promise<LessonProgress[]> {
    return this.lessonProgressRepository.find({
      where: { user: { id: userId } },
      relations: ['lesson'],
    });
  }

  async markLessonAsCompleted(userId: string, lessonId: number): Promise<LessonProgress> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException(`Пользователь с id ${userId} не найден`);

    const lesson = await this.lessonRepository.findOne({ where: { id: lessonId } });
    if (!lesson) throw new NotFoundException(`Урок с id ${lessonId} не найден`);

    let progress = await this.lessonProgressRepository.findOne({
      where: { user, lesson },
    });

    if (!progress) {
      progress = this.lessonProgressRepository.create({
        user,
        lesson,
        completed: true,
        completedAt: new Date(),
      });
    } else {
      progress.completed = true;
      progress.completedAt = new Date();
    }

    return await this.lessonProgressRepository.save(progress);
  }

  async updateLessonProgress(id: number, updateProgressDto: UpdateLessonProgressDto): Promise<LessonProgress|null> {
    await this.lessonProgressRepository.update(id, updateProgressDto);
    return this.lessonProgressRepository.findOne({ where: { id } });
  }

  async deleteLessonProgress(id: number): Promise<void> {
    const result = await this.lessonProgressRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Прогресс с id ${id} не найден`);
    }
  }
}
