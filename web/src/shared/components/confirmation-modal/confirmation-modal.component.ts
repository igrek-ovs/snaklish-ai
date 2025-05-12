import { DialogRef } from '@angular/cdk/dialog';
import { Component } from '@angular/core';

@Component({
  selector: 'app-confirmation-modal',
  imports: [],
  templateUrl: './confirmation-modal.component.html',
  styles: ``
})
export class ConfirmationModalComponent {
  constructor(public readonly dialogRef: DialogRef) {}
}
