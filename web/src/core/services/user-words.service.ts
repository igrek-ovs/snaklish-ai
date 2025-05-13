import { Injectable } from '@angular/core';
import { environment } from '@src/enviroments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class UserWordsService {
  private readonly apiUrl = `${environment.apiUrl}/user-words`;

  constructor() { }

  public getUserWords() {
    
  }
}
