import { ChangeDetectionStrategy, Component, effect, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SvgComponent } from '../svg/svg.component';

interface LocalFaqItem {
  id: number;
  question: string;
  answer: string;
  isAnswerHidden: boolean;
}

@Component({
  selector: 'app-faq-widget',
  standalone: true,
  imports: [CommonModule, SvgComponent],
  templateUrl: './faq-widget.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FaqWidgetComponent {
  public title = input<string>();
  public subtitle = input<string>();
  public faqList = input<Array<{ id: number; question: string; answer: string }>>([]);

  public localFaqList = signal<LocalFaqItem[]>([]);

  constructor() {
    effect(() => {
      const enriched = this.faqList().map(faq => ({
        ...faq,
        isAnswerHidden: true,
      }));
      this.localFaqList.set(enriched);
    });
  }

  public toggleAnswerVisibility(id: number) {
    this.localFaqList.update(list =>
      list.map(item => ({
        ...item,
        isAnswerHidden: item.id === id ? !item.isAnswerHidden : item.isAnswerHidden,
      }))
    );
  }
}
