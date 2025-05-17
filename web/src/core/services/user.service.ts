import { Injectable } from '@angular/core';
import { environment } from '../../enviroments/enviroment';
import { HttpClient } from '@angular/common/http';
import { LAST_WORD, TOKEN_DATA } from './authentication.service';
import { BehaviorSubject, tap } from 'rxjs';
import { User } from '@core/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  public user$ = new BehaviorSubject<User | null>(null);
  public userRole$ = new BehaviorSubject<string | null>(null);

  private apiUrl: string = environment.apiUrl + '/users';

  constructor(private readonly httpClient: HttpClient) {}

  public getUser() {
    return this.httpClient.get<any>(`${this.apiUrl}/me`).pipe(
      tap((user) => {
        this.user$.next(user);
        
        const userRole = user.role;
        this.userRole$.next(userRole);
      }),
    );
  }

  public updateUser(req: any) {
    return this.httpClient.put<any>(`${this.apiUrl}/me`, req);
  }

  public changePassword(req: any) {
    return this.httpClient.put<any>(`${this.apiUrl}/me/password`, req);
  }

  public signOut() {
    localStorage.removeItem(TOKEN_DATA);
    localStorage.removeItem(LAST_WORD);
    this.user$.next(null);
    this.userRole$.next(null);
  }
}
