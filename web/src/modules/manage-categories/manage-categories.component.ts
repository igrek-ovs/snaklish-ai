import { Component, OnInit, signal } from '@angular/core';
import { AddNewCategoryRequest, Category } from '@core/models';
import { CategoriesService } from '@core/services/categories.service';
import { ActionConfig, ActionFiredEvent, ColumnDef, ColumnType } from '@shared/components/table/header-def.model';
import { ButtonComponent } from "../../shared/components/button/button.component";
import { TranslatePipe } from "../../core/pipes/translate.pipe";
import { AsyncPipe } from '@angular/common';
import { TableComponent } from "../../shared/components/table/table.component";
import { CategoryActions } from '@core/enums/category-actions';
import { CategoriesModalComponent } from '@shared/components/categories-modal/categories-modal.component';
import { catchError, debounceTime, distinctUntilChanged, filter, finalize, map, of, switchMap, tap } from 'rxjs';
import { HotToastService } from '@ngxpert/hot-toast';
import { Dialog } from '@angular/cdk/dialog';
import { ConfirmationModalComponent } from '@shared/components/confirmation-modal/confirmation-modal.component';
import { PopUpFilterComponent } from "../../shared/components/pop-up-filter/pop-up-filter.component";
import { InputComponent } from "../../shared/components/input/input.component";
import { FormGroup, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CategorySearchBy } from '@core/enums/category-search-by.enum';
import { WordsService } from '@core/services';
import { WordsListModalComponent } from '@shared/components/words-list-modal/words-list-modal.component';

@Component({
  selector: 'app-manage-categories',
  imports: [ButtonComponent, TranslatePipe, AsyncPipe, TableComponent, PopUpFilterComponent, InputComponent, ReactiveFormsModule],
  templateUrl: './manage-categories.component.html',
})
export class ManageCategoriesComponent implements OnInit {
  public categories = signal<Category[]>([]);
  public isLoading = signal(true);
  public wordsInSelectedCategory = signal(0);
  public selectedCategory = signal<string | null>(null);

  public form: FormGroup;

  public get searchByOptions() {
    return Object.entries(CategorySearchBy);
  }

  public get isAnyFilterApplied() {
    return this.form.get('search')?.value || this.form.get('category')?.value || this.form.controls['searchBy'].value !== CategorySearchBy.NAME;
  }

  public readonly categoryActions: ActionConfig<Category>[] = [
    {
      icon: 'tablerEdit',
      tooltip: 'Edit category',
      eventName: CategoryActions.EDIT,
      iconClass: 'icon-default',
    },
    {
      icon: 'tablerTrash',
      tooltip: 'Delete category',
      eventName: CategoryActions.DELETE,
      iconClass: 'icon-delete',
    },
    {
      icon: 'tablerEye',
      tooltip: 'Delete category',
      eventName: CategoryActions.VIEW,
      iconClass: 'icon-view',
    }
  ];

