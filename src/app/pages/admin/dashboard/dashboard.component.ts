import { Component, inject, OnInit } from '@angular/core';
import { CardComponent } from '../../../shared/components/card/card.component';
import { QuestionnaireService } from '../../../core/services/questionnaire.service';
import { NgFor, NgIf } from '@angular/common';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CardComponent, NgIf, NgFor, ButtonComponent, RouterLink],
  template: `
    <div class="grid gap-4 md:grid-cols-3">
      <app-card>
        <div class="text-sm text-slate-500">Questionnaires</div>
        <div class="text-3xl font-semibold text-slate-900">{{ list.length }}</div>
      </app-card>
      <app-card>
        <div class="text-sm text-slate-500">Total submissions</div>
        <div class="text-3xl font-semibold text-slate-900">{{ totalSubmissions }}</div>
      </app-card>
      <app-card>
        <div class="text-sm text-slate-500">Latest session</div>
        <div class="text-md font-medium text-slate-900">{{ latestSession || '—' }}</div>
      </app-card>
    </div>

    <div class="mt-6">
      <div class="flex gap-3 items-center justify-between">
        <h3 class="text-lg font-semibold text-slate-800">Questionnaires</h3>
        <app-button routerLink="/admin/questionnaires/new" [disabled]="isDemo">Create New</app-button>
      </div>
      <div class="mt-4 flex flex-col space-y-3">
      <app-card *ngFor="let q of list">
        <div class="flex items-center justify-between gap-3">
          <div class="flex-1">
            <div class="flex items-center justify-between gap-2">
              <div class="text-lg font-semibold text-slate-800">{{ q.title }}</div>
              <div class="md:hidden">
                <button
                  class="rounded-full p-2 text-slate-600 hover:bg-slate-100"
                  (click)="toggleMenu(q.id)"
                >
                  ⋮
                </button>
                <div
                  *ngIf="menuOpenId === q.id"
                  class="absolute right-4 z-10 mt-2 w-40 rounded-xl border border-slate-200 bg-white shadow-card"
                >
                  <button class="flex w-full items-center px-4 py-2 text-left text-sm hover:bg-slate-50" (click)="openPublic(q.id)" [disabled]="isDemo">Share</button>
                  <button class="flex w-full items-center px-4 py-2 text-left text-sm hover:bg-slate-50" [routerLink]="'/admin/questionnaires/' + q.id + '/edit'" [disabled]="isDemo">Edit</button>
                  <button class="flex w-full items-center px-4 py-2 text-left text-sm hover:bg-slate-50" [routerLink]="'/admin/questionnaires/' + q.id + '/results'">Results</button>
                  <button class="flex w-full items-center px-4 py-2 text-left text-sm text-danger-600 hover:bg-slate-50" (click)="confirmDelete(q.id)" [disabled]="isDemo">Delete</button>
                </div>
              </div>
            </div>
          </div>
          <div class="relative hidden md:flex gap-2 text-sm">
            <app-button variant="secondary" (click)="openPublic(q.id)" [disabled]="isDemo">Share</app-button>
            <app-button variant="secondary" [routerLink]="'/admin/questionnaires/' + q.id + '/edit'" [disabled]="isDemo">Edit</app-button>
            <app-button variant="secondary" [routerLink]="'/admin/questionnaires/' + q.id + '/results'">Results</app-button>
            <app-button variant="danger" (click)="confirmDelete(q.id)" [disabled]="isDemo">Delete</app-button>
          </div>
        </div>
      </app-card>
      <div *ngIf="list.length === 0" class="text-sm text-slate-500">No questionnaires yet.</div>
    </div>

  `
})
export class DashboardComponent implements OnInit {
  private qs = inject(QuestionnaireService);
  private auth = inject(AuthService);
  list: any[] = [];
  menuOpenId: string | null = null;
  totalSubmissions = 0;
  latestSession = '';
  demoEmail = 'demo@demo.com';
  get isDemo() {
    const token = this.auth.token();
    const payload = this.decodeToken(token || '');
    return payload?.email === this.demoEmail;
  }

  ngOnInit() {
    this.qs.fetchAll().subscribe((list) => {
      this.list = list;
    });
  }

  openPublic(id: string) {
    const url = `${window.location.origin}/q/${id}`;
    window.open(url, '_blank');
  }

  toggleMenu(id: string) {
    this.menuOpenId = this.menuOpenId === id ? null : id;
  }

  private decodeToken(token: string): any | null {
    try {
      const payload = token.split('.')[1];
      const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(decoded);
    } catch {
      return null;
    }
  }
}
