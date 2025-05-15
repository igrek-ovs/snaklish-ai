import { Injectable } from '@angular/core';
import { environment } from '../../enviroments/enviroment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AddNewCategoryRequest, AddNewCategoryResponse, Category } from '@core/models';
import { delay } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  private apiUrl = '/categories';

  constructor(private readonly http: HttpClient) {}

  public getCategories() {
    return this.http.get<Category[]>(`${environment.apiUrl}${this.apiUrl}`).pipe(
      delay(500),
    );
  }

  public addCategory(req: AddNewCategoryRequest) {
    return this.http.post<AddNewCategoryResponse>(`${environment.apiUrl}${this.apiUrl}`, req);
  }

  public updateCategory(id: number, req: { name: string, description: string }) {
    return this.http.put<AddNewCategoryResponse>(`${environment.apiUrl}${this.apiUrl}/${id}`, req);
  }

  public deleteCategory(id: number) {
    return this.http.delete(`${environment.apiUrl}${this.apiUrl}/${id}`);
  }

  public searchCategory(filters: {
    id?: number;
    name?: string;
    description?: string;
    category?: string;
  }) {
    let params = new HttpParams();

    if (filters.id != null) {
      params = params.set('id', filters.id.toString());
    }
    if (filters.name) {
      params = params.set('name', filters.name);
    }
    if (filters.description) {
      params = params.set('description', filters.description);
    }
    if (filters.category) {
      params = params.set('category', filters.category);
    }

    return this.http.get<Category[]>(
      `${environment.apiUrl}${this.apiUrl}/search`,
      { params }
    );
  }
}
