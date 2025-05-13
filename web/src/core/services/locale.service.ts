import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin, map, skip, switchMap, tap } from 'rxjs';
import { LOCALE_LOCALSTORAGE_KEY, LocaleResponse } from '../models';
import { CmsService } from './cms.service';
import { WordLanguage } from '@core/enums/word-language.enum';

@Injectable({
  providedIn: 'root',
})
export class LocaleService {
  private readonly localesList$ = new BehaviorSubject<LocaleResponse[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private readonly translationMap$ = new BehaviorSubject<any>(null);

  public locale$ = new BehaviorSubject<string>(
    localStorage.getItem(LOCALE_LOCALSTORAGE_KEY) || 'en'
  );

  public get translations$() {
    return this.translationMap$.asObservable();
  }

  public get locales$() {
    return this.localesList$.pipe(
      map((list) =>
        list.map((locale) => ({
          name: locale.name,
          code: locale.code,
        }))
      )
    );
  }

  public get currentLocale(): string {
    return this.locale$.value;
  }

  public get currentLocaleBackend(): string {
    if (this.locale$.value === 'fr') {
      return WordLanguage.FRENCH;
    } else if (this.locale$.value === 'de') {
      return WordLanguage.GERMAN;
    } else if (this.locale$.value === 'uk') {
      return WordLanguage.UKRAINIAN;
    }

    return WordLanguage.ENGLISH;
  }

  constructor(private readonly cmsService: CmsService) {}

  public initializeLocalization() {
    const locales$ = this.cmsService.getLocaleList().pipe(tap((list) => this.localesList$.next(list)));

    const localeMap$ = this.cmsService
      .getLocaleMap()
      .pipe(tap((localeMap) => this.translationMap$.next(localeMap)));

    return forkJoin([
      locales$,
      localeMap$,
    ]);
  }

  public getTranslation(path: string): string {
    const localeMap = this.translationMap$.value;
    if (!localeMap) {
      return '';
    }
    return path.split('.').reduce((currentValue, nextValue: any) => {
      if (!currentValue[nextValue]) {
        return path;
      }
      return currentValue[nextValue];
    }, localeMap);
  }

  public trackLocale() {
    return this.locale$.pipe(
      skip(1),
      tap((locale) => localStorage.setItem(LOCALE_LOCALSTORAGE_KEY, locale)),
      switchMap(() => this.reloadLocaleMap()),
    );
  }

  public reloadLocaleMap() {
    return this.cmsService
      .getLocaleMap()
      .pipe(tap((localeMap) => this.translationMap$.next(localeMap)));
  }

  public changeLocale(localeCode: string) {
    this.locale$.next(localeCode);
  }
}