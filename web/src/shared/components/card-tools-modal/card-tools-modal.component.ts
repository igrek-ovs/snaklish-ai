import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { tablerX, tablerToggleRight, tablerToggleLeft, tablerEdit } from '@ng-icons/tabler-icons';

@Component({
  selector: 'app-card-tools-modal',
  imports: [NgIcon],
  providers: [provideIcons({ tablerX, tablerToggleRight, tablerToggleLeft, tablerEdit })],
  templateUrl: './card-tools-modal.component.html',
})
export class CardToolsModalComponent {
  constructor(public readonly dialogRef: DialogRef, @Inject(DIALOG_DATA) public readonly data: { translationId: string }) {}

  public markWordAsUnlearned() {
    setTimeout(() => {
      this.dialogRef.close({ translationId: this.data.translationId, isLearned: false });
    }, 500);
  }

  public markWordAsLearned() {
    setTimeout(() => {
      this.dialogRef.close({ translationId: this.data.translationId, isLearned: true });
    }, 500);
  }
}
