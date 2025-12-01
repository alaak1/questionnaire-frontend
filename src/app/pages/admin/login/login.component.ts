import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { ToastService } from '../../../shared/components/toast/toast.service';
import { CardComponent } from '../../../shared/components/card/card.component';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonComponent, InputComponent, RouterLink, CardComponent],
  template: `
    <div class="flex min-h-[70vh] items-center justify-center">
      <app-card class="w-full max-w-md">
        <h2 class="mb-6 text-xl font-semibold text-slate-800">Admin Login</h2>
        <form class="space-y-4" [formGroup]="form" (ngSubmit)="submit()">
          <app-input label="Email" type="email" formControlName="email"></app-input>
          <app-input label="Password" type="password" formControlName="password"></app-input>
          <app-button variant="primary" type="submit" class="w-full">Login</app-button>
        </form>
      </app-card>
    </div>
  `
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private toast = inject(ToastService);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  submit() {
    if (this.form.invalid) return;
    const { email, password } = this.form.value;
    this.auth.login(email!, password!).subscribe({
      next: () => {
        this.toast.show('Logged in', 'success');
        this.router.navigate(['/admin/dashboard']);
      },
      error: () => this.toast.show('Invalid credentials', 'error')
    });
  }
}
