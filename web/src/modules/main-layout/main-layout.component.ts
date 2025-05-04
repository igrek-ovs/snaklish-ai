import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  signal,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';
import { OverlayModule } from '@angular/cdk/overlay';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { RouterLink } from '@angular/router';
import { AppRoutes } from '../../core/enums/app-routes.enum';
import { LocaleService } from '@core/services';
import { distinctUntilChanged, filter, map, tap, withLatestFrom } from 'rxjs/operators';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, OverlayModule, NavbarComponent, RouterLink],
  templateUrl: './main-layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainLayoutComponent implements OnInit {
  public isSidebarShowed = signal(false);
  public isUserMenuShowed = signal(false);
  public isAppsMenuShowed = signal(false);
  public isNotificationMenuShowed = signal(false);

  public AppRoutes = AppRoutes;

  constructor(public readonly router: Router, private readonly localeService: LocaleService) {}

  ngOnInit(): void {
    this.router.events.pipe(
      distinctUntilChanged(),
      map((params: any) => params['locale']),
      withLatestFrom(this.localeService.locales$),
      filter(([localeParam, locales]) => !!localeParam && locales.includes(localeParam)),
      tap(([localeParam]) => this.localeService.changeLocale(localeParam))
    ).subscribe();
  }

  public signOut() {}
}
