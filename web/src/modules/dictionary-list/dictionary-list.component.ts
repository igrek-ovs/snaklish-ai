import { Component, computed, OnInit, signal } from '@angular/core';
import { TableComponent } from '../../shared/components/table/table.component';
import {
  AddNewCategoryRequest,
  AddWordRequest,
  Category,
  Word,
  WordSearchRequest,
} from '../../core/models/word.model';
import { WordsService } from '../../core/services/words.service';
import {
  catchError,
  EMPTY,
  filter,
  finalize,
  Observable,
  switchMap,
  tap,
} from 'rxjs';
import {
  ActionConfig,
  ActionFiredEvent,
  ColumnDef,
  ColumnType,
} from '@shared/components/table/header-def.model';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { Dialog, DEFAULT_DIALOG_CONFIG } from '@angular/cdk/dialog';
import { ManageWordDialogComponent } from '@shared/components/manage-word-dialog/manage-word-dialog.component';
import { ConfirmationModalComponent } from '@shared/components/confirmation-modal/confirmation-modal.component';
import { HotToastService } from '@ngxpert/hot-toast';
import { CategoriesModalComponent } from '@shared/components/categories-modal/categories-modal.component';
import { CategoriesService } from '@core/services/categories.service';
import { InputComponent } from '../../shared/components/input/input.component';
import {
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { TranslatePipe } from '../../core/pipes/translate.pipe';
import { AsyncPipe, CommonModule } from '@angular/common';
import { WordSearchBy } from '@core/enums/word-search-by';
import { WordActions } from '@core/enums/word-actions';
import { Router } from '@angular/router';
import { AppRoutes } from '@core/enums/app-routes.enum';
import { UserRoles } from '@core/enums/user-roles.enum';
import { UserService } from '@core/services';
import { PaginatorComponent } from '@shared/components/paginator/paginator.component';
import { WORDS_PER_PAGE } from '@core/constants/word.constants';
import { PopUpFilterComponent } from '../../shared/components/pop-up-filter/pop-up-filter.component';
import { OverlayModule } from '@angular/cdk/overlay';

@Component({
  selector: 'app-dictionary-list',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableComponent,
    ButtonComponent,
    InputComponent,
    PaginatorComponent,
    TranslatePipe,
    AsyncPipe,
    PopUpFilterComponent,
    OverlayModule,
  ],
  templateUrl: './dictionary-list.component.html',
  providers: [
    {
      provide: DEFAULT_DIALOG_CONFIG,
      useValue: {
        hasBackdrop: true,
      },
    },
  ],
})
export class DictionaryListComponent implements OnInit {
  public words = signal<Word[]>([]);
  public categories = signal<Category[]>([]);
  public isLoading = signal<boolean>(false);
  public currentPage = signal<number>(1);
  public totalItems = signal<number>(0);
  public totalPages = computed(() =>
    Math.ceil(this.totalItems() / WORDS_PER_PAGE),
  );

  public categoryCount = computed(() => this.categories().length);

  public form: FormGroup;

  public userRole$: Observable<string | null>;
  public isAdmin = signal<boolean>(true);

  public get categoriesOptions() {
    return [
      { displayName: 'All', value: null },
      ...this.categories().map((c) => ({
        displayName: c.name.charAt(0).toUpperCase() + c.name.slice(1),
        value: c.id,
      })),
    ];
  }

  public get levelOptions() {
    return [
      { displayName: 'All', value: null },
      { displayName: 'A1', value: 'A1' },
      { displayName: 'A2', value: 'A2' },
      { displayName: 'B1', value: 'B1' },
      { displayName: 'B2', value: 'B2' },
      { displayName: 'C1', value: 'C1' },
      { displayName: 'C2', value: 'C2' },
    ];
  }

