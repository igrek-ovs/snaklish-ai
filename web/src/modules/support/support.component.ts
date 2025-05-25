import { Component, OnInit, signal } from '@angular/core';
import { CmsService } from '@core/services';
import { delay, finalize, map, tap } from 'rxjs';
import { CmsMediaPipe } from '@core/pipes/cms-media.pipe';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { Router } from '@angular/router';
import { AppRoutes } from '@core/enums/app-routes.enum';
import { NgIcon } from '@ng-icons/core';
import { tablerHelp } from '@ng-icons/tabler-icons';
import { provideIcons } from '@ng-icons/core';

@Component({
  selector: 'app-support',
  imports: [CmsMediaPipe, ButtonComponent, NgIcon],
  providers: [provideIcons({ tablerHelp })],
  templateUrl: './support.component.html',
})
export class SupportComponent implements OnInit {
  public returnUrl: string;
  public supportImg = signal<string>('');
  public isImgLoading = signal<boolean>(true);

  constructor(
    private readonly cmsService: CmsService,
    private readonly router: Router
  ) {
    this.returnUrl = history.state.returnUrl || '/';
  }

  ngOnInit(): void {
    this.cmsService
      .getSupportPageContent()
      .pipe(
        map((data) => data.supportImg),
        map((img) => img.url),
        tap((url) => this.supportImg.set(url)),
        delay(300),
        finalize(() => this.isImgLoading.set(false))
      )
      .subscribe();
  }

  public backToHome() {
    this.router.navigate([`/${AppRoutes.Home}`]);
  }
}
