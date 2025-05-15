import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '@core/models/user.model';
import { environment } from '@src/enviroments/enviroment';
import { delay } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private apiUrl: string = environment.apiUrl + '/users';

  constructor(private readonly httpClient: HttpClient) {}

  public getUsers() {
    return this.httpClient.get<User[]>(`${this.apiUrl}`).pipe(
      delay(500)
    );
  }

  public deleteUser(id: string) {
    return this.httpClient.delete(`${this.apiUrl}/${id}`);
  }
}
