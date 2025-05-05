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
import { LinksListWidgetComponent } from "../../shared/components/links-list-widget/links-list-widget.component";

@Component({
  imports: [FaqWidgetComponent, LinksListWidgetComponent],
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewComponent implements OnInit {
  public title = signal<string>('');
  public subtitle = signal<string>('');
  public faqList = signal<any[]>([]);

  public linksTitle = signal<string>('');
  public linksSubtitle = signal<string>('');
  public linksList = signal<any[]>([]);

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
          this.title.set(content.Faq.title);
          this.subtitle.set(content.Faq.subtitle);
          this.faqList.set(
            content.Faq.faqList.map((faq: any) => ({
              ...faq,
              isAnswerHidden: true,
            }))
          );

          this.linksTitle.set(content.linkWidget.title);
          this.linksSubtitle.set(content.linkWidget.subtitle);
          this.linksList.set(
            content.linkWidget.linkList.map((link: any) => ({
              ...link,
              isAnswerHidden: true,
            }))
          );
        })
      )
      .subscribe();
  }
}
