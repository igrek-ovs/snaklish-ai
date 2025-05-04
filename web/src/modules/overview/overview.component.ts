import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  signal
} from '@angular/core';
import { CmsService } from '../../core/services/cms.service';
import {
  skip,
  startWith,
  switchMap,
  tap,
  distinctUntilChanged
} from 'rxjs/operators';
import { LocaleService } from '@core/services';
import { FaqWidgetComponent } from '@shared/components/faq-widget/faq-widget.component';

@Component({
  imports: [FaqWidgetComponent],
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewComponent implements OnInit {
  public title = signal<string>('');
  public subtitle = signal<string>('');
  public faqList = signal<any[]>([]);

  constructor(
    private readonly cmsService: CmsService,
    private readonly localeService: LocaleService
  ) {}

  ngOnInit(): void {
    this.localeService.locale$
      .pipe(
        startWith(this.localeService.currentLocale),
        distinctUntilChanged(),
        switchMap(() => this.cmsService.getOverviewPageContent()),
        tap((content) => {
          this.title.set(content.title);
          this.subtitle.set(content.subtitle);
          this.faqList.set(
            content.faqList.map((faq: any) => ({
              ...faq,
              isAnswerHidden: true,
            }))
          );
        })
      )
      .subscribe();
  }
}
