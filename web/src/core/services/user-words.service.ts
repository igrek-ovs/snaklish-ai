import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserWord } from '@core/models';
import { environment } from '@src/enviroments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class UserWordsService {
  private readonly apiUrl = `${environment.apiUrl}/user-words`;

  constructor(private readonly http: HttpClient) { }

  public getUnlearnedUserWords() {
    return this.http.get<UserWord[]>(`${this.apiUrl}/unlearned`);
  }

  public getLearnedUserWords() {
    return this.http.get<UserWord[]>(`${this.apiUrl}/learned`);
  }

  public learnWord(wordId: number) {
    return this.http.post(`${this.apiUrl}/learn`, { wordId });
  }
}
