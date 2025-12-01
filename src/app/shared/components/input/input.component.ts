import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  template: `
    <label class="relative block">
      <input
        [type]="type"
        class="peer w-full rounded-xl border border-slate-200 bg-white px-4 pb-2 pt-5 text-sm outline-none transition focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
        [placeholder]="placeholder"
        [value]="value || ''"
        (input)="onChange($event.target.value)"
        (blur)="onTouched()"
      />
      <span
        class="pointer-events-none absolute left-4 top-2 text-xs text-slate-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs peer-focus:text-primary-600"
        >{{ label }}</span
      >
    </label>
    <p *ngIf="error" class="mt-1 text-xs text-danger-600">{{ error }}</p>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ]
})
export class InputComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() placeholder = ' ';
  @Input() type: 'text' | 'email' | 'number' | 'password' = 'text';
  @Input() error = '';

  value: any;
  onChange = (v: any) => {};
  onTouched = () => {};

  writeValue(val: any): void {
    this.value = val;
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}
