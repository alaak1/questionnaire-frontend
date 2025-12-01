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
      <header class="flex items-center justify-between border-b border-slate-200 bg-white px-8 py-4 shadow-sm">
        <div class="flex items-center gap-6">
          <div class="text-lg font-semibold">Questionnaire Admin</div>
          <nav class="flex gap-4 text-sm font-medium text-slate-600">
            <a routerLink="/admin/dashboard" routerLinkActive="text-primary-600">Dashboard</a>
            <a routerLink="/admin/questionnaires" routerLinkActive="text-primary-600">Questionnaires</a>
          </nav>
        </div>
        <div>
          <app-button variant="secondary" size="sm" (click)="logout()">Logout</app-button>
        </div>
      </header>
      <main class="mx-auto max-w-6xl px-6 py-6">
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
