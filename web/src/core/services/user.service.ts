import { Injectable } from '@angular/core';
import { environment } from '../../enviroments/enviroment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl: string = environment.apiUrl + '/users';

  constructor(private readonly httpClient: HttpClient) {}

  public getUser() {
    return this.httpClient.get(`${this.apiUrl}/me`);
  }
}
