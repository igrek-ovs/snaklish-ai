import { APP_INITIALIZER, ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideHotToastConfig } from '@ngxpert/hot-toast';
import { authInterceptor } from '../core/interceptors/auth.interceptor';
import { initializeApp } from '../core/app.initializer';
import { LocaleService } from '../core/services/locale.service';
import { provideStore, Store } from '@ngrx/store';
import { AuthenticationService } from '../core/services/authentication.service';
import { localeInterceptor } from '@core/locale.interceptor';
import { importProvidersFrom } from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';
import { BrowserModule } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { NgApexchartsModule } from 'ng-apexcharts';
import { errorHandlerInterceptor } from '@core/interceptors/error-handler.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(BrowserModule),
    provideAnimations(),
    importProvidersFrom(OverlayModule),
    importProvidersFrom(NgApexchartsModule),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [LocaleService, Store, AuthenticationService],
      multi: true,
    },
    provideStore({}),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      withFetch(),
      withInterceptors([authInterceptor, localeInterceptor, errorHandlerInterceptor])
    ),
    provideHotToastConfig({
      duration: 3000,
      dismissible: true,
      autoClose: true,
    }),
  ],
};
