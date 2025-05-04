import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LocaleService } from './services';
import { environment } from '@src/enviroments/enviroment';

export const localeInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith(environment.cms.apiUrl)) {
    return next(req);
  }

  const locale = inject(LocaleService).locale$.value;
  const separator = req.url.includes('?') ? '&' : '?';
  const urlWithLocale = `${req.url}${separator}locale=${locale}`;

  const headers = req.headers.set('Authorization', `Bearer ${environment.cms.apiKey}`);
  return next(req.clone({ url: urlWithLocale, headers }));
};
