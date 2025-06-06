import { ChangeDetectionStrategy, Component, computed, OnInit, signal } from '@angular/core';
import { UserWord, Word } from '@core/models';
import { LAST_WORD, LocaleService, WordsService } from '@core/services';
import { UserWordsService } from '@core/services/user-words.service';
import { filter, finalize, forkJoin, map, switchMap, take, tap } from 'rxjs';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  tablerMenu2,
  tablerDotsCircleHorizontal,
  tablerVolume2,
  tablerPlayerPlay,
} from '@ng-icons/tabler-icons';
import { trigger, state, style, transition, animate, keyframes } from '@angular/animations';
import { SvgComponent } from '../../shared/components/svg/svg.component';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { SpinnerComponent } from '../../shared/components/spinner/spinner.component';
import { HotToastService } from '@ngxpert/hot-toast';
import {
  CURRENTLY_LEARNED_WORDS_LOCAL_STORAGE_KEY,
  DAILY_WORDS_LOCAL_STORAGE_KEY,
} from '@core/constants/local-storage.constants';
import { Dialog } from '@angular/cdk/dialog';
import { CardToolsModalComponent } from '@shared/components/card-tools-modal/card-tools-modal.component';
import { TranscriptionPipe } from '../../core/pipes/transcription.pipe';
import { SelectCategoriesModalComponent } from '@shared/components/select-categories-modal/select-categories-modal.component';
import { CategoriesService } from '@core/services/categories.service';
import { ReviewWordModalComponent } from '@shared/components/review-word-modal/review-word-modal.component';

