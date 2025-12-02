import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QuestionnaireService } from '../../../core/services/questionnaire.service';
import { CardComponent } from '../../../shared/components/card/card.component';
import { NgFor, NgIf, DatePipe } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../../../shared/components/button/button.component';

Chart.register(...registerables);

@Component({
  selector: 'app-questionnaire-results',
  standalone: true,
  imports: [CardComponent, NgIf, NgFor, NgChartsModule, DatePipe, RouterLink, ButtonComponent],
  template: `
    <div class="mb-4 flex items-center justify-between">
      <h2 class="text-xl font-semibold text-slate-800">Results</h2>
      <div class="flex gap-2">
        <app-button variant="secondary" size="sm" (click)="exportCsv()">Export CSV</app-button>
      </div>
    </div>
    <app-card *ngIf="data">
      <h3 class="text-lg font-semibold text-slate-800">{{ data.questionnaire.title }}</h3>
      <p class="text-sm text-slate-500">Total submissions: {{ data.totalSubmissions }}</p>
      <div class="mt-4">
        <canvas baseChart [data]="chartData" [options]="chartOptions" [type]="'line'"></canvas>
      </div>
    </app-card>

    <div class="mt-4 grid gap-3 md:grid-cols-2">
      <app-card *ngFor="let q of data?.aggregated">
        <div class="text-sm font-semibold text-slate-700">{{ q.questionText }}</div>
        <div class="text-xs text-slate-500">Type: {{ q.type }}</div>
        <div class="mt-2 text-sm text-slate-700">Count: {{ q.stats.count }}</div>
        <div *ngIf="q.stats.average" class="text-sm text-slate-700">Average: {{ q.stats.average | number:'1.1-2' }}</div>
        <div *ngIf="q.stats.optionCounts">
          <div *ngFor="let opt of keyVals(q.stats.optionCounts)" class="text-xs text-slate-600">
            {{ opt.key }}: {{ opt.value }}
          </div>
        </div>
      </app-card>
    </div>

    <div class="mt-6">
      <h3 class="mb-2 text-lg font-semibold text-slate-800">Completed Sessions</h3>
      <app-card *ngFor="let s of data?.completedUsers" class="mb-3">
        <div class="text-sm font-semibold text-slate-700">
          {{ s.user?.email || 'Anon' }} — {{ s.completed_at | date: 'short' }}
        </div>
        <ul class="mt-2 space-y-1 text-xs text-slate-600">
          <li *ngFor="let a of s.answers">
            <span class="font-semibold">{{ a.questionText }}:</span> {{ a.answerValue | json }}
            <span *ngIf="a.flagged" class="text-danger-600">(flagged)</span>
          </li>
        </ul>
        <div class="mt-3 flex justify-end">
          <app-button
            variant="secondary"
            size="sm"
            [routerLink]="['/admin/questionnaires', data?.questionnaire.id, 'submissions', s.sessionId]"
          >
            View submission
          </app-button>
        </div>
      </app-card>
    </div>
  `
})
export class QuestionnaireResultsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private qs = inject(QuestionnaireService);
  data: any;
  chartData: ChartConfiguration<'line'>['data'] = { labels: [], datasets: [] };
  chartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    scales: { x: {}, y: { beginAtZero: true } }
  };

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    this.qs.results(id).subscribe((res) => {
      this.data = res;
      const lineData = res?.lineChartData || [];
      this.chartData = {
        labels: lineData.map((x: any) => x.label),
        datasets: [
          {
            data: lineData.map((x: any) => x.value),
            label: 'Submissions',
            borderColor: '#4f46e5',
            tension: 0.3
          }
        ]
      };
    });
  }

  keyVals(obj: any) {
    if (!obj) return [];
    return Object.keys(obj).map((k) => ({ key: k, value: obj[k] }));
  }

  exportCsv() {
    if (!this.data) return;
    const questions = this.data.aggregated.map((q: any) => q.questionText);
    const headers = ['Session ID', 'User Email', 'User Name', 'Completed At', ...questions];
    const rows = (this.data.completedUsers || []).map((s: any) => {
      const answerMap: Record<string, string> = {};
      (s.answers || []).forEach((a: any) => {
        answerMap[a.questionText] = this.formatAnswer(a.answerValue);
      });
      return [
        s.sessionId,
        s.user?.email || '',
        s.user?.name || '',
        s.completed_at || '',
        ...questions.map((qt: string) => answerMap[qt] || '')
      ];
    });
    const csv = [headers, ...rows]
      .map((row: (string | number)[]) =>
        row.map((v: string | number) => `"${String(v ?? '').replace(/"/g, '""')}"`).join(',')
      )
      .join('\r\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${this.data.questionnaire.title || 'questionnaire'}-submissions.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  private formatAnswer(value: any): string {
    if (Array.isArray(value)) return value.join(', ');
    if (value === null || value === undefined) return '';
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  }
}
