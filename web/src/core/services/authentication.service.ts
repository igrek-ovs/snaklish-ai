import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../enviroments/enviroment';

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

interface Login {
  email: string;
  password: string;
}

interface SignUp {
  name: string;
  email: string;
  password: string;
}

export const TOKEN_DATA = 'tokenData';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private readonly apiUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  public login(payload: Login) {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, payload);
  }

  public signUp(payload: SignUp) {
    return this.http.post<LoginResponse>(`${this.apiUrl}/register`, payload);
  }

  public refreshToken(refreshToken: string) {
    return this.http.post<LoginResponse>(`${this.apiUrl}/refresh`, {
      refreshToken,
    });
  }

  public saveTokenData(tokenData: LoginResponse): void {
    localStorage.setItem(TOKEN_DATA, JSON.stringify(tokenData));
  }

  public getTokenData(): LoginResponse | null {
    const tokenData = localStorage.getItem(TOKEN_DATA);
    return tokenData ? JSON.parse(tokenData) : null;
  }
}
