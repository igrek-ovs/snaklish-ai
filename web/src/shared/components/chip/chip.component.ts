import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';
import { variants } from 'classname-variants';
import { NgClass } from '@angular/common';

const CHIP_VARIANTS = {
  regular: 'bg-opacity-15',
  filled: 'bg-opacity-100 !text-white',
  outline: 'bg-opacity-0',
  outlineFilled: 'bg-opacity-100',
};

const CHIP_ROUNDING = {
  full: 'rounded-full',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  sm: 'rounded-sm',
  md: 'rounded-md',
};

const CHIP_COLORS = {
  primary: 'bg-primary-alternative text-primary-main border-primary-main',
  error: 'bg-red-600 text-red-600 border-red-600',
  warning: 'bg-yellow-500 text-yellow-500 border-yellow-500',
  success: 'bg-success-alternative text-success-main border-success-main',
  muted: 'bg-gray-500 text-gray-500 border-gray-500',
};
const CHIP_VARIANTS_MERGE = variants({
  base: 'border',
  variants: {
    variant: CHIP_VARIANTS,
    color: CHIP_COLORS,
    rounding: CHIP_ROUNDING,
  },
});

export enum ChipColorsEnum {
  Primary = 'primary',
  Error = 'error',
  Warning = 'warning',
  Success = 'success',
  Muted = 'muted',
}

export type ChipColors = keyof typeof CHIP_COLORS;
export type ChipVariants = keyof typeof CHIP_VARIANTS;
export type ChipRounding = keyof typeof CHIP_ROUNDING;

@Component({
  selector: 'app-chip',
  standalone: true,
  imports: [NgClass],
  templateUrl: './chip.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChipComponent {
  @ViewChild('chipElement') chipElement!: ElementRef;

  @Input() public variant: ChipVariants = 'regular';
  @Input() public color: ChipColors = 'primary';
  @Input() public rounding: ChipRounding = 'full';
  @Input() public label = '';
  @Input() public chipWidth = '';

  public get className() {
    return CHIP_VARIANTS_MERGE({
      variant: this.variant,
      color: this.color,
      rounding: this.rounding,
    });
  }
}