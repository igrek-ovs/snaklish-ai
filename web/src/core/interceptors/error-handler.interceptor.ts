import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { HotToastService } from '@ngxpert/hot-toast';
import { catchError, throwError } from 'rxjs';

export const errorHandlerInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(HotToastService);

  return next(req).pipe(
    catchError((error) => {
      if (error.status === 401) {
        toast.error('Unauthorized access. Please log in again.');
      } else if (error.status === 404) {
        toast.error('Ресурс не був знайдений.');
      } else if (error.status >= 500) {
        toast.error('Server error. Please try again later.');
      } else {
        toast.error('An unexpected error occurred.');
      }
      return throwError(() => error);
    })
  );
};
