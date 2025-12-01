import { Component, signal } from '@angular/core';

export type ToastVariant = 'success' | 'error' | 'info';

@Component({
  selector: 'app-toast',
  standalone: true,
  template: `
    <div class="fixed right-4 top-4 z-50 space-y-2">
      <div
        *ngFor="let t of toasts()"
        class="flex items-start gap-3 rounded-xl px-4 py-3 text-sm shadow-card"
        [ngClass]="{
          'bg-green-50 text-green-700': t.variant === 'success',
          'bg-danger-50 text-danger-700': t.variant === 'error',
          'bg-secondary-50 text-secondary-700': t.variant === 'info'
        }"
      >
        <div class="font-semibold capitalize">{{ t.variant }}</div>
        <div class="flex-1">{{ t.message }}</div>
        <button class="text-xs opacity-70 hover:opacity-100" (click)="dismiss(t.id)">×</button>
      </div>
    </div>
  `
})
export class ToastComponent {
  toasts = signal<{ id: number; message: string; variant: ToastVariant }[]>([]);
  private idCounter = 0;

  push(message: string, variant: ToastVariant = 'info') {
    const id = ++this.idCounter;
    this.toasts.update((t) => [...t, { id, message, variant }]);
    setTimeout(() => this.dismiss(id), 4000);
  }

  dismiss(id: number) {
    this.toasts.update((t) => t.filter((x) => x.id !== id));
  }
}
