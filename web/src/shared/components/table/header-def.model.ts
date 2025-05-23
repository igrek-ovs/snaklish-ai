import { FieldPath } from '../../../core/models/field-path';
import { ChipColorsEnum } from '../chip/chip.component';

export const EXTRA_ACTIONS_COLUMN_NAME = 'Extra actions';

export enum ColumnType {
  Action = 'Action',
  Text = 'Text',
  Date = 'Date',
  Currency = 'Currency',
  Chip = 'Chip',
  Transcription = 'Transcription',
  Level = 'Level',
}

export enum DateFormat {
  DayMonthYear = 'dd/MM/yyyy',
  DayMonthYearWithTime = 'dd/MM/yyyy HH:mm',
  YearMonthDay = 'yyyy-MM-dd',
  MonthDayYear = 'MM/dd/yyyy',
  YearMonthDayWithTime = 'yyyy/MM/dd HH:mm:ss',
  HourMinute = 'HH:mm',
  HourMinuteWithAMPM = 'hh:mm a',
  MonthDayYearWithDay = 'd MMMM yyyy',
  ShortDateTime = 'EEE, MMM d, yyyy',
}

export enum CurrencyLocale {
  USD = 'en-US',
  EUR = 'de-DE',
}

interface BasicColumn<T, K extends keyof T = keyof T> {
  fieldName: FieldPath<T> | typeof EXTRA_ACTIONS_COLUMN_NAME;
  displayName: string;
  isSortable?: boolean;
  actions?: ActionConfig<T>[];
  cellContentClass?: string | ((value: T[K]) => string);
  isHidden?: (value: FieldPath<T> | typeof EXTRA_ACTIONS_COLUMN_NAME) => boolean;
}

export type TextColumn<T, K extends keyof T = keyof T> = BasicColumn<T> & {
  type: ColumnType.Text;
  formatter?: (value: T[K]) => string;
};

export type DateColumn<T> = BasicColumn<T> & {
  type: ColumnType.Date;
  format: DateFormat;
};

export type ChipColumn<T> = BasicColumn<T> & {
  type: ColumnType.Chip;
  colors: [ChipColorsEnum, ChipColorsEnum];
  labels: string[];
};

export type CurrencyColumn<T> = BasicColumn<T> & {
  type: ColumnType.Currency;
  locale?: string;
};

export type TranscriptionColumn<T> = BasicColumn<T> & {
  type: ColumnType.Transcription;
};

export type LevelColumn<T> = BasicColumn<T> & {
  type: ColumnType.Level;
  colors: any[];
};

export type ColumnDef<T, K extends keyof T = keyof T> =
  | TextColumn<T, K>
  | DateColumn<T>
  | ChipColumn<T>
  | CurrencyColumn<T>
  | TranscriptionColumn<T>
  | LevelColumn<T>;

export interface ActionConfig<T> {
  icon: string | ((value: T) => string);
  tooltip: string | ((value: T) => string);
  eventName: string;
  iconClass?: string | ((value: T) => string);
  params?: unknown;
  isAvailable?: (value: T) => boolean;
}

export interface ActionFiredEvent<T> {
  eventName: string;
  item: T;
  params?: unknown;
}
