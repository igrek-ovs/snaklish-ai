import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../enviroments/enviroment';
import {
  AuthenticationService,
  TOKEN_DATA,
} from '../services/authentication.service';
import { catchError, switchMap, throwError } from 'rxjs';
import { inject } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthenticationService);

  if (req.url.includes('/auth/refresh')) {
    return next(req);
  }

  if (req.url.startsWith(environment.apiUrl)) {
    const tokenData = localStorage.getItem(TOKEN_DATA);

    let accessToken = '';
    if (tokenData) {
      try {
        const tokenObject = JSON.parse(tokenData);
        accessToken = tokenObject.accessToken;
      } catch (error) {
        console.error('Error parsing token data', error);
      }
    }

    if (accessToken) {
      const clonedReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${accessToken}`),
      });

      return next(clonedReq).pipe(
        catchError((error) => {
          if (error.status === 401 && req.url.startsWith(environment.apiUrl)) {
            const tokenData = authService.getTokenData();
            if (tokenData && tokenData.refreshToken) {
              return authService.refreshToken(tokenData.refreshToken).pipe(
                switchMap((newToken) => {
                  authService.saveTokenData(newToken);
                  const newReq = req.clone({
                    headers: req.headers.set(
                      'Authorization',
                      `Bearer ${newToken.accessToken}`
                    ),
                  });
                  return next(newReq);
                }),
                catchError((refreshError) => throwError(() => refreshError))
              );
            }
          }
          return throwError(() => error);
        })
      );
    }
  }

  return next(req);
};
