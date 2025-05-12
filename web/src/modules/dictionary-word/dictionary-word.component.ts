import {
  Component,
  OnInit,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, NgIf, AsyncPipe } from '@angular/common';
import {
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { WordsService } from '@core/services/words.service';
import { Word } from '@core/models/word.model';
import { map, switchMap, tap, finalize } from 'rxjs/operators';
import { ButtonComponent } from "../../shared/components/button/button.component";

@Component({
  selector: 'app-dictionary-word',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgIf, AsyncPipe, ButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dictionary-word.component.html',
})
export class DictionaryWordComponent implements OnInit {
  public word = signal<Word | null>(null);
  public imageUrl = signal<string | null>(null);
  public form!: FormGroup;
  public isSaving = signal(false);

  constructor(
    private readonly route: ActivatedRoute,
    private readonly wordsService: WordsService,
    private readonly fb: NonNullableFormBuilder
  ) {}

  ngOnInit(): void {
    this.route.params
      .pipe(
        map((p) => +p['id']),
        switchMap((id) => this.wordsService.getWordById(id)),
        tap((w) => {
          this.word.set(w);
          this.form = this.fb.group({
            image: this.fb.control<File | null>(null, Validators.required),
          });
          this.setImageUrlFromData(w.img);
        })
      )
      .subscribe();
  }

  private setImageUrlFromData(img: any) {
    if (img?.data?.length) {
      const bytes = Uint8Array.from(img.data);
      const blob = new Blob([bytes], { type: 'image/jpeg' });
      this.imageUrl.set(URL.createObjectURL(blob));
    } else {
      this.imageUrl.set(null);
    }
  }

  public onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) {
      this.form.get('image')!.setValue(null);
      return;
    }
    const file = input.files[0];
    this.form.get('image')!.setValue(file);

    const reader = new FileReader();
    reader.onload = () => {
      this.imageUrl.set(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  public saveImage() {
    const w = this.word();
    const imgBase64 = this.form.value.image as string | null;
    if (!w || !imgBase64) return;

    this.isSaving.set(true);

    const req = { image: imgBase64 };

    this.wordsService.uploadWordImage(req, w.id).pipe(
      switchMap(() => this.wordsService.getWordById(w.id)),
      tap((updated) => {
        this.word.set(updated);
        this.setImageUrlFromData(updated.img);
        this.form.reset();
      }),
      finalize(() => this.isSaving.set(false))
    ).subscribe();
  }
}
