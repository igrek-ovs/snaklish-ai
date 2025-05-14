import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@src/enviroments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class UserWordsService {
  private readonly apiUrl = `${environment.apiUrl}/user-words`;

  constructor(private readonly http: HttpClient) { }

  public getUserWords() {
    return this.http.get<any[]>(this.apiUrl);
  }
}
