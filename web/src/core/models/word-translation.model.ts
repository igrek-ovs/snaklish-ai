import { Word } from "./word.model";

export interface WordTranslation {
    id: number;
    translation: string;
    language: string;
    word: Word;
    categoryId: number;
}

export interface AddWordTranslationRequest {
    wordId: number;
    translation: string;
    language: string;
}

export interface EditWordTranslationRequest {
    translation: string;
}
