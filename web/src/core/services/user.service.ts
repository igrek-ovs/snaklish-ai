import { Injectable } from '@angular/core';
import { environment } from '../../enviroments/enviroment';
import { HttpClient } from '@angular/common/http';
import {
  ChangePasswordDto,
  UpdateUserDto,
  UserDto,
} from '../contracts/data-contracts';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl: string = environment.apiUrl + '/users';

  constructor(private readonly httpClient: HttpClient) {}

  public getUser() {
    return this.httpClient.get<UserDto>(`${this.apiUrl}/me`);
  }

  public updateUser(req: UpdateUserDto) {
    return this.httpClient.put<UserDto>(`${this.apiUrl}/me`, req);
  }

  public changePassword(req: ChangePasswordDto) {
    return this.httpClient.put<ChangePasswordDto>(
      `${this.apiUrl}/me/password`,
      req
    );
  }
}
