import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ButtonComponent } from '../../shared/components/button/button.component';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, ButtonComponent],
  template: `
    <div class="min-h-screen bg-slate-50 text-slate-800">
      <header class="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-4 shadow-sm sm:px-6 lg:px-8">
        <a routerLink="/admin/dashboard"><div class="text-lg font-semibold text-slate-900">Admin</div></a>
        <app-button variant="secondary" size="sm" (click)="logout()">Logout</app-button>
      </header>
      <main class="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <router-outlet></router-outlet>
      </main>
    </div>
  `
})
export class AdminLayoutComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  logout() {
    this.auth.logout();
    this.router.navigate(['/admin/login']);
  }
}
