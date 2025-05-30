import { Pipe, type PipeTransform } from '@angular/core';
import { map, Observable } from 'rxjs';
import { LocaleService } from '../services';

@Pipe({
  name: 'appTranslate',
  standalone: true,
})
export class TranslatePipe implements PipeTransform {
  constructor(private localeService: LocaleService) {}

  transform(path: string): Observable<string> {
    return this.localeService.translations$.pipe(
      map((localeMap: any) => {
        if (!path.trim().length) {
          return '';
        }
        if (!path) {
          return '<incorrect-translate-path>';
        }
        if (!localeMap) {
          return '';
        }
        const translation = path.split('.').reduce((currentValue, nextValue: any) => {
          if (!currentValue[nextValue]) {
            return path;
          }
          return currentValue[nextValue];
        }, localeMap);

        return translation;
      })
    );
  }
}
