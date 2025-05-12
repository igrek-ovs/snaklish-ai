import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  Inject,
  input,
  OnInit,
  output,
  QueryList,
  signal,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { CdkTableModule, DataSource } from '@angular/cdk/table';
import { AsyncPipe, DatePipe, NgClass } from '@angular/common';
import { BehaviorSubject, map, of, switchMap, tap, timer } from 'rxjs';
import {
  ActionConfig,
  ActionFiredEvent,
  EXTRA_ACTIONS_COLUMN_NAME,
  // SpinnerComponent,
  // ChipComponent,
  // TruncateTextPipe,
  ColumnDef,
  ChipColumn,
  DateColumn,
  ColumnType,
  CurrencyColumn,
  TextColumn,
} from './header-def.model';
import { RowClickEvent } from './table-row-click-event.model';
import { NgIcon } from '@ng-icons/core';
// import { untilDestroyed } from '@ngneat/until-destroy';
// import { UntilDestroy } from '@ngneat/until-destroy';
import { InjectionToken } from '@angular/core';

const WINDOW = new InjectionToken<Window>('Global window object', {
  factory: () => window,
});
import { CurrencyPipe } from '@angular/common';
import { TranslatePipe } from "../../../core/pipes/translate.pipe";
import { ButtonComponent } from "../button/button.component";

