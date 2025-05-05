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