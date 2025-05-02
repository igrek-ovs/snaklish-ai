import { Component, OnInit, signal } from '@angular/core';
import { CmsService } from '../../core/services/cms.service';
import { tap } from 'rxjs';
import { FaqWidgetComponent } from '../../shared/components/faq-widget/faq-widget.component';

@Component({
  selector: 'app-overview',
  imports: [FaqWidgetComponent],
  templateUrl: './overview.component.html',
})
export class OverviewComponent implements OnInit {
  public title = signal<string>('');
  public subtitle = signal<string>('');
  public faqList = signal<any[]>([]);

  constructor(private readonly cmsService: CmsService) { }

  ngOnInit(): void {
    this.cmsService.getOverviewPageContent().pipe(
      tap((content) => {
        this.title.set(content.title);
        this.subtitle.set(content.subtitle);
        this.faqList.set(  
          content.faqList.map((faq: any) => ({
            ...faq,
            isAnswerHidden: true
        })));
      })
    ).subscribe();
  }
}
