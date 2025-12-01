import { Component, inject, OnInit } from '@angular/core';
import { QuestionnaireService } from '../../../core/services/questionnaire.service';
import { NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { CardComponent } from '../../../shared/components/card/card.component';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-questionnaire-list',
  standalone: true,
  imports: [NgFor, NgIf, RouterLink, ButtonComponent, CardComponent, ModalComponent],
  template: `
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-semibold text-slate-800">Questionnaires</h2>
      <app-button routerLink="/admin/questionnaires/new">Create New</app-button>
    </div>

    <div class="mt-4 space-y-3">
      <app-card *ngFor="let q of list">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-lg font-semibold text-slate-800">{{ q.title }}</div>
              <div class="text-sm text-slate-500">{{ q.description }}</div>
            </div>
            <div class="flex gap-2 text-sm">
              <app-button
                variant="secondary"
                (click)="openPublic(q.id)"
                [disabled]="isDemo"
              >
                Share
              </app-button>
            <app-button variant="secondary" routerLink="/admin/questionnaires/{{ q.id }}/edit" [disabled]="isDemo">Edit</app-button>
            <app-button variant="secondary" routerLink="/admin/questionnaires/{{ q.id }}/results">Results</app-button>
            <app-button variant="danger" (click)="confirmDelete(q.id)" [disabled]="isDemo">Delete</app-button>
            </div>
          </div>
        </app-card>
      <div *ngIf="list.length === 0" class="text-sm text-slate-500">No questionnaires yet.</div>
    </div>

    <app-modal
      [open]="deleteId !== null"
      title="Delete questionnaire?"
      (cancel)="deleteId = null"
      (confirm)="remove()"
    >
      This action cannot be undone.
    </app-modal>
  `
})
export class QuestionnaireListComponent implements OnInit {
  private qs = inject(QuestionnaireService);
  private auth = inject(AuthService);
  list: any[] = [];
  deleteId: string | null = null;
  demoEmail = 'demo@demo.com';
  get isDemo() {
    const token = this.auth.token();
    const payload = this.decodeToken(token || '');
    return payload?.email === this.demoEmail;
  }

  ngOnInit() {
    this.qs.fetchAll().subscribe((res) => (this.list = res));
  }

  openPublic(id: string) {
    const url = `${window.location.origin}/q/${id}`;
    window.open(url, '_blank');
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

  confirmDelete(id: string) {
    this.deleteId = id;
  }

  remove() {
    if (!this.deleteId) return;
    this.qs.delete(this.deleteId).subscribe(() => {
      this.list = this.list.filter((q) => q.id !== this.deleteId);
      this.deleteId = null;
    });
  }
}