  public readonly wordActions: ActionConfig<Word>[] = [
    {
      icon: 'tablerEdit',
      tooltip: 'Edit word',
      eventName: WordActions.EDIT,
      iconClass: 'icon-default',
      isAvailable: () => this.isAdmin(),
    },
    {
      icon: 'tablerTrash',
      tooltip: 'Delete word',
      eventName: WordActions.DELETE,
      iconClass: 'icon-delete',
      isAvailable: () => this.isAdmin(),
    },
    {
      icon: 'tablerEye',
      tooltip: 'View word',
      eventName: WordActions.VIEW,
      iconClass: 'icon-view',
      isAvailable: () => true,
    },
  ];

  public readonly headers: ColumnDef<Word>[] = [
    {
      fieldName: 'id',
      displayName: 'ID',
      type: ColumnType.Text,
      isHidden: () => !this.isAdmin(),
    },
    {
      fieldName: 'word',
      displayName: 'Word',
      type: ColumnType.Text,
    },
    {
      fieldName: 'transcription',
      displayName: 'Transcription',
      type: ColumnType.Transcription,
    },
    {
      fieldName: 'level',
      displayName: 'Level',
      type: ColumnType.Text,
    },
    {
      fieldName: 'category',
      displayName: 'Category',
      type: ColumnType.Text,
      formatter: (item: any) => {
        return item.name.charAt(0).toUpperCase() + item.name.slice(1);
      },
    },
    {
      fieldName: 'examples',
      displayName: 'Examples',
      type: ColumnType.Text,
    },
  ];

  public get searchByOptions() {
    return Object.entries(WordSearchBy);
  }

  public get isAnyFilterApplied() {
    return (
      this.form.controls['searchBy'].value !== WordSearchBy.WORD ||
      this.form.controls['search'].value.trim() ||
      this.form.controls['category'].value ||
      this.form.controls['level'].value
    );
  }

  constructor(
    private readonly wordsService: WordsService,
    private readonly dialog: Dialog,
    private readonly hotToastService: HotToastService,
    private readonly categoriesService: CategoriesService,
    private readonly fb: NonNullableFormBuilder,
    private readonly router: Router,
    private readonly userService: UserService,
  ) {
    this.form = this.fb.group({
      search: this.fb.control<string>(''),
      searchBy: this.fb.control<WordSearchBy>(WordSearchBy.WORD),
      category: this.fb.control<number | null>(null),
      level: this.fb.control<string | null>(null),
    });

    this.addNewWord = this.addNewWord.bind(this);

    this.userRole$ = this.userService.userRole$;
    this.userRole$.subscribe((role) => {
      if (role === UserRoles.Admin) {
        this.isAdmin.set(true);
      } else {
        this.isAdmin.set(false);
      }
    });
  }

  ngOnInit(): void {
    this.loadWords();

    this.loadCategories();

    this.form.valueChanges
      .pipe(
        tap(() => this.isLoading.set(true)),
        switchMap(({ search, searchBy, category }) => {
          const req: WordSearchRequest = {
            pageNumber: this.currentPage(),
            pageSize: WORDS_PER_PAGE,
          };
          (req as any)[searchBy] = search;

          if (category !== null) {
            const c = this.categories().find((c) => c.id === category)!;
            req.category = c.name;
          }

          if (this.form.controls['level'].value) {
            req.level = this.form.controls['level'].value;
          }

          return this.wordsService.searchWord(req).pipe(
            tap((resp) => {
              this.words.set(resp.items);
              this.totalItems.set(resp.total);
            }),
            finalize(() => this.isLoading.set(false)),
          );
        }),
      )
      .subscribe();
  }

  private loadWords() {
    this.isLoading.set(true);

    this.wordsService
      .getWords(this.currentPage())
      .pipe(
        tap((res) => {
          this.words.set(res.items);
          this.totalItems.set(res.total);
        }),
        finalize(() => {
          this.isLoading.set(false);
        }),
      )
      .subscribe();
  }

  private loadCategories() {
    this.categoriesService
      .getCategories()
      .pipe(tap((res) => this.categories.set(res)))
      .subscribe();
  }

