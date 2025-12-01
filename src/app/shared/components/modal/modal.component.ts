import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [ButtonComponent],
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40" *ngIf="open">
      <div class="w-full max-w-lg rounded-xl bg-white p-6 shadow-card">
        <div class="mb-4 flex items-center justify-between">
          <h3 class="text-lg font-semibold text-slate-800">{{ title }}</h3>
          <button class="text-slate-400 hover:text-slate-700" (click)="cancel.emit()">✕</button>
        </div>
        <div class="text-sm text-slate-600"><ng-content></ng-content></div>
        <div class="mt-6 flex justify-end gap-3">
          <app-button variant="secondary" (click)="cancel.emit()">Cancel</app-button>
          <app-button variant="danger" (click)="confirm.emit()">Confirm</app-button>
        </div>
      </div>
    </div>
  `
})
export class ModalComponent {
  @Input() open = false;
  @Input() title = '';
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
}
