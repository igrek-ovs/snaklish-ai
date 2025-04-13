import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../enviroments/enviroment';
import { TOKEN_DATA } from '../services/authentication.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
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
      return next(clonedReq);
    }
  }

  return next(req);
};
