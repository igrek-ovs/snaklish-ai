import { ChangeDetectionStrategy, Component, Input, TemplateRef } from '@angular/core';
import { NgClass, NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'app-basic-page-wrapper',
  standalone: true,
  imports: [NgClass, NgTemplateOutlet],
  templateUrl: './basic-page-wrapper.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasicPageWrapperComponent {
  @Input() header: string | null | undefined = null;
  @Input() description: string | null | undefined = null;
  // eslint-disable-next-line
  @Input() actionsTemplate: TemplateRef<any> | null = null;
  // eslint-disable-next-line
  @Input() headerTemplate: TemplateRef<any> | null = null;
  @Input() cardClasses: string | null | undefined = null;
}
