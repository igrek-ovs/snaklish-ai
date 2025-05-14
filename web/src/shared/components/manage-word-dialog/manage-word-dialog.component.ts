import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { NgFor, NgIf } from '@angular/common';
import { Component, Inject, OnInit, signal } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AddWordRequest, Category, EditWordRequest } from '@core/models';
import { ButtonComponent } from '../button/button.component';
import { CategoriesService } from '@core/services/categories.service';
import { WordsService } from '@core/services';

interface ManageWordDialogData {
  word: AddWordRequest | EditWordRequest;
  img: any | null;
  wordId?: number;
}

@Component({
  selector: 'app-manage-word-dialog',
  imports: [ReactiveFormsModule, NgFor, NgIf, ButtonComponent],
  templateUrl: './manage-word-dialog.component.html',
})
export class ManageWordDialogComponent implements OnInit {
  public selectedFile: File | null = null;

  public form: FormGroup;
  public categories = signal<Category[]>([]);
  public imageUrl = signal<string | null>(null);
  public isUploadMode = signal<boolean>(false);

  constructor(
    public readonly dialogRef: DialogRef,
    @Inject(DIALOG_DATA) public readonly data: ManageWordDialogData,
    private readonly fb: NonNullableFormBuilder,
    private readonly categoryService: CategoriesService,
    private readonly wordsService: WordsService,
  ) {
    this.form = this.fb.group({
      word: this.fb.control<string>(data.word.word),
      transcription: this.fb.control<string>(data.word.transcription),
      level: this.fb.control<string>(data.word.level || 'A1'),
      examples: this.fb.control<string>(data.word.examples),
      categoryId: this.fb.control<number>(data.word.categoryId),
      image: this.fb.control<string | null>(data.img?.data ?? null),
    });
  }

  ngOnInit(): void {
    if (this.data.img?.data?.length) {
      const uint8 = new Uint8Array(this.data.img.data);
      const blob = new Blob([uint8], { type: 'image/jpeg' });
      this.imageUrl.set(URL.createObjectURL(blob));
    }

    this.categoryService.getCategories().subscribe((categories) => {
      this.categories.set(categories);
    });
  }

  public manageWord() {
    if (!this.form.valid) return;
  
    const payload: EditWordRequest = {
      ...this.data.word,
      ...this.form.getRawValue(),
    };
    delete (payload as any).image;
    delete (payload as any).img;
  
    this.dialogRef.close(payload);
  }

  public onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
 
    this.selectedFile = file;
    const reader = new FileReader();
   reader.onload = () => {
     this.imageUrl.set(reader.result as string);
     this.wordsService.uploadWordImage(file, this.data.wordId!)
       .subscribe(() => {
          this.isUploadMode.set(false);
       });
   };
    reader.readAsDataURL(file);
  }
}
