import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastComponent } from './shared/components/toast/toast.component';
import { ToastService } from './shared/components/toast/toast.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastComponent],
  template: `
    <router-outlet></router-outlet>
    <app-toast #toast></app-toast>
  `
})
export class AppComponent implements AfterViewInit {
  @ViewChild('toast', { static: true }) toastRef!: ToastComponent;

  constructor(private toastService: ToastService) {}

  ngAfterViewInit() {
    this.toastService.setRef(this.toastRef);
  }
}
