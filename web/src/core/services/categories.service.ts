import { Injectable } from '@angular/core';
import { environment } from '../../enviroments/enviroment';
import { HttpClient } from '@angular/common/http';
import { AddNewCategoryRequest, AddNewCategoryResponse, Category } from '@core/models';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  private apiUrl = '/categories';

  constructor(private readonly http: HttpClient) {}

  public getCategories() {
    return this.http.get<Category[]>(`${environment.apiUrl}${this.apiUrl}`);
  }

  public addCategory(req: AddNewCategoryRequest) {
    return this.http.post<AddNewCategoryResponse>(`${environment.apiUrl}${this.apiUrl}`, req);
  }
}
