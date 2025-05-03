export interface Translation {
  id: number;
  translation: string;
  language: string;
}

export interface Word {
  id: number;
  level: string;
  word: string;
  transcription: string;
  examples: string;
  img: string | null;
  translations: Translation[];
}
