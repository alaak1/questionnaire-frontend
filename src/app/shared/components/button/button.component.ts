import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';

type Variant = 'primary' | 'secondary' | 'danger';
type Size = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [NgClass],
  template: `
    <button
      [type]="type"
      [disabled]="disabled"
      [ngClass]="classes"
      class="inline-flex items-center justify-center rounded-xl font-medium transition active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-offset-1"
    >
      <ng-content></ng-content>
    </button>
  `,
  styles: []
})
export class ButtonComponent {
  @Input() variant: Variant = 'primary';
  @Input() size: Size = 'md';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() disabled = false;

  get classes() {
    const base = {
      primary: 'bg-primary-600 hover:bg-primary-700 text-white',
      secondary: 'bg-secondary-100 hover:bg-secondary-600 hover:text-white text-secondary-700',
      danger: 'bg-danger-600 hover:bg-danger-700 text-white'
    }[this.variant];

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-5 py-2.5 text-base'
    }[this.size];

    const disabled = this.disabled ? 'opacity-60 cursor-not-allowed' : '';
    return `${base} ${sizes} ${disabled} shadow-card`;
  }
}
