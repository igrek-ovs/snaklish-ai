import { Component, computed, OnInit, signal } from '@angular/core';
import { UserWord, Word } from '@core/models';
import { LocaleService, WordsService } from '@core/services';
import { UserWordsService } from '@core/services/user-words.service';
import { map, tap } from 'rxjs';
import { ButtonComponent } from "../../shared/components/button/button.component";
import { NgIcon, provideIcons } from '@ng-icons/core';
import { tablerMenu2 } from '@ng-icons/tabler-icons';
import { trigger, state, style, transition, animate, keyframes } from '@angular/animations';
import { SvgComponent } from "../../shared/components/svg/svg.component";
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from "../../shared/components/spinner/spinner.component";

@Component({
  selector: 'app-learn-words',
  imports: [ButtonComponent, NgIcon, SvgComponent, CommonModule, SpinnerComponent],
  providers: [
    provideIcons({ tablerMenu2 }),
  ],
  templateUrl: './learn-words.component.html',
  animations: [
    trigger('cardFall', [
      state('default', style({
        transform: 'translate(0, 0) rotate(0)',
        opacity: 1
      })),
      state('fall', style({
        transform: 'translate(300px, 100vh) rotate(30deg)',
        opacity: 0
      })),
      transition('default => fall', [
        animate('300ms ease-in', keyframes([
          style({ offset: 0,   transform: 'translate(0, 0) rotate(0)',       opacity: 1 }),
          style({ offset: 0.5, transform: 'translate(120px, 40vh) rotate(10deg)', opacity: .7 }),
          style({ offset: 1,   transform: 'translate(300px, 100vh) rotate(30deg)', opacity: 0 })
        ]))
      ]),
    ])
  ]
})
export class LearnWordsComponent implements OnInit {
  public allWords = signal<Word[]>([]);
  public unlearnedWords = signal<UserWord[]>([]);

  public chosenWord = signal<Word | undefined>(undefined);
  public isTranslationShown = signal<boolean>(false);
  public localeCode = signal<string>('en');

  public cardState = signal<'default' | 'fall'>('default');

  public wordTranslation = computed(() => {
    const locale = this.localeService.convertLocaleToBackend(this.localeCode());

    const w = this.chosenWord();
    if (!w) return 'No translation';

    const tr = w.translations.find(t => t.language === locale);
    const trText = tr?.translation;

    return trText ?? 'No translation';
  });

  constructor(
    private readonly userWordsService: UserWordsService,
    private readonly wordsService: WordsService,
    private readonly localeService: LocaleService,
  ) { }

  ngOnInit(): void {
    this.localeService.locale$.subscribe(code => {
      this.localeCode.set(code);
    });

    this.wordsService.getWords().pipe(
      map((res) => res.items),
      tap((words) => {
        console.log('words', words);
        this.allWords.set(words);
      }),
      tap((words) => {
        this.chosenWord.set(words[Math.floor(Math.random() * words.length)]);
      }),
    ).subscribe();

    // this.userWordsService.getUnlearnedUserWords().pipe(
    //   tap((words) => {
    //     this.unlearnedWords.set(words);
    //     console.log(words)
    //   })
    // ).subscribe();
  }

  public skipWord() {
    this.cardState.set('fall');

    setTimeout(() => {
      const randWord = this.allWords().at(Math.floor(Math.random() * this.allWords().length));
      this.chosenWord.set(randWord);
      this.cardState.set('default');

      this.isTranslationShown.set(false);
    }, 700);
  }

  public getImgSrc(): string | null {
    const w = this.chosenWord();
    if (!w || !w.img?.data) {
      return null;
    }

    const base64 = this.arrayBufferToBase64(w.img.data);
    return `data:image/jpeg;base64,${base64}`;
  }

  private arrayBufferToBase64(buffer: number[]): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }
}
