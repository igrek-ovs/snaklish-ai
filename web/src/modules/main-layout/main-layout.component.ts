import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';
import { OverlayModule } from '@angular/cdk/overlay';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { RouterLink } from '@angular/router';
import { AppRoutes } from '../../core/enums/app-routes.enum';
import { CmsService, LocaleService, UserService } from '@core/services';
import { distinctUntilChanged, filter, map, tap, withLatestFrom } from 'rxjs/operators';
import { TranslatePipe } from '../../core/pipes/translate.pipe';
import { AsyncPipe, CommonModule, NgIf } from '@angular/common';
import { SidebarComponent } from '@shared/components/sidebar/sidebar.component';
import { SvgComponent } from '@shared/components/svg/svg.component';
import { Observable } from 'rxjs';
import { UserRoles } from '@core/enums/user-roles.enum';
import { environment } from '@src/enviroments/enviroment';
import { Dialog } from '@angular/cdk/dialog';
import { DailyWordsModalComponent } from '@shared/components/daily-words-modal/daily-words-modal.component';
import {
  CURRENTLY_LEARNED_WORDS_LOCAL_STORAGE_KEY,
  DAILY_WORDS_LOCAL_STORAGE_KEY,
  NEW_DAY_TO_LEARN_STORAGE_KEY,
} from '@core/constants/local-storage.constants';

interface NavLink {
  title: string;
  subtitle: string;
  url: string;
}

const linkList = [];

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    OverlayModule,
    RouterOutlet,
    NavbarComponent,
    RouterLink,
    TranslatePipe,
    AsyncPipe,
    SidebarComponent,
    SvgComponent,
    NgIf,
    CommonModule,
  ],
  providers: [],
  templateUrl: './main-layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainLayoutComponent implements OnInit {
  public isAnimationVisible = signal(false);

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
    private readonly dialog: Dialog
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
    const dailyWordsCount = +(localStorage.getItem(DAILY_WORDS_LOCAL_STORAGE_KEY) ?? 0);
    const currLearnedDailyWords = +(
      localStorage.getItem(CURRENTLY_LEARNED_WORDS_LOCAL_STORAGE_KEY) ?? 0
    );
    const isDailyDone = currLearnedDailyWords >= dailyWordsCount;

    const today = new Date().toISOString().split('T')[0];
    const lastCleared = localStorage.getItem(NEW_DAY_TO_LEARN_STORAGE_KEY);

    const isNewDayToLearn = lastCleared !== today || lastCleared === null;

    if (dailyWordsCount === null || isDailyDone || isNewDayToLearn) {
      localStorage.removeItem(DAILY_WORDS_LOCAL_STORAGE_KEY);
      localStorage.removeItem(CURRENTLY_LEARNED_WORDS_LOCAL_STORAGE_KEY);

      this.dialog.open(DailyWordsModalComponent, {
        data: {
          title: 'Daily Words Duty',
          message: 'How many new words do you want to learn per day?',
        },
      });
    }

    this.router.events
      .pipe(
        distinctUntilChanged(),
        map((params: any) => params['locale']),
        withLatestFrom(this.localeService.locales$),
        filter(([localeParam, locales]) => !!localeParam && locales.includes(localeParam)),
        tap(([localeParam]) => this.localeService.changeLocale(localeParam))
      )
      .subscribe();

    this.cmsService
      .getHeaderLogo()
      .pipe(
        tap((logo) => {
          const desktopUrl = environment.cms.apiUrl + logo.logoDesktop.url;
          this.logoDesktopUrl.set(desktopUrl);
        })
      )
      .subscribe();
  }

  public animateChangeLanguage() {
    this.isAnimationVisible.set(true);

    setTimeout(() => {
      this.isAnimationVisible.set(false);
    }, 700);
  }
}
