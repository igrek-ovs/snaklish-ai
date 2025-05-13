import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AddWordTranslationRequest, EditWordTranslationRequest, WordTranslation } from '@core/models/word-translation.model';
import { environment } from '@src/enviroments/enviroment';
import { map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WordTranslationsService {
  private readonly apiUrl = environment.apiUrl + '/word-translations';

  constructor(private readonly http: HttpClient) { }

  public getTranslations() {
    return this.http.get<WordTranslation[]>(this.apiUrl).pipe(tap(console.log));
  }

  public getTranslationById(id: number) {
    return this.http.get<WordTranslation>(`${this.apiUrl}/${id}`).pipe(
      map((response) => response.translation),
    );
  }

  public editTranslation(id: number, req: EditWordTranslationRequest) {
    return this.http.put<WordTranslation>(`${this.apiUrl}/${id}`, req);
  }

  public addTranslation(req: AddWordTranslationRequest) {
    console.log('addTranslation', req);
    return this.http.post<WordTranslation>(this.apiUrl, req);
  }
}