// @UntilDestroy()
@Component({
  selector: 'app-table',
  standalone: true,
  providers: [DatePipe, CurrencyPipe],
  imports: [
    CdkTableModule,
    NgClass,
    NgIcon,
    TranslatePipe,
    AsyncPipe,
    ButtonComponent
],
  templateUrl: './table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent<T> implements OnInit, AfterViewChecked {
  // @ViewChildren(ChipComponent) chips: QueryList<ChipComponent> =
  //   new QueryList();

  @ViewChild('tableTooltip') tableTooltip: ElementRef | undefined = undefined;

  public ColumnType = ColumnType;

  public tooltipVisible = signal<boolean>(false);
  public tooltipVisible$ = new BehaviorSubject<boolean>(false);
  public tooltipContent = '';
  public tooltipPosition = { x: 0, y: 0 };

  public data = input.required<T[]>();
  public headers = input.required<ColumnDef<T>[]>();
  public extraActions = input<ActionConfig<T>[]>([]);
  public isLoading = input<boolean>(false);
  public isEmptyState = input<boolean>(false);
  public cb = input<() => void>(() => {});

  public rowClasses = input<string>('');

  public strOverlap = input<string | undefined>(undefined);
  public searchedColumn = input<string | undefined>(undefined);

  public rowClick = output<RowClickEvent<T>>();
  public action = output<ActionFiredEvent<T>>();

  public tableData = computed(() => new TableDataSource(this.data()));

  public maxChipWidth = signal<string>('');

  public tableTooltipWidth = 0;
  public tableTooltipHeight = 0;

  public get isDataEmpty() {
    return this.data() ? this.data().length === 0 : true;
  }

  public get fieldsToDisplay() {
    const fields = this.headers().map((x) => x.fieldName);
    if (this.extraActions().length > 0) {
      fields.push(EXTRA_ACTIONS_COLUMN_NAME);
    }

    return fields;
  }

  constructor(
    @Inject(WINDOW) public readonly window: Window,
    private readonly datePipe: DatePipe,
    private readonly currencyPipe: CurrencyPipe
  ) {}

  ngOnInit() {
    this.tooltipVisible$
      .pipe(
        // untilDestroyed(this),
        switchMap((isVisible) =>
          isVisible ? timer(1000).pipe(map(() => isVisible)) : of(isVisible)
        ),
        tap(this.tooltipVisible.set)
      )
      .subscribe();
  }

  ngAfterViewChecked() {
    // if (this.chips && this.chips.length) {
    //   const widths = this.chips
    //     .toArray()
    //     .map((chip) => chip.chipElement.nativeElement.offsetWidth);
    //   const maxChipWidth = Math.max(...widths);
    //   this.maxChipWidth.set(`${maxChipWidth}px`);
    // }

    if (this.tableTooltip) {
      this.tableTooltipWidth = this.tableTooltip.nativeElement.offsetWidth;
      this.tableTooltipHeight = this.tableTooltip.nativeElement.offsetHeight;
    }
  }

  public handlePriceValue(index: number, row: T, field: string) {
    const header = this.headers()[index] as CurrencyColumn<T>;
    const locale = header.locale ?? 'EUR';
    const rowField = field as keyof T;
    const value = row[rowField] as number;
    return this.currencyPipe.transform(value, locale, 'symbol', '1.0-2');
  }

  public isColumnDef(item: T) {
    return (item as ColumnDef<T>).type !== undefined;
  }

  public showTooltip(e: MouseEvent, row: T, field: string) {
    if (!this.isTextTruncated(e)) return;
    const roField = field as keyof T;
    this.tooltipContent = `${row[roField]}`;
    this.tooltipPosition = { x: e.clientX, y: e.clientY };
    this.tooltipVisible$.next(true);
  }

  public hideTooltip() {
    this.tooltipVisible$.next(false);
  }

  public transformToDate(index: number, row: T, field: string) {
    const val = row[field as keyof T];
    const header = this.headers()[index] as DateColumn<T>;
    const date = val as string;
    return this.datePipe.transform(date, header.format) ?? 'N/A';
  }

  public getChipColor(index: number, row: T, field: string) {
    // const val = row[field as keyof T] as boolean;
    // const header = this.headers()[index] as ChipColumn<T>;
    // return val ? header.colors?.[0] : header.colors?.[1];
  }

  public getChipLabel(index: number, row: T, field: string) {
    const val = row[field as keyof T];
    const header = this.headers()[index] as ChipColumn<T>;
    return val ? header.labels?.[0] : header.labels?.[1];
  }

  public highlightSubstring(index: number, row: T, field: string) {
    const strOverlap = this.strOverlap() || '';
    const rowField = field as keyof T;
    const cellValue = this.formatCellValue(
      this.headers()[index] as TextColumn<T>,
      row[rowField]
    );

    const regex = new RegExp(`(${strOverlap})`, 'i');
    const highlightedText = cellValue.replace(
      regex,
      '<span class="w-fit bg-yellow-300">$1</span>'
    );

    const columnName = this.headers()[index].displayName ?? '';
    const searchedColumn = this.searchedColumn() ?? '';

    return columnName.toLowerCase() === searchedColumn.toLowerCase() &&
      columnName.length > 0
      ? highlightedText
      : cellValue;
  }

  public isExtraActions(field: string) {
    return field === EXTRA_ACTIONS_COLUMN_NAME;
  }

  public emitAction(row: T, action: ActionConfig<T>) {
    const actionFiredEvent: ActionFiredEvent<T> = {
      eventName: action.eventName,
      item: row,
      params: action.params,
    };

    this.action.emit(actionFiredEvent);
  }

  public fieldActions(fieldName: string, row: T) {
    if (fieldName === EXTRA_ACTIONS_COLUMN_NAME) {
      return this.extraActions().filter((x) =>
        x.isAvailable ? x.isAvailable(row) : true
      );
    }

    return (
      this.headers()
        .find((f) => f.fieldName === fieldName)
        ?.actions?.filter((x) => (x.isAvailable ? x.isAvailable(row) : true)) ||
      []
    );
  }

  public formatCellValue<K extends keyof T>(
    header: TextColumn<T>,
    value: T[K]
  ): string {
    return header.formatter
      ? header.formatter(value)
      : `${value ? value : '-'}`;
  }

  public composeFromCell(
    composeItem: string | ((val: T[keyof T]) => string) | undefined,
    value: T[keyof T]
  ): string | undefined {
    return typeof composeItem === 'string' || !composeItem
      ? composeItem
      : composeItem(value);
  }

  public composeFromRow(
    composeItem: string | ((val: T) => string) | undefined,
    value: T
  ): string | undefined {
    return typeof composeItem === 'string' || !composeItem
      ? composeItem
      : composeItem(value);
  }

  public emitClickEvent(item: T) {
    const event: RowClickEvent<T> = {
      item,
    };

    this.rowClick.emit(event);
  }

  public formatTooltipContent(content: string) {
    const maxCharsInRow = 18;
    return content.replace(
      new RegExp(`(\\b\\w{${maxCharsInRow},}\\b)`),
      (longWord) => {
        return longWord.split('').reduce((acc, char, index) => {
          if (index % maxCharsInRow === 0 && index > 0) {
            return `${acc}-\n${char}`;
          }
          return acc + char;
        }, '');
      }
    );
  }

  private isTextTruncated(e: MouseEvent) {
    const target = e.target as HTMLElement;
    return (
      target.offsetHeight < target.scrollHeight ||
      target.offsetWidth < target.scrollWidth
    );
  }
}

class TableDataSource<T> extends DataSource<T> {
  private data: BehaviorSubject<T[]>;

  constructor(data: T[]) {
    super();
    this.data = new BehaviorSubject<T[]>(data);
  }

  connect() {
    return this.data;
  }

  disconnect() {
    this.data.unsubscribe();
  }
}