  public addNewWord() {
    const req: AddWordRequest = {
      level: '',
      word: '',
      transcription: '',
      examples: '',
      categoryId: 1,
    };

    const dialogRef = this.dialog.open(ManageWordDialogComponent, {
      data: {
        word: req,
        img: null,
      },
    });

    (dialogRef.closed as Observable<AddWordRequest>)
      .pipe(
        filter((response) => !!response),
        tap(() => this.isLoading.set(true)),
        switchMap((req) =>
          this.wordsService.addWord(req).pipe(
            this.hotToastService.observe({
              loading: 'Adding word…',
              success: 'Word added successfully',
              error: 'Error adding word',
            }),
          ),
        ),
        tap(() => this.isLoading.set(false)),
        tap(() => this.loadWords()),
        catchError(() => {
          this.loadWords();
          return EMPTY;
        }),
      )
      .subscribe();
  }

  public deleteWord(id: number) {
    this.isLoading.set(true);
    this.wordsService
      .deleteWord(id)
      .pipe(
        finalize(() => {
          this.isLoading.set(false);
        }),
        tap(() => this.loadWords()),
      )
      .subscribe();
  }

  public handleAction(event: ActionFiredEvent<Word>) {
    const action = event.eventName;

    if (action === WordActions.DELETE) {
      const dialogRef = this.dialog.open(ConfirmationModalComponent);

      dialogRef.closed
        .pipe(
          filter((response) => !!response),
          tap(() => this.isLoading.set(true)),
          switchMap(() =>
            this.wordsService.deleteWord(event.item.id).pipe(
              this.hotToastService.observe({
                loading: 'Deleting word…',
                success: 'Word deleted successfully',
                error: 'Error deleting word',
              }),
            ),
          ),
          tap(() => this.isLoading.set(false)),
          tap(() => this.loadWords()),
        )
        .subscribe();
    } else if (action === WordActions.EDIT) {
      const dialogRef = this.dialog.open(ManageWordDialogComponent, {
        data: {
          word: event.item,
          img: event.item.img,
          wordId: event.item.id,
        },
      });

      dialogRef.closed
        .pipe(
          filter((response) => !!response),
          tap(() => this.isLoading.set(true)),
          switchMap((req: any) =>
            this.wordsService.editWord(event.item.id, req).pipe(
              this.hotToastService.observe({
                loading: 'Editing word…',
                success: 'Word edited successfully',
                error: 'Error editing word',
              }),
            ),
          ),
          tap(() => this.isLoading.set(false)),
          tap(() => this.loadWords()),
          catchError(() => {
            this.loadWords();
            return EMPTY;
          }),
        )
        .subscribe();
    } else if (action === WordActions.VIEW) {
      const wordId = event.item.id;
      this.router.navigate([`/${AppRoutes.DictionaryList}/${wordId}`]);
    }
  }

  public addNewCategory() {
    const req: AddNewCategoryRequest = {
      name: '',
      description: '',
    };

    const dialogRef = this.dialog.open(CategoriesModalComponent, {
      data: {
        category: req,
        title: 'Edit category',
      },
    });

    dialogRef.closed
      .pipe(
        filter((res: any) => !!res),
        switchMap((res: AddNewCategoryRequest) =>
          this.categoriesService.addCategory(res).pipe(
            this.hotToastService.observe({
              loading: 'Adding category…',
              success: 'Category added successfully',
              error: 'Error adding category',
            }),
          ),
        ),
      )
      .subscribe();
  }

  public clearFilters() {
    this.form.patchValue({
      search: '',
      searchBy: WordSearchBy.WORD,
      category: null,
      level: null,
    });
  }

  public onPageChanged(page: number) {
    this.isLoading.set(true);
    this.currentPage.set(page);

    this.wordsService
      .getWords(page)
      .pipe(
        tap((res) => this.words.set(res.items)),
        finalize(() => {
          this.isLoading.set(false);
        }),
      )
      .subscribe();
  }
}
