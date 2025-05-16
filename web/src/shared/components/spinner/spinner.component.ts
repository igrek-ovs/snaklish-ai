import { Component, input } from '@angular/core';

@Component({
  selector: 'app-spinner',
  imports: [],
  templateUrl: './spinner.component.html',
})
export class SpinnerComponent {
  public size = input<string>('small');
}