@Component({
  selector: 'app-learn-words',
  imports: [
    ButtonComponent,
    NgIcon,
    SvgComponent,
    CommonModule,
    SpinnerComponent,
    NgIf,
    NgFor,
    TranscriptionPipe,
  ],
  providers: [
    provideIcons({ tablerMenu2, tablerDotsCircleHorizontal, tablerVolume2, tablerPlayerPlay }),
  ],
  templateUrl: './learn-words.component.html',
  animations: [
    trigger('cardFall', [
      state(
        'default',
        style({
          transform: 'translate(0, 0) rotate(0)',
          opacity: 1,
        })
      ),
      state(
        'fall',
        style({
          transform: 'translate(300px, 100vh) rotate(30deg)',
          opacity: 0,
        })
      ),
      transition('default => fall', [
        animate(
          '300ms ease-in',
          keyframes([
            style({
              offset: 0,
              transform: 'translate(0, 0) rotate(0)',
              opacity: 1,
            }),
            style({
              offset: 0.5,
              transform: 'translate(120px, 40vh) rotate(10deg)',
              opacity: 0.7,
            }),
            style({
              offset: 1,
              transform: 'translate(300px, 100vh) rotate(30deg)',
              opacity: 0,
            }),
          ])
        ),
      ]),
    ]),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LearnWordsComponent implements OnInit {
  public allWords = signal<Word[]>([]);
  public unlearnedWords = signal<UserWord[]>([]);
  public learnedWords = signal<UserWord[]>([]);

  public chosenWord = signal<Word | undefined>(undefined);
  public isChosenWordMemorized = signal<boolean>(false);
  public isTranslationShown = signal<boolean>(false);
  public localeCode = signal<string>('en');

  public dailyLearnedWordsCount = signal<number>(0);
  public currentlyLearnedWords = signal<number>(0);
  public progressLines = computed(() => Array(this.dailyLearnedWordsCount()).fill(0));

  public reviewMode = signal<boolean>(false);
  public selectedIds = signal<number[] | undefined>(undefined);

  public cardState = signal<'default' | 'fall'>('default');

  public wordTranslation = computed(() => {
    const locale = this.localeService.convertLocaleToBackend(this.localeCode());

    const w = this.chosenWord();
    if (!w) return 'No translation';

    const tr = w.translations.find((t) => t.language === locale);
    const trText = tr?.translation;

    return trText ?? 'No translation';
  });

  public wordStatus = computed<'learned' | 'unlearned' | 'new'>(() => {
    const locale = this.localeService.convertLocaleToBackend(this.localeCode());

    const w = this.chosenWord();
    if (!w) return 'new';

    if (
      this.learnedWords().some(
        (uw) => uw.translation.word.id === w.id && uw.translation.language === locale
      )
    ) {
      return 'learned';
    }
    if (
      this.unlearnedWords().some(
        (uw) => uw.translation.word.id === w.id && uw.translation.language === locale
      )
    ) {
      return 'unlearned';
    }

    return 'new';
  });

  public wordExamples = computed(() => {
    const examples = this.chosenWord()?.examples;
    if (!examples) return [];

    const parsedExamples = examples.split('\n');
    return parsedExamples;
  });

  public learnedWordsByLocale = computed(() => {
    const locale = this.localeService.convertLocaleToBackend(this.localeCode());
    return this.learnedWords().filter((uw) => uw.translation.language === locale);
  });

  constructor(
    private readonly userWordsService: UserWordsService,
    private readonly wordsService: WordsService,
    private readonly localeService: LocaleService,
    private readonly hotToastService: HotToastService,
    private readonly dialog: Dialog,
    private readonly categoriesService: CategoriesService
  ) {}

  ngOnInit(): void {
    const dailyWordsCount = +(localStorage.getItem(DAILY_WORDS_LOCAL_STORAGE_KEY) || '0');
    this.dailyLearnedWordsCount.set(dailyWordsCount);

    const curr = +(localStorage.getItem(CURRENTLY_LEARNED_WORDS_LOCAL_STORAGE_KEY) || '0');
    this.currentlyLearnedWords.set(curr);

    this.localeService.locale$.subscribe((code) => {
      this.localeCode.set(code);
    });

    this.categoriesService
      .getCategories()
      .pipe(take(1))
      .subscribe((categories) => {
        const dialogRef = this.dialog.open(SelectCategoriesModalComponent, {
          data: {
            title: 'Select categories',
            allCategories: categories,
            initiallySelectedIds: [],
          },
        });

        dialogRef.closed
          .pipe(
            tap((result: any) => {
              const { selectedIds } = result;
              this.selectedIds.set(selectedIds);
              this.learnNewWords(selectedIds);
            })
          )
          .subscribe();
      });
  }

  public skipWord() {
    this.cardState.set('fall');

    setTimeout(() => {
      const randWord = this.allWords().at(Math.floor(Math.random() * this.allWords().length));
      this.chosenWord.set(randWord);
      localStorage.setItem(LAST_WORD, String(randWord!.id));
      this.cardState.set('default');

      this.isTranslationShown.set(false);
    }, 700);
  }

  public learnWord() {
    const word = this.chosenWord();
    if (!word) return;
    else if (!word.translations?.length) {
      this.hotToastService.close();
      this.hotToastService.info('This word has no translations');
      return;
    }

    const locale = this.localeService.convertLocaleToBackend(this.localeCode());
    const translationId =
      word.translations.find((t) => t.language === locale)?.id ?? word.translations[0].id;

    const wordStatus = this.wordStatus();
    if (wordStatus === 'unlearned') {
      this.userWordsService
        .memorizeWord(translationId)
        .pipe(
          switchMap(() =>
            forkJoin({
              unlearned: this.userWordsService.getUnlearnedUserWords(),
              learned: this.userWordsService.getLearnedUserWords(),
            })
          ),
          tap(({ unlearned, learned }) => {
            this.unlearnedWords.set(unlearned);
            this.learnedWords.set(learned);
            this.skipWord();

            const next = this.currentlyLearnedWords() + 1;
            this.currentlyLearnedWords.set(next);
            localStorage.setItem(CURRENTLY_LEARNED_WORDS_LOCAL_STORAGE_KEY, next.toString());
          })
        )
        .subscribe();
      return;
    } else if (wordStatus === 'learned') {
      this.skipWord();
      return;
    }

    const req = {
      translationId,
      isLearnt: false,
    };

    this.userWordsService
      .learnWord(req)
      .pipe(
        switchMap(() =>
          forkJoin({
            unlearned: this.userWordsService.getUnlearnedUserWords(),
            learned: this.userWordsService.getLearnedUserWords(),
          })
        ),
        tap(({ unlearned, learned }) => {
          this.unlearnedWords.set(unlearned);
          this.learnedWords.set(learned);
          this.skipWord();

          const next = this.currentlyLearnedWords() + 1;
          this.currentlyLearnedWords.set(next);
          localStorage.setItem(CURRENTLY_LEARNED_WORDS_LOCAL_STORAGE_KEY, next.toString());
        })
      )
      .subscribe();
  }

  public getImgSrc(): string | null {
    const w = this.chosenWord();
    if (!w || !w.img?.data) {
      return null;
    }

    const base64 = this.arrayBufferToBase64(w.img.data);
    return `data:image/jpeg;base64,${base64}`;
  }

  public getColorByStatus(status: 'learned' | 'unlearned' | 'new') {
    switch (status) {
      case 'learned':
        return '#4caf50';
      case 'unlearned':
        return '#f44336';
      case 'new':
        return '#2196f3';
      default:
        return '#2196f3';
    }
  }

  public processName(status: 'learned' | 'unlearned' | 'new') {
    switch (status) {
      case 'learned':
        return 'Memorized';
      case 'unlearned':
        return 'Learning';
      case 'new':
        return 'New';
      default:
        return 'New';
    }
  }

  public openCardTools() {
    const locale = this.localeService.convertLocaleToBackend(this.localeCode());

    const word = this.chosenWord();
    if (!word) return;

    const translationId =
      word.translations.find((t) => t.language === locale)?.id ?? word.translations[0].id;

    const dialogRef = this.dialog.open(CardToolsModalComponent, {
      data: {
        translationId,
      },
    });

    dialogRef.closed
      .pipe(
        filter((res) => !!res),
        switchMap((res: any) => {
          const trId = res.translationId;
          const isLearned = res.isLearned;
          return isLearned
            ? this.userWordsService.memorizeWord(trId)
            : this.userWordsService.unmemorizeWord(trId);
        }),
        switchMap(() =>
          forkJoin({
            words: this.wordsService.getWords().pipe(map((res) => res.items)),
            unlearnedWords: this.userWordsService.getUnlearnedUserWords(),
            learnedWords: this.userWordsService.getLearnedUserWords(),
          })
        ),
        tap(({ words, unlearnedWords, learnedWords }) => {
          this.allWords.set(words);
          this.unlearnedWords.set(unlearnedWords);
          this.learnedWords.set(learnedWords);
        })
      )
      .subscribe();
  }

  public playPronunciation(word: string) {
    const utterance = new SpeechSynthesisUtterance(word);
    const voices = window.speechSynthesis.getVoices();
    utterance.voice = voices.find((v) => v.lang.startsWith('en')) || voices[0];
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  }

  public reviewWords() {
    const locale = this.localeService.convertLocaleToBackend(this.localeCode());

    forkJoin({
      words: this.wordsService.getWords().pipe(map((res) => res.items)),
      learnedWords: this.userWordsService.getLearnedUserWords(),
    })
      .pipe(
        tap(({ words, learnedWords }) => {
          const onlyLearned = words.filter((w) =>
            learnedWords.some(
              (uw) => uw.translation.word.id === w.id && uw.translation.language === locale
            )
          );

          this.allWords.set(onlyLearned);
          this.reviewMode.set(true);

          const randWord = onlyLearned[Math.floor(Math.random() * onlyLearned.length)];
          this.chosenWord.set(randWord);
          this.skipWord();
        })
      )
      .subscribe();
  }

  public learnNewWords(selectedIds: number[] | undefined) {
    forkJoin({
      words: this.wordsService.getWords().pipe(map((res) => res.items)),
      unlearnedWords: this.userWordsService.getUnlearnedUserWords(),
      learnedWords: this.userWordsService.getLearnedUserWords(),
    })
      .pipe(
        tap(({ words, unlearnedWords, learnedWords }) => {
          const locale = this.localeService.convertLocaleToBackend(this.localeCode());

          const byCategory =
            selectedIds && selectedIds.length > 0
              ? words.filter((w) => selectedIds.includes(w.categoryId))
              : words;

          const unlearned: Word[] = byCategory.filter(
            (w) =>
              !learnedWords.some(
                (uw) => uw.translation.word.id === w.id && uw.translation.language === locale
              )
          );

          this.allWords.set(unlearned);
          this.unlearnedWords.set(unlearnedWords);
          this.learnedWords.set(learnedWords);
        }),
        tap(({ words }) => {
          const lastWordId = localStorage.getItem(LAST_WORD);
          if (lastWordId) {
            const lastWord = words.find((w) => w.id === +lastWordId);
            if (lastWord) {
              this.chosenWord.set(lastWord);
              this.cardState.set('default');
              this.isTranslationShown.set(false);
              return;
            }
          }

          const randWord = words[Math.floor(Math.random() * words.length)];
          this.chosenWord.set(randWord);
        })
      )
      .subscribe();
  }

  // public learnNewWords(selectedIds: number[] | undefined) {
  //   forkJoin({
  //     words: this.wordsService.getWords().pipe(map((res) => res.items)),
  //     unlearnedWords: this.userWordsService.getUnlearnedUserWords(),
  //     learnedWords: this.userWordsService.getLearnedUserWords(),
  //   })
  //     .pipe(
  //       tap(({ words, unlearnedWords, learnedWords }) => {
  //         const locale = this.localeService.convertLocaleToBackend(this.localeCode());

  //         const unlearned: Word[] = words.filter(
  //           (word) =>
  //             !learnedWords.some(
  //               (uw) => uw.translation.word.id === word.id && uw.translation.language === locale
  //             )
  //         );

  //         this.allWords.set(unlearned);
  //         this.unlearnedWords.set(unlearnedWords);
  //         this.learnedWords.set(learnedWords);
  //       }),
  //       tap(({ words }) => {
  //         const lastWordId = localStorage.getItem(LAST_WORD);
  //         if (lastWordId) {
  //           const lastWord = words.find((w) => w.id === +lastWordId);
  //           if (lastWord) {
  //             this.chosenWord.set(lastWord);
  //             this.cardState.set('default');
  //             this.isTranslationShown.set(false);
  //             return;
  //           }
  //         } else {
  //           const randWord = words[Math.floor(Math.random() * words.length)];
  //           this.chosenWord.set(randWord);
  //         }
  //       })
  //     )
  //     .subscribe();
  // }

  public reviewWord() {
    const dialogRef = this.dialog.open(ReviewWordModalComponent, {
      data: {
        word: this.chosenWord()!,
        title: 'Review word',
      },
    });

    dialogRef.closed
      .pipe(
        filter((isApproved) => !!isApproved),
        tap(() => this.hotToastService.success('You have successfully mastered the word!')),
        tap(() => this.skipWord())
      )
      .subscribe();
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
