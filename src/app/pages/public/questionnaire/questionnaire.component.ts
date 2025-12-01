import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QuestionnaireService } from '../../../core/services/questionnaire.service';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { CardComponent } from '../../../shared/components/card/card.component';
import { NgFor, NgIf, NgSwitch, NgSwitchCase, NgClass } from '@angular/common';
import { Answer } from '../../../core/models/answer.model';

@Component({
  selector: 'app-questionnaire-fill',
  standalone: true,
  imports: [ButtonComponent, CardComponent, NgFor, NgIf, NgSwitch, NgSwitchCase, NgClass],
  template: `
    <div *ngIf="qData">
      <app-card class="mb-4">
        <div class="text-xs uppercase tracking-wide text-primary-600">Questionnaire</div>
        <h1 class="text-2xl font-bold text-slate-900">{{ qData.questionnaire.title }}</h1>
        <p class="text-slate-600">{{ qData.questionnaire.description }}</p>
      </app-card>

      <div class="grid gap-4 md:grid-cols-[2fr_1fr]">
        <div class="space-y-4">
          <app-card
            *ngFor="let q of qData.questions"
            [extraClass]="isFlagged(q.id) ? 'border border-amber-200 bg-amber-50 animate-pulse' : ''"
          >
            <div class="flex items-start justify-between gap-2">
              <div>
                <div class="text-sm font-semibold text-slate-800">{{ q.question_text }}</div>
                <div class="text-xs text-slate-500">Type: {{ q.type }}</div>
              </div>
              <button class="text-xs text-amber-600" (click)="toggleFlag(q.id)">🚩 Flag</button>
            </div>
            <div class="mt-3 space-y-2 text-sm">
              <ng-container [ngSwitch]="q.type">
                <input
                  *ngSwitchCase="'text'"
                  class="w-full rounded-xl border border-slate-200 px-3 py-2"
                  (input)="setAnswer(q.id, $any($event.target).value)"
                />
                <input
                  *ngSwitchCase="'rating'"
                  type="number"
                  min="1"
                  max="10"
                  class="w-32 rounded-xl border border-slate-200 px-3 py-2"
                  (input)="setAnswer(q.id, $any($event.target).value)"
                />
                <div *ngSwitchCase="'mcq'" class="space-y-2">
                  <label
                    *ngFor="let opt of q.options"
                    class="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2"
                  >
                    <input type="radio" name="mcq-{{ q.id }}" (change)="setAnswer(q.id, opt)" />
                    <span>{{ opt }}</span>
                  </label>
                </div>
                <div *ngSwitchCase="'checkbox'" class="space-y-2">
                  <label
                    *ngFor="let opt of q.options"
                    class="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2"
                  >
                    <input
                      type="checkbox"
                      (change)="toggleCheckbox(q.id, opt, $any($event.target).checked)"
                    />
                    <span>{{ opt }}</span>
                  </label>
                </div>
              </ng-container>
            </div>
          </app-card>
        </div>

        <div class="space-y-4">
          <app-card>
            <div class="text-sm font-semibold text-slate-800 text-center">Flagged questions</div>
            <div class="mt-3 space-y-2 text-sm text-slate-600 text-center">
              <div
                *ngFor="let f of flagged"
                class="rounded-lg bg-amber-50 px-3 py-2 text-amber-700 shadow-sm"
              >
                {{ f }}
              </div>
              <div *ngIf="flagged.length === 0" class="text-slate-400">No flags</div>
            </div>
          </app-card>
          <app-card>
            <div class="flex justify-end">
              <app-button variant="primary" class="px-6" (click)="submit()">Submit</app-button>
            </div>
          </app-card>
        </div>
      </div>
    </div>
  `
})
export class QuestionnaireComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private qs = inject(QuestionnaireService);

  qData: any;
  sessionId = '';
  answers = new Map<string, Answer>();
  flagged: string[] = [];

  ngOnInit() {
    const id = this.route.parent?.snapshot.params['id'] ?? this.route.snapshot.params['id'];
    this.sessionId = this.route.snapshot.queryParams['sessionId'];
    this.qs.getPublic(id).subscribe((res) => (this.qData = res));
  }

  setAnswer(qid: string, val: any) {
    this.answers.set(qid, { questionId: qid, answerValue: val, flagged: this.isFlagged(qid) });
  }

  toggleCheckbox(qid: string, opt: string, checked: boolean) {
    const existing = (this.answers.get(qid)?.answerValue as string[]) || [];
    const updated = checked ? [...existing, opt] : existing.filter((o) => o !== opt);
    this.setAnswer(qid, updated);
  }

  toggleFlag(qid: string) {
    const label = this.getQuestionText(qid);
    if (this.flagged.includes(label)) {
      this.flagged = this.flagged.filter((f) => f !== label);
    } else {
      this.flagged = [...this.flagged, label];
    }
    const current = this.answers.get(qid);
    const isFlagged = this.flagged.includes(label);
    if (current) this.answers.set(qid, { ...current, flagged: isFlagged });
  }

  submit() {
    const id = this.route.parent?.snapshot.params['id'] ?? this.route.snapshot.params['id'];
    const answers = Array.from(this.answers.values());
    this.qs.submitAnswers(id, { sessionId: this.sessionId, answers }).subscribe(() => {
      this.router.navigate(['/q', id, 'thank-you']);
    });
  }

  isFlagged(qid: string) {
    const label = this.getQuestionText(qid);
    return this.flagged.includes(label);
  }

  getQuestionText(qid: string) {
    const question = this.qData?.questions?.find((q: any) => q.id === qid);
    return question?.question_text || qid;
  }
}
