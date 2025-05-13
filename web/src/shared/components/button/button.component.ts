import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { variants } from 'classname-variants';
import { NgClass } from '@angular/common';

const BUTTON_VARIANTS = {
  text: '',
};

const BUTTON_COLORS = {
  primary:
    'bg-primary-main focus-visible:outline-primary-main text-white hover:bg-primary-alternative',
  secondary:
    'bg-white text-primary-main focus-visible:outline-primary-main hover:bg-warning-alternative',
  warning:
    'bg-warning-main text-white focus-visible:outline-warning-main hover:bg-warning-alternative',
  outline:
    'bg-transparent border border-primary-main text-gray-600 hover:opacity-80 hover:text-primary-main',
  danger:
    'bg-red-600 text-white focus-visible:outline-red-500 hover:bg-red-500',
  icon:
    'bg-transparent text-primary-main hover:bg-primary-alternative hover:text-white',
};
const BUTTON_VARIANTS_MERGE = variants({
  base: 'min-h-9 disabled:bg-opacity-50 hover:shadow-md disabled:cursor-not-allowed',
  variants: {
    variant: BUTTON_VARIANTS,
    color: BUTTON_COLORS,
    isLoading: {
      true: 'bg-opacity-50 pointer-events-none h-9 flex items-center justify-center',
      false: '',
    },
  },
});
export type ButtonVariant = keyof typeof BUTTON_VARIANTS;
export type ButtonColor = keyof typeof BUTTON_COLORS;
@Component({
  selector: 'app-button',
  standalone: true,
  imports: [NgClass],
  templateUrl: './button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  @Input() public variant: ButtonVariant = 'text';
  @Input() public color: ButtonColor = 'primary';
  @Input() public disabled = false;
  @Input() public type: 'button' | 'submit' | 'reset' = 'button';
  @Input() public isLoading = false;

  public get className() {
    return BUTTON_VARIANTS_MERGE({
      variant: this.variant,
      color: this.color,
      isLoading: this.isLoading,
    });
  }
}
