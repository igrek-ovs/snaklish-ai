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
import { CmsService, LocaleService, UserService } from '@core/services';
import { distinctUntilChanged, filter, map, tap, withLatestFrom } from 'rxjs/operators';
import { TranslatePipe } from "../../core/pipes/translate.pipe";
import { AsyncPipe, CommonModule, NgIf } from '@angular/common';
import { SidebarComponent } from "@shared/components/sidebar/sidebar.component";
import { SvgComponent } from '@shared/components/svg/svg.component';
import { Observable } from 'rxjs';
import { UserRoles } from '@core/enums/user-roles.enum';
import { BreadcrumbsComponent } from '@shared/components/breadcrumbs/breadcrumbs.component';
import { environment } from '@src/enviroments/enviroment';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, OverlayModule, NavbarComponent, RouterLink, TranslatePipe, AsyncPipe, SidebarComponent, OverlayModule, SvgComponent, NgIf, CommonModule, BreadcrumbsComponent],
  providers: [],
  templateUrl: './main-layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainLayoutComponent implements OnInit {
  public isSidebarShowed = signal(false);
  public isUserMenuShowed = signal(false);
  public isAppsMenuShowed = signal(false);
  public isNotificationMenuShowed = signal(false);
  public logoDesktopUrl = signal('');
  public logoMobileUrl = signal('');

  public userRole$: Observable<string | null>;
  public isAdmin = signal<boolean>(false);

  public AppRoutes = AppRoutes;

  constructor(
    public readonly router: Router, 
    private readonly localeService: LocaleService, 
    private readonly cmsService: CmsService,
    private readonly userService: UserService,
  ) {
    this.userRole$ = this.userService.userRole$;
    this.userRole$.subscribe((role) => {
      if (role === UserRoles.Admin) {
        this.isAdmin.set(true);
      } else {
        this.isAdmin.set(false);
      }
    });
  }

  ngOnInit(): void {
    this.router.events.pipe(
      distinctUntilChanged(),
      map((params: any) => params['locale']),
      withLatestFrom(this.localeService.locales$),
      filter(([localeParam, locales]) => !!localeParam && locales.includes(localeParam)),
      tap(([localeParam]) => this.localeService.changeLocale(localeParam))
    ).subscribe();

    this.cmsService.getHeaderLogo().pipe(
      tap((logo) => {
        const desktopUrl = environment.cms.apiUrl + logo.logoDesktop.url;
        this.logoDesktopUrl.set(desktopUrl);
      })
    ).subscribe();
  }
}
