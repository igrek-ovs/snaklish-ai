import { NgIcon, provideIcons } from '@ng-icons/core';
import { CommonModule, NgClass } from '@angular/common';
import {
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  ControlValueAccessor,
  FormsModule,
} from '@angular/forms';
import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  input,
  signal,
} from '@angular/core';
import { ConnectedPosition, OverlayModule } from '@angular/cdk/overlay';
import { PopUpFilterOption } from './pop-up-filter-option.model';
import { SpinnerComponent } from '../spinner/spinner.component';
import { tablerChevronDown } from '@ng-icons/tabler-icons';

@Component({
  selector: 'app-pop-up-filter',
  standalone: true,
  providers: [
    provideIcons({tablerChevronDown}),
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PopUpFilterComponent),
      multi: true,
    },
  ],
  imports: [
    NgClass,
    NgIcon,
    OverlayModule,
    FormsModule,
    ReactiveFormsModule,
    SpinnerComponent,
    CommonModule,
  ],
  templateUrl: './pop-up-filter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PopUpFilterComponent<T> implements ControlValueAccessor {
  public overlayPositions: ConnectedPosition[] = [
    {
      originX: 'start',
      originY: 'bottom',
      overlayX: 'start',
      overlayY: 'top',
      offsetY: 4,
    },
    {
      originX: 'start',
      originY: 'top',
      overlayX: 'start',
      overlayY: 'bottom',
      offsetY: -4,
    },
  ];

  public name = input.required<string>();
  public options = input.required<PopUpFilterOption<T>[]>();
  public isLoadingOptions = input(false);
  public error = input<string>('');

  public defaultOption = input<PopUpFilterOption<T>>();

  public isShowed = signal(false);

  public value: T | null = null;

  public get isOutline() {
    return this.defaultOption() && this.defaultOption()!.value !== this.value;
  }

  public onChange?: (value: T) => void;
  public onTouch?: () => void;

  get errorMessage(): string {
    return this.error();
  }

  writeValue(obj: T): void {
    this.value = obj;
  }

  registerOnChange(fn: (value: T) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouch = fn;
  }

  public emitOption(option: PopUpFilterOption<T>) {
    if (this.onTouch && this.onChange) {
      this.onChange(option.value);
      this.onTouch();
      this.writeValue(option.value);
      this.isShowed.set(false);
    }
  }
}
