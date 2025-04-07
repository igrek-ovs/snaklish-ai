/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface UserDto {
  /**
   * Имя пользователя
   * @example "Иван Иванов"
   */
  name: string;
  /**
   * Email пользователя
   * @example "user@example.com"
   */
  email: string;
  /**
   * Пароль пользователя (не хешированный)
   * @example "StrongPass123!"
   */
  password: string;
  /**
   * Роль пользователя
   * @default "user"
   * @example "user"
   */
  role: "user" | "admin";
}

export interface UpdateUserDto {
  /**
   * Новое имя пользователя
   * @example "Иван Иванов"
   */
  name?: string;
  /**
   * Новый Email пользователя
   * @example "user@example.com"
   */
  email?: string;
  /**
   * Новая роль пользователя
   * @example "admin"
   */
  role?: "user" | "admin";
}

export interface ChangePasswordDto {
  /**
   * Новый пароль
   * @example "StrongPass123!"
   */
  password: string;
}

export interface LoginDto {
  /**
   * Электронная почта пользователя
   * @example "user@example.com"
   */
  email: string;
  /**
   * Пароль пользователя
   * @example "StrongP@ssw0rd!"
   */
  password: string;
}

export interface CreateLessonDto {
  /**
   * Название урока
   * @example "Past Simple"
   */
  title: string;
  /**
   * Описание урока
   * @example "Как использовать Past Simple?"
   */
  description?: string;
  /**
   * Уровень урока
   * @example "A2"
   */
  level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
  /**
   * Основной контент урока
   * @example "Объяснение..."
   */
  content: string;
  /**
   * Ссылка на YouTube видео
   * @example "https://youtu.be/xyz"
   */
  youtubeLink?: string;
}

export type UpdateLessonDto = object;

export interface CreateExerciseDto {
  /**
   * ID урока, к которому относится упражнение
   * @example 1
   */
  lessonId: number;
  /**
   * Вопрос упражнения
   * @example "Какой артикль используется перед словом "apple"?"
   */
  question: string;
  /**
   * ID правильного варианта ответа
   * @example 2
   */
  correctOptionId: number;
}

export interface UpdateExerciseDto {
  /**
   * Обновленный текст вопроса
   * @example "Обновленный вопрос"
   */
  question?: string;
  /**
   * Обновленный ID правильного варианта ответа
   * @example 1
   */
  correctOptionId?: number;
}

export interface CreateExerciseOptionDto {
  /**
   * ID упражнения, к которому относится вариант ответа
   * @example 1
   */
  exerciseId: number;
  /**
   * Текст варианта ответа
   * @example "Вариант 1"
   */
  optionText: string;
}

export interface UpdateExerciseOptionDto {
  /** @example "Обновленный вариант ответа" */
  optionText?: string;
}

export interface UpdateLessonProgressDto {
  /**
   * Флаг завершения урока
   * @example true
   */
  completed?: boolean;
}

export interface CreateUserAnswerDto {
  /**
   * ID пользователя
   * @example "550e8400-e29b-41d4-a716-446655440000"
   */
  userId: string;
  /**
   * ID упражнения
   * @example 1
   */
  exerciseId: number;
  /**
   * ID выбранного варианта ответа
   * @example 2
   */
  selectedOptionId: number;
}

export interface VerifyEmailDto {
  /**
   * Код подтверждения email
   * @example "123456"
   */
  code: string;
}

export interface CreateWordDto {
  /**
   * English word level
   * @example "A2"
   */
  level: string;
  /**
   * Word on ukrainian
   * @example "мати"
   */
  word: string;
}

export type UpdateWordDto = object;

export interface CreateWordTranslationDto {
  /**
   * ID слова
   * @example 1
   */
  wordId: number;
  /**
   * Текст перевода
   * @example "Перевод слова"
   */
  translation: string;
}

export interface UpdateWordTranslationDto {
  /**
   * Текст перевода
   * @example "Обновленный перевод"
   */
  translation: string;
}

export interface AddUserWordDto {
  /**
   * ID слова
   * @example 123
   */
  wordId: number;
  /**
   * Пометить слово как изученное
   * @default false
   * @example false
   */
  isLearnt: boolean;
}

export interface UpdateUserWordDto {
  /**
   * Пометить слово как изученное
   * @example true
   */
  isLearnt: boolean;
}