  public readonly headers: ColumnDef<Category>[] = [
    {
      fieldName: 'id',
      displayName: 'ID',
      type: ColumnType.Text,
    },
    {
      fieldName: 'name',
      displayName: 'Name',
      type: ColumnType.Text,
    },
    {
      fieldName: 'description',
      displayName: 'Description',
      type: ColumnType.Text,
    },
  ];

  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly hotToastService: HotToastService,
    private readonly dialog: Dialog,
    private readonly fb: NonNullableFormBuilder,
    private readonly wordsService: WordsService,
  ) {
    this.form = this.fb.group({
      search: this.fb.control<string>(''),
      searchBy: this.fb.control<CategorySearchBy>(CategorySearchBy.NAME),
      category: this.fb.control<number | null>(null),
    });
  }

  public get categoriesOptions() {
    return [
      { displayName: 'All', value: null },
      ...this.categories().map(c => ({
        displayName: c.name.charAt(0).toUpperCase() + c.name.slice(1),
        value: c.id,
      }))
    ];
  }

  ngOnInit(): void {
  this.form.valueChanges.pipe(
    debounceTime(300),
    distinctUntilChanged((a, b) =>
      a.search === b.search && a.searchBy === b.searchBy && a.category === b.category
    ),
    tap(() => this.isLoading.set(true)),
    switchMap(({ search, searchBy, category }) => {
      const filters: any = {};

      if (searchBy === 'id') {
        const id = parseInt(search, 10);
        if (id) {
          filters.id = id;
        } else {
          return of([]).pipe(finalize(() => this.isLoading.set(false)));
        }
      } else if (search) {
        filters[searchBy] = search;
      }

      if (category) {
        filters.name = this.categories().find(c => c.id === category)?.name;
      }

      return this.categoriesService.searchCategory(filters).pipe(
        finalize(() => this.isLoading.set(false))
      );
    })
  )
  .subscribe((categories) => {
    this.categories.set(categories);
  });

      this.categoriesService.getCategories().subscribe((categories) => {
      this.categories.set(categories);
      this.isLoading.set(false);
    });

  this.form.get('category')!.valueChanges.pipe(
    debounceTime(300),
    distinctUntilChanged(),

    tap(catId => {
      if (catId == null) {
        this.selectedCategory.set(null);
      } else {
        const cat = this.categories().find(c => c.id === catId);
        this.selectedCategory.set(cat ? cat.name : null);
      }
    }),

    tap(() => this.wordsInSelectedCategory.set(0)),

    switchMap(catId => {
      if (!catId) return of(0);
      const catName = this.selectedCategory();
      return this.wordsService.searchWord({
        pageNumber: 1,
        pageSize:   1,
        category:   catName!,
      }).pipe(
        map(res => res.total),
        catchError(() => of(0))
      );
    })
  ).subscribe(total => {
    this.wordsInSelectedCategory.set(total);
  });
  }

  public clearFilters() {
    this.form.patchValue({
      search: '',
      searchBy: CategorySearchBy.NAME,
      category: null,
      level: null,
    });
  }

  public addNewCategory() {
    const req: AddNewCategoryRequest = {
      name: '',
      description: '',
    };

    const dialogRef = this.dialog.open(CategoriesModalComponent, {
      data: {
        category: req,
        title: 'Add new category',
      },
    });

    dialogRef.closed.pipe(
      filter((res: any) => !!res),
      tap(() => this.isLoading.set(true)),
      switchMap((res: AddNewCategoryRequest) =>
        this.categoriesService.addCategory(res).pipe(
          this.hotToastService.observe({
            loading: 'Adding category…',
            success: 'Category added successfully',
            error: 'Error adding category',
          })
        )
      ),
      switchMap(() => this.categoriesService.getCategories()),
      tap(categories => this.categories.set(categories)),
      finalize(() => this.isLoading.set(false))
    ).subscribe();
  }

  public handleAction(event: ActionFiredEvent<Category>) {
    const action = event.eventName;
    const { item } = event;

    if(action === CategoryActions.EDIT) {
      const req = event.item

      const dialogRef = this.dialog.open(CategoriesModalComponent, {
        data: {
          category: req,
          title: 'Edit category',
        }
      });

      dialogRef.closed.pipe(
        filter((res: any) => !!res),
        switchMap((req) => {
          const cId = item.id;

          return this.categoriesService.updateCategory(cId, {name: req.name, description: req.description}).pipe(
            this.hotToastService.observe({
              loading: 'Updating category…',
              success: 'Category updated successfully',
              error: 'Error updating category',
            }),
          )
        }),
        tap(() => {
          this.categoriesService.getCategories().subscribe(categories => {
            this.categories.set(categories);
          });
        }),
      )
      .subscribe();
    }

    else if (action === CategoryActions.DELETE) {
      const dialogRef = this.dialog.open(ConfirmationModalComponent);

      dialogRef.closed.pipe(
        filter(response => !!response),
        tap(() => this.isLoading.set(true)),
        switchMap(() =>
          this.categoriesService.deleteCategory(event.item.id).pipe(
            this.hotToastService.observe({
              loading: 'Deleting category…',
              success: 'Category deleted successfully',
              error:   'Error deleting category',
            })
          )
        ),
        switchMap(() => this.categoriesService.getCategories()),
        tap(categories => this.categories.set(categories)),
        finalize(() => this.isLoading.set(false))
      )
      .subscribe();
    }

    else if (action === CategoryActions.VIEW) {
      const dialogRef = this.dialog.open(WordsListModalComponent);

      dialogRef.closed.pipe().subscribe();
    }
  }
}
