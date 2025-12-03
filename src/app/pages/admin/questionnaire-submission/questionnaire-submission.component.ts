import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { QuestionnaireService } from '../../../core/services/questionnaire.service';
import { CardComponent } from '../../../shared/components/card/card.component';
import { NgIf, NgFor, DatePipe } from '@angular/common';
import { ButtonComponent } from '../../../shared/components/button/button.component';

@Component({
  selector: 'app-questionnaire-submission',
  standalone: true,
  imports: [CardComponent, NgIf, NgFor, DatePipe, RouterLink, ButtonComponent],
  template: `
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-semibold text-slate-800">Submission Detail</h2>
      <div class="flex gap-2">
        <app-button variant="secondary" size="sm" [routerLink]="['/admin/questionnaires', questionnaireId, 'results']">
          Back to results
        </app-button>
      </div>
    </div>

    <ng-container *ngIf="submission; else loading">
      <app-card class="mb-4">
        <div class="flex flex-col gap-2 text-sm text-slate-700">
          <div><span class="font-semibold">Questionnaire:</span> {{ questionnaireTitle }}</div>
          <div><span class="font-semibold">Session:</span> {{ submission.sessionId }}</div>
          <div><span class="font-semibold">User:</span> {{ submission.user?.email || 'Anonymous' }}</div>
          <div><span class="font-semibold">User:</span> {{ submission.user?.name || 'Anonymous' }}</div>
          <div><span class="font-semibold">Completed:</span> {{ submission.completed_at | date: 'short' }}</div>
        </div>
      </app-card>

      <div class="flex flex-col space-y-3 mt-3">
        <app-card *ngFor="let a of submission.answers">
          <div class="text-sm font-semibold text-slate-800">{{ a.questionText }}</div>
          <div class="mt-1 text-sm text-slate-700">
            <span class="font-semibold">Answer:</span> {{ formatAnswer(a.answerValue) }}
          </div>
        </app-card>
      </div>
    </ng-container>

    <ng-template #loading>
      <app-card>Loading submission...</app-card>
    </ng-template>
  `
})
export class QuestionnaireSubmissionComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private qs = inject(QuestionnaireService);

  questionnaireId = '';
  submissionId = '';
  submission: any;
  questionnaireTitle = '';

  ngOnInit() {
    this.questionnaireId = this.route.snapshot.params['id'];
    this.submissionId = this.route.snapshot.params['submissionId'];
    this.qs.results(this.questionnaireId).subscribe((res) => {
      this.questionnaireTitle = res.questionnaire.title;
      this.submission = (res.completedUsers || []).find((s: any) => s.sessionId === this.submissionId);
    });
  }

  formatAnswer(value: any): string {
    if (Array.isArray(value)) return value.join(', ');
    if (value === null || value === undefined || value === '') return '—';
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  }
}
