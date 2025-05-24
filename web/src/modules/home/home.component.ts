import { ChangeDetectionStrategy, Component, computed, OnInit, signal } from '@angular/core';
import { SvgComponent } from '../../shared/components/svg/svg.component';
import { TranslatePipe } from '../../core/pipes/translate.pipe';
import { AsyncPipe, CommonModule } from '@angular/common';
import { LocaleService, UserService, WordsService } from '@core/services';
import { combineLatest, delay, map, Observable, tap } from 'rxjs';
import { User } from '@core/models/user.model';
import { UserWordsService } from '@core/services/user-words.service';
import {
  CURRENTLY_LEARNED_WORDS_LOCAL_STORAGE_KEY,
  DAILY_WORDS_LOCAL_STORAGE_KEY,
} from '@core/constants/local-storage.constants';
import { CategoriesService } from '@core/services/categories.service';
import { Category } from '@core/models';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { tablerChartBar } from '@ng-icons/tabler-icons';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { Dialog } from '@angular/cdk/dialog';
import { DailyWordsModalComponent } from '@shared/components/daily-words-modal/daily-words-modal.component';

@Component({
  selector: 'app-home',
  imports: [
    SvgComponent,
    TranslatePipe,
    AsyncPipe,
    CommonModule,
    NgApexchartsModule,
    NgIcon,
    ButtonComponent,
  ],
  providers: [provideIcons({ tablerChartBar })],
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  public totalWordsCount = signal<number>(0);
  public unlearnedWordsCount = signal<number>(0);
  public learnedWordsCount = signal<number>(0);
  public categories = signal<Category[]>([]);
  public currentLocale = signal<string>('en');
  public dictionaryCapacity = signal<number>(0);
  public totalLearnedWords = signal<number>(0);

  public showAllCategories = signal<boolean>(false);
  public isLoading = signal<boolean>(true);

  public dailyWordsCount = signal<number | 'infinity'>(
    (() => {
      const raw = localStorage.getItem(DAILY_WORDS_LOCAL_STORAGE_KEY);
      if (raw === 'infinity') {
        return 'infinity';
      }
      const parsed = Number(raw);
      return isNaN(parsed) ? 0 : parsed;
    })()
  );

  public dailyLearnedWordsCount = +(
    localStorage.getItem(CURRENTLY_LEARNED_WORDS_LOCAL_STORAGE_KEY) ?? 0
  );

  public learnedWordsProgress = computed(() => {
    const total = this.totalWordsCount();
    const learned = this.learnedWordsCount();
    return total > 0 ? Math.round((learned / total) * 100) : 0;
  });

  public categoriesCount = computed(() => {
    const categories = this.categories();
    return categories.length;
  });

  public newWordsCount = computed(() => {
    const total = this.totalWordsCount();
    const learned = this.learnedWordsCount();
    const unlearned = this.unlearnedWordsCount();
    return total - learned - unlearned;
  });

  public user$: Observable<User | null>;

  public Array = Array;

  constructor(
    private readonly userService: UserService,
    private readonly wordsService: WordsService,
    private readonly userWordsService: UserWordsService,
    private readonly localeService: LocaleService,
    private readonly categoriesService: CategoriesService,
    private readonly dialog: Dialog
  ) {
    this.user$ = this.userService.user$;
  }

  ngOnInit(): void {
    combineLatest({
      locale: this.localeService.locale$,
      unlearnedWords: this.userWordsService.getUnlearnedUserWords(),
      learnedWords: this.userWordsService.getLearnedUserWords(),
      allWords: this.wordsService.getAllWords().pipe(map((res) => res.items)),
      categories: this.categoriesService.getCategories(),
    })
      .pipe(
        tap(({ locale, unlearnedWords, learnedWords, allWords, categories }) => {
          this.currentLocale.set(locale);

          const localeBackend = this.localeService.currentLocaleBackend;

          const learnedWordsByLocale = learnedWords.filter(
            (word) => word.translation.language === localeBackend
          );
          const learnedWordsCount = learnedWordsByLocale.length;

          const unlearnedWordsByLocale = unlearnedWords.filter(
            (word) => word.translation.language === localeBackend
          );
          const unlearnedWordsCount = unlearnedWordsByLocale.length;

          const allWordsByLocale = allWords.filter((word) =>
            word.translations.some((t) => t.language === localeBackend)
          );
          const allWordsCount = allWordsByLocale.length;

          this.unlearnedWordsCount.set(unlearnedWordsCount);
          this.learnedWordsCount.set(learnedWordsCount);
          this.totalWordsCount.set(allWordsCount);
          this.totalLearnedWords.set(learnedWords.length);
          this.dictionaryCapacity.set(allWords.length);
          this.categories.set(categories);
        }),
        delay(300),
        tap(() => this.isLoading.set(false))
      )
      .subscribe();
  }

  public setNewPace() {
    const dialogRef = this.dialog.open(DailyWordsModalComponent, {
      data: {
        title: 'Daily Words Duty',
        message: 'How many new words do you want to learn per day?',
      },
    });

    dialogRef.closed
      .pipe(
        tap(() => {
          this.dailyWordsCount.update(() => {
            const raw = localStorage.getItem(DAILY_WORDS_LOCAL_STORAGE_KEY);
            if (raw === 'infinity') return 'infinity';
            const parsed = Number(raw);
            return isNaN(parsed) ? 0 : parsed;
          });
        })
      )
      .subscribe();
  }
}
