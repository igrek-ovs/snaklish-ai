import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../enviroments/enviroment';
import { Word } from '../models/word.model';

@Injectable({
  providedIn: 'root',
})
export class WordsService {
  private apiUrl = environment.apiUrl + '/words';

  constructor(private readonly http: HttpClient) {}

  public getWords() {
    return this.http.get<Word[]>(this.apiUrl);
  }
}
