import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DEFAULT_CURRENCY_CODE,
  forwardRef,
  Inject,
  Injector,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgClass } from '@angular/common';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
  NgControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { tablerEye, tablerEyeOff, tablerX, tablerSearch } from '@ng-icons/tabler-icons';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule, NgClass, NgIcon],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => InputComponent),
    },
    provideIcons({ tablerEye, tablerEyeOff, tablerX, tablerSearch }),
  ],
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputComponent implements ControlValueAccessor, OnInit {
  private ngControl: NgControl | null = null;

  public id = input<string>('');
  public label = input<string>('');
  public type = input<string>('');
  public isDisabled = input<boolean>(false);
  public min = input<string>('');
  public max = input<string>('');
  public placeholder = input<string>('');
  public autocomplete = input<string>('');
  public error = input<string>('');
  public step = input<string>('');
  public styleClass = input<string>('');
  public labelStyleClass = input<string>('');
  public icon = input<string>('');
  public isTextarea = input<boolean>(false);
  public isSearchable = input<boolean>(false);
  public isCurrency = input<boolean>(false);
  public isTime = input<boolean>(false);
  public loverBoundary = input<number | undefined>(undefined);
  public upperBoundary = input<number | undefined>(undefined);

  public isShownPassword = signal<boolean>(false);

  public value = '';

  public focused = false;
  public touched = false;
  public disabled = false;

  get errorMessage(): string {
    return this.error();
  }

  get isInvalid(): boolean {
    return (
      !!this.ngControl?.invalid &&
      !!this.ngControl?.dirty &&
      !!this.ngControl?.touched
    );
  }

  get isDirty() {
    return !!this.ngControl?.dirty;
  }

  constructor(
    public inj: Injector,
    private readonly cdr: ChangeDetectorRef,
    @Inject(DEFAULT_CURRENCY_CODE) public readonly currencyCode: string
  ) {}

  ngOnInit() {
    this.ngControl = this.inj.get(NgControl);
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }

    this.disabled = this.isDisabled();
  }

  onChange = (value: string) => {
    this.value = value;
  };

  onTouched = () => {
    this.touched = true;
  };

  onFocusIn() {
    this.focused = true;

    if (this.isCurrency()) {
      this.value = this.value == '0' ? '' : this.value;
      this.onChange(this.value);
    }
  }

  onFocusOut() {
    this.focused = false;

    if (this.isCurrency()) {
      this.value = this.value == '' ? '0' : this.value;
      this.onChange(this.value);
    }
  }

  writeValue(value: string) {
    this.value = value;
    this.cdr.markForCheck();
  }

  registerOnChange(onChange: (value: string) => void) {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: () => void) {
    this.onTouched = onTouched;
  }

  markAsTouched() {
    if (!this.touched) {
      this.onTouched();
      this.touched = true;
    }
  }

  setDisabledState(disabled: boolean) {
    this.disabled = disabled;
  }

  valueChanged(value: string) {
    this.writeValue(value);
    this.onChange(value);
    this.markAsTouched();
  }

  public togglePasswordVisibility() {
    this.isShownPassword.set(!this.isShownPassword());
  }
}
