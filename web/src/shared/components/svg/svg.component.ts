import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
    selector: 'app-svg',       
    imports: [NgClass],
    templateUrl: './svg.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SvgComponent {
  name = input<string>();
  class = input<string>('size-5');
  size = input<string>('size-5');

  ngOnInit(): void {
    console.log(this.name());
  }
}