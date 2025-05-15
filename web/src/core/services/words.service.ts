import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../enviroments/enviroment';
import { AddWordRequest, AddWordResponse, DeleteWordRequest, EditWordRequest, EditWordResponse, SetWordImageRequest, SetWordImageResponse, Word, WordSearchRequest, WordSearchResponse } from '../models/word.model';
import { delay, Observable } from 'rxjs';
import { WORDS_PER_PAGE } from '@core/constants/word.constants';

interface PagedResponse<T> {
  items: T[];
  total: number;
}

@Injectable({
  providedIn: 'root',
})
export class WordsService {
  private apiUrl = environment.apiUrl + '/words';

  constructor(private readonly http: HttpClient) {}

  public getWords(pageNumber: number, pageSize: number = WORDS_PER_PAGE) {
  const params  = new HttpParams()
    .set('page', pageNumber)
    .set('limit', pageSize)

    return this.http.get<PagedResponse<Word>>(this.apiUrl, { params }).pipe(
      delay(500) //mock delay
    ); 
  }

  public addWord(req: AddWordRequest) {
    return this.http.post<AddWordResponse>(this.apiUrl, req);
  }

  public deleteWord(id: number) {
    return this.http.delete<DeleteWordRequest>(`${this.apiUrl}/${id}`);
  }

  public editWord(id: number, req: EditWordRequest) {
    return this.http.put<EditWordResponse>(`${this.apiUrl}/${id}`, req);
  }

  public searchWord(req: WordSearchRequest) {
    let params = new HttpParams()
      .set('pageNumber', req.pageNumber.toString())
      .set('pageSize',   req.pageSize.toString()); 

    if (req.id != null) {
      params = params.set('id', req.id.toString());
    }
    if (req.word) {
      params = params.set('word', req.word);
    }
    if (req.transcription) {
      params = params.set('transcription', req.transcription);
    }
    if (req.translation) {
      params = params.set('translation', req.translation);
    }
    if (req.category) {
      params = params.set('category', req.category);
    }
    if (req.level) {
      params = params.set('level', req.level);
    }
  
    return this.http
      .get<PagedResponse<Word>>(`${this.apiUrl}/search`, { params });
  }

  public getWordById(id: number) {
    return this.http.get<Word>(`${this.apiUrl}/${id}`);
  }

  public uploadWordImage(file: File, id: number): Observable<any> {
    const fd = new FormData();
    fd.append('image', file, file.name);
    return this.http.post<any>(`${this.apiUrl}/${id}/image`, fd);
  }
}
