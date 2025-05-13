import {
  Component,
  OnInit,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, NgIf } from '@angular/common';
import {
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { WordsService } from '@core/services/words.service';
import { Word } from '@core/models/word.model';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { ButtonComponent } from "../../shared/components/button/button.component";
import { AppRoutes } from '@core/enums/app-routes.enum';
import { WordTranslationsService } from '@core/services/word-translations.service';
import { LocaleService } from '@core/services';
import { NgIcon } from '@ng-icons/core';
import { provideIcons } from '@ng-icons/core';
import { tablerPlus, tablerPencil } from '@ng-icons/tabler-icons';
import { EMPTY } from 'rxjs';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { InputComponent } from "../../shared/components/input/input.component";

@Component({
  selector: 'app-dictionary-word',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgIf, ButtonComponent, NgIcon, SpinnerComponent, InputComponent],
  providers: [provideIcons({ tablerPlus, tablerPencil })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dictionary-word.component.html',
})
export class DictionaryWordComponent implements OnInit {
  public word = signal<Word | null>(null);
  public wordTranslation = signal<string | null>(null);
  public imageUrl = signal<string | null>(null);
  public form!: FormGroup;
  public wordTranslationForm!: FormGroup;
  public isLoading = signal<boolean>(false);
  public isEditMode = signal<boolean>(false);
  public currentLocale = signal<string | null>(null);

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly wordsService: WordsService,
    private readonly fb: NonNullableFormBuilder,
    private readonly wordTranslationsService: WordTranslationsService,
    private readonly localeService: LocaleService
  ) {
    this.wordTranslationForm = this.fb.group({
      translation: this.fb.control<string | null>(null, Validators.required),
    });
  }

  ngOnInit(): void {
    this.route.params.pipe(
      map(params => +params['id']),
      switchMap(id => this.wordsService.getWordById(id)),
      tap(w => {
        this.word.set(w);
        this.setImageUrlFromData(w.img);
        this.form = this.fb.group({
          image: this.fb.control<File | null>(null, Validators.required),
        });
      }),
      switchMap(w =>
        this.localeService.locale$.pipe(
          tap((locale) => this.currentLocale.set(locale)),
          switchMap(() => this.wordTranslationsService.getTranslations()),
          map(list =>
            list.find(
              t =>
                t.word.id === w.id &&
                t.language === this.localeService.currentLocaleBackend
            )
          ),
          tap(tr => {
            this.wordTranslation.set(tr?.translation ?? null);
            this.wordTranslationForm.patchValue({
              translation: tr?.translation ?? '',
            });
          })
        )
      )
    ).subscribe();
  }

  public backToDictionary() {
    this.router.navigate([`/${AppRoutes.DictionaryList}`]);
  }

  public editTranslation() {
    const w = this.word();
    if (!w) return;
  
    const cur = w.translations.find(
      t => t.language === this.localeService.currentLocaleBackend
    );
    if (!cur) return;
  
    this.isLoading.set(true);
  
    const req = {
      translation: this.wordTranslationForm.get('translation')?.value
    };
  
    this.wordTranslationsService
      .editTranslation(cur.id, req)
      .pipe(
        switchMap(() => this.wordsService.getWordById(w.id)),
        tap(updatedWord => {
          this.word.set(updatedWord);
          const tr = updatedWord.translations.find(
            t => t.id === cur.id
          );
          this.wordTranslation.set(tr?.translation ?? null);
          this.isLoading.set(false);
          this.isEditMode.set(false);
        }),
        catchError(() => {
          this.isLoading.set(false);
          this.isEditMode.set(false);
          return EMPTY;
        })
      )
      .subscribe();
  }

  public saveWordTranslation() {
    this.isLoading.set(true);
  
    const req = {
      wordId: this.word()!.id,
      translation: 'Default translation',
      language: this.localeService.currentLocaleBackend,
    };
  
    this.wordTranslationsService.addTranslation(req).pipe(
      switchMap(() => this.wordsService.getWordById(this.word()!.id)),
      tap(w => {
        this.word.set(w);
        const tr = w.translations.find(
          t => t.language === this.localeService.currentLocaleBackend
        );
        this.wordTranslation.set(tr?.translation ?? null);
        this.isLoading.set(false);
      }),
      catchError(() => {
        this.isLoading.set(false);
        return EMPTY;
      }),
    ).subscribe();
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
}
