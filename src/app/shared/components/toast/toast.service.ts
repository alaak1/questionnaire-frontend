import { Injectable } from '@angular/core';
import { ToastComponent, ToastVariant } from './toast.component';

@Injectable({ providedIn: 'root' })
export class ToastService {
  private toastRef?: ToastComponent;

  setRef(ref: ToastComponent) {
    this.toastRef = ref;
  }

  show(message: string, variant: ToastVariant = 'info') {
    this.toastRef?.push(message, variant);
  }
}
