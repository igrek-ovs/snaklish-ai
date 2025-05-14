export interface Translation {
  id: number;
  translation: string;
  language: string;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  img: string | null;
}

export interface Word {
  id: number;
  level: string;
  word: string;
  transcription: string;
  examples: string;
  img: string | null;
  translations: Translation[];
  categoryId: number;
  category: Category;
}

export interface AddWordRequest {
  level: string;
  word: string;
  transcription: string;
  examples: string;
  categoryId: number;
}

export interface AddWordResponse {
  id: number;
  level: string;
  word: string;
  transcription: string;
  examples: string;
  img: string | null;
  translations: Translation[];
  categoryId: Category;
}

export interface DeleteWordRequest {
  id: number;
}

export interface EditWordRequest {
  id: number;
  level: string;
  word: string;
  transcription: string;
  examples: string;
  img: string | null;
  translations: Translation[];
  categoryId: number;
}

export interface EditWordResponse {
  id: number;
  level: string;
  word: string;
  transcription: string;
  examples: string;
  img: string | null;
  translations: Translation[];
  categoryId: Category;
}

export interface AddNewCategoryRequest {
  name: string;
  description: string;
}

export interface AddNewCategoryResponse {
  id: number;
  name: string;
  description: string;
  img: string | null;
}

export interface WordSearchRequest {
  id?: number;
  word?: string;
  transcription?: string;
  translation?: string;
  category?: string;
  pageNumber: number;
  pageSize: number;
}

export interface WordSearchResponse {
  id: number;
  level: string;
  word: string;
  transcription: string;
  examples: string;
  img: string | null;
  translations: Translation[];
  category: Category;
  categoryId: number;
}

export interface SetWordImageRequest {
  image: string;
}

export interface SetWordImageResponse {
  id: number;
  level: string;
  word: string;
  transcription: string;
  examples: string;
  img: string | null;
  translations: Translation[];
  categoryId: number;
}
