import { Component, input, OnChanges, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-faq-widget',
  imports: [CommonModule],
  templateUrl: './faq-widget.component.html',
})
export class FaqWidgetComponent implements OnChanges {
    public title = input<string>('');
    public subtitle = input<string>('');
    public faqList = input<any>([]);

    public copyFaqList = signal<any[]>([]);
    
    ngOnChanges() {
      this.copyFaqList.set(this.faqList());
    }

    public toggleAnswerVisibility(id: number) {
      const updated = this.copyFaqList().map((faq: any) => ({
        ...faq,
        isAnswerHidden: faq.id === id ? !faq.isAnswerHidden : faq.isAnswerHidden
      }));
    
      this.copyFaqList.set(updated);
    }
}
