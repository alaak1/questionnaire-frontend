import { Component, inject, OnInit } from '@angular/core';
import { CardComponent } from '../../../shared/components/card/card.component';
import { QuestionnaireService } from '../../../core/services/questionnaire.service';
import { NgFor, NgIf, DatePipe } from '@angular/common';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CardComponent, NgIf, NgFor, LoaderComponent, DatePipe],
  template: `
    <div class="grid gap-4 md:grid-cols-3">
      <app-card>
        <div class="text-sm text-slate-500">Questionnaires</div>
        <div class="text-3xl font-semibold text-slate-900">{{ questionnaires()?.length || 0 }}</div>
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
      <h3 class="mb-3 text-lg font-semibold text-slate-800">Latest submissions</h3>
      <app-card>
        <div *ngIf="sessionsLoading" class="py-4"><app-loader /></div>
        <ul class="divide-y divide-slate-200" *ngIf="!sessionsLoading">
          <li *ngFor="let s of sessions" class="py-3 text-sm text-slate-700">
           {{ s.user?.email || 'Anon' }} — {{ s.completed_at | date:'short' }}
          </li>
          <li *ngIf="sessions.length === 0" class="py-3 text-slate-500">No submissions yet.</li>
        </ul>
      </app-card>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  private qs = inject(QuestionnaireService);
  questionnaires = this.qs.questionnaires.asReadonly();
  sessions: any[] = [];
  sessionsLoading = false;
  totalSubmissions = 0;
  latestSession = '';

  ngOnInit() {
    // Single fetch; reuse list for stats
    this.sessionsLoading = true;
    this.qs.fetchAll().subscribe((list) => {
      if (list.length) {
        this.loadMockStats(list[0].id);
      } else {
        this.sessionsLoading = false;
      }
    });
  }

  loadMockStats(id: string) {
    this.qs.results(id).subscribe({
      next: (res) => {
        this.sessions = res.completedUsers || [];
        this.totalSubmissions = res.totalSubmissions || 0;
        this.latestSession = this.sessions[0]?.completed_at || '';
        this.sessionsLoading = false;
      },
      error: () => (this.sessionsLoading = false)
    });
  }
}
