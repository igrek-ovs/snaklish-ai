import { DialogRef } from '@angular/cdk/dialog';
import { Component } from '@angular/core';
import { ButtonComponent } from "../button/button.component";

@Component({
  selector: 'app-confirmation-modal',
  imports: [ButtonComponent],
  templateUrl: './confirmation-modal.component.html',
})
export class ConfirmationModalComponent {
  constructor(public readonly dialogRef: DialogRef) {}
}
