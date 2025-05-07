import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../enviroments/enviroment';
import { AddWordRequest, Word } from '../models/word.model';
import { delay } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WordsService {
  private apiUrl = environment.apiUrl + '/words';

  constructor(private readonly http: HttpClient) {}

  public getWords() {
    return this.http.get<Word[]>(this.apiUrl).pipe(
      delay(1500) //mock delay
    );
  }

  public addWord(req: AddWordRequest) {
    return this.http.post<AddWordRequest>(this.apiUrl, req);
  }
}
