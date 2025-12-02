import { Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChildren, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QuestionnaireService } from '../../../core/services/questionnaire.service';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { CardComponent } from '../../../shared/components/card/card.component';
import { NgFor, NgIf, NgSwitch, NgSwitchCase } from '@angular/common';
import { Answer } from '../../../core/models/answer.model';

@Component({
  selector: 'app-questionnaire-fill',
  standalone: true,
  imports: [ButtonComponent, CardComponent, NgFor, NgIf, NgSwitch, NgSwitchCase],
  template: `
    <div class="mb-4" *ngIf="qData">
      <app-card class="mb-4">
        <div class="text-xs uppercase tracking-wide text-primary-600">Questionnaire</div>
        <h1 class="text-2xl font-bold text-slate-900">{{ qData.questionnaire.title }}</h1>
        <p class="text-slate-600">{{ qData.questionnaire.description }}</p>
      </app-card>

      <div
        *ngIf="showPopup"
        class="mb-3 rounded-lg bg-danger-50 px-4 py-3 text-sm text-danger-700 shadow"
      >
        {{ popupMessage }}
      </div>

      <div class="mt-3 flex flex-col space-y-4">
        <div class="flex items-center justify-between">
          <div class="text-sm text-slate-600">
            Showing questions {{ rangeStart }} - {{ rangeEnd }} of {{ totalQuestions }}
          </div>
          <div class="flex items-center gap-2 text-sm">
            <button class="text-primary-600 disabled:text-slate-400" (click)="prevPage()" [disabled]="currentPage === 1">
              Prev
            </button>
            <div class="text-xs text-slate-500">Page {{ currentPage }} / {{ totalPages }}</div>
            <button class="text-primary-600 disabled:text-slate-400" (click)="nextPage()" [disabled]="currentPage === totalPages">
              Next
            </button>
          </div>
        </div>

        <app-card
          *ngFor="let q of visibleQuestions"
          #questionCard
          [attr.data-qid]="q.id"
          [extraClass]="getCardClasses(q.id)"
        >
          <div class="flex items-start justify-between gap-2">
            <div>
              <div class="text-sm font-semibold text-slate-800">Question #{{ q.number }}</div>
              <div class="text-base font-semibold text-slate-900 mt-1">{{ q.question_text }}</div>
              <div class="text-xs text-slate-500 mt-1 capitalize">Type: {{ q.type }}</div>
            </div>
            <button class="text-xs text-amber-600" (click)="toggleFlag(q.id, q.number)">
              {{ isFlaggedNumber(q.number) ? 'Unflag' : 'Flag' }}
            </button>
          </div>
          <div class="mt-4 flex flex-col space-y-3 text-sm">
            <ng-container [ngSwitch]="q.type">
              <input
                *ngSwitchCase="'text'"
                class="bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full px-3 py-2.5 shadow-sm placeholder:text-slate-500"
                (input)="setAnswer(q.id, $any($event.target).value)"
                placeholder="Enter your answer"
              />
              <div *ngSwitchCase="'rating'" class="space-y-1">
                <div class="flex items-center justify-between mb-1">
                  <label class="block text-sm font-medium text-slate-900" for="rating-{{ q.id }}">
                    Rate 1-10
                  </label>
                  <div class="text-xs font-semibold text-indigo-700">
                    {{ getRatingValue(q.id) || 5 }}
                  </div>
                </div>
                <input
                  id="rating-{{ q.id }}"
                  type="range"
                  min="1"
                  max="10"
                  step="1"
                  value=5
                  class="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-indigo-600"
                  (input)="setAnswer(q.id, $any($event.target).value)"
                />
              </div>
              <div *ngSwitchCase="'mcq'" class="space-y-2">
                <label
                  *ngFor="let opt of (q.options || [])"
                  class="inline-flex items-center justify-between w-full p-4 text-slate-700 border border-slate-200 rounded-lg cursor-pointer transition hover:bg-slate-100"
                  [ngClass]="{ 'border-indigo-300 bg-indigo-500 text-indigo-800': isMcqSelected(q.id, opt) }"
                >
                  <input
                    type="radio"
                    name="mcq-{{ q.id }}"
                    class="hidden"
                    (change)="setAnswer(q.id, opt)"
                  />
                  <div class="block">
                    <div class="w-full font-medium mb-1 text-slate-900">{{ opt }}</div>
                    <div class="w-full text-xs text-slate-500">A selectable option</div>
                  </div>
                </label>
              </div>
              <div *ngSwitchCase="'checkbox'" class="space-y-2">
                <div *ngFor="let opt of (q.options || []); let idx = index" class="select-none">
                  <input
                    type="checkbox"
                    class="hidden peer"
                    [id]="q.id + '-cb-' + idx"
                    [checked]="isCheckboxSelected(q.id, opt)"
                    (change)="toggleCheckbox(q.id, opt, $any($event.target).checked)"
                  />
                  <label
                    [for]="q.id + '-cb-' + idx"
                    class="inline-flex items-center justify-between w-full p-5 text-slate-700 border border-slate-200 rounded-lg cursor-pointer transition hover:bg-slate-100 peer-checked:hover:bg-indigo-50 peer-checked:border-indigo-300 peer-checked:bg-indigo-50 peer-checked:text-indigo-800"
                  >
                    <div class="block">
                      <div class="w-full font-medium mb-1 text-slate-900">{{ opt }}</div>
                      <div class="w-full text-xs text-slate-500">Select all that apply</div>
                    </div>
                  </label>
                </div>
              </div>
              <div *ngSwitchCase="'truefalse'" class="space-y-2">
                <label
                  class="inline-flex items-center justify-between w-full p-4 text-slate-700 border border-slate-200 rounded-lg cursor-pointer transition hover:bg-slate-100"
                  [ngClass]="{ 'border-indigo-300 bg-indigo-500 text-indigo-800': isTrueFalseSelected(q.id, true) }"
                >
                  <input
                    type="radio"
                    name="tf-{{ q.id }}"
                    class="hidden"
                    value="true"
                    (change)="setAnswer(q.id, true)"
                  />
                  <div class="block">
                    <div class="w-full font-medium mb-1 text-slate-900">True</div>
                    <div class="w-full text-xs text-slate-500">Mark this statement as true.</div>
                  </div>
                </label>
                <label
                  class="inline-flex items-center justify-between w-full p-4 text-slate-700 border border-slate-200 rounded-lg cursor-pointer transition hover:bg-slate-100"
                  [ngClass]="{ 'border-indigo-300 bg-indigo-500 text-indigo-800': isTrueFalseSelected(q.id, false) }"
                >
                  <input
                    type="radio"
                    name="tf-{{ q.id }}"
                    class="hidden"
                    value="false"
                    (change)="setAnswer(q.id, false)"
                  />
                  <div class="block">
                    <div class="w-full font-medium mb-1 text-slate-900">False</div>
                    <div class="w-full text-xs text-slate-500">Mark this statement as false.</div>
                  </div>
                </label>
              </div>
            </ng-container>
          </div>
        </app-card>

        <div class="flex items-center justify-between">
          <div class="text-sm text-slate-600">
            Showing questions {{ rangeStart }} - {{ rangeEnd }} of {{ totalQuestions }}
          </div>
          <div class="flex items-center gap-2 text-sm">
            <button class="text-primary-600 disabled:text-slate-400" (click)="prevPage()" [disabled]="currentPage === 1">
              Prev
            </button>
            <div class="text-xs text-slate-500">Page {{ currentPage }} / {{ totalPages }}</div>
            <button class="text-primary-600 disabled:text-slate-400" (click)="nextPage()" [disabled]="currentPage === totalPages">
              Next
            </button>
          </div>
        </div>

        <app-card>
          <div class="text-sm font-semibold text-slate-800">Flagged questions</div>
          <div class="flex mt-3 gap-2 space-y-2 text-sm text-slate-600">
            <button
              *ngFor="let num of flaggedNumbers"
              type="button"
              class="w-fit rounded-lg bg-amber-50 px-3 py-2 text-amber-700 shadow-sm transition hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-400"
              (click)="focusFlag(num)"
            >
              #{{ num }}
            </button>
            <div *ngIf="flaggedNumbers.length === 0" class="text-slate-400">No flags</div>
          </div>
        </app-card>

        <app-card>
          <div class="flex flex-col gap-2 text-sm text-slate-700">
            <div *ngIf="flaggedNumbers.length > 0" class="text-amber-700">
              Resolve flagged questions before submitting.
            </div>
            <div class="flex justify-center sm:justify-end">
              <app-button variant="primary" class="px-6" (click)="submit()" [disabled]="flaggedNumbers.length > 0">
                Submit
              </app-button>
            </div>
            
          </div>
        </app-card>
      </div>
    </div>
  `,
  styles: [
    `
      :host ::ng-deep .flash-orange {
        animation: flashOrange 3s ease;
      }

      @keyframes flashOrange {
        0% {
          box-shadow: 0 10px 28px rgba(199, 115, 54, 0.35);
        }
        50% {
        }
        100% {
          box-shadow: none;
        }
      }
    `
  ]
})
export class QuestionnaireComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private qs = inject(QuestionnaireService);

  @ViewChildren('questionCard', { read: ElementRef }) questionCards!: QueryList<ElementRef<HTMLElement>>;

  qData: any;
  numberedQuestions: any[] = [];
  sessionId = '';
  answers = new Map<string, Answer>();
  flaggedNumbers: number[] = [];
  highlightedId: string | null = null;
  pageSize = 10;
  currentPage = 1;
  private flashTimeoutId?: ReturnType<typeof setTimeout>;
  showPopup = false;
  popupMessage = '';
  private popupTimeoutId?: ReturnType<typeof setTimeout>;

  get totalQuestions() {
    return this.numberedQuestions.length;
  }

  get totalPages() {
    return Math.max(1, Math.ceil(this.totalQuestions / this.pageSize));
  }

  get pageStart() {
    return (this.currentPage - 1) * this.pageSize;
  }

  get rangeStart() {
    return this.totalQuestions ? this.pageStart + 1 : 0;
  }

  get rangeEnd() {
    if (!this.totalQuestions) return 0;
    return Math.min(this.pageStart + this.pageSize, this.totalQuestions);
  }

  get visibleQuestions() {
    const start = this.pageStart;
    return this.numberedQuestions.slice(start, start + this.pageSize);
  }

  ngOnInit() {
    const id = this.route.parent?.snapshot.params['id'] ?? this.route.snapshot.params['id'];
    this.sessionId = this.route.snapshot.queryParams['sessionId'];
    const stored = sessionStorage.getItem(`q-session-${id}`);
    if (!this.sessionId || this.sessionId !== stored) {
      this.router.navigate(['/q', id, 'user']);
      return;
    }
    this.qs.getPublic(id).subscribe((res) => {
      this.qData = res;
      this.numberedQuestions =
        res?.questions?.map((q: any, idx: number) => ({ ...q, number: idx + 1 })) || [];
      this.currentPage = 1;
    });
  }

  setAnswer(qid: string, val: any) {
    this.answers.set(qid, { questionId: qid, answerValue: val, flagged: this.isFlagged(qid) });
  }

  toggleCheckbox(qid: string, opt: string, checked: boolean) {
    const existing = (this.answers.get(qid)?.answerValue as string[]) || [];
    const updated = checked ? [...existing, opt] : existing.filter((o) => o !== opt);
    this.setAnswer(qid, updated);
  }

  toggleFlag(qid: string, number: number) {
    if (this.flaggedNumbers.includes(number)) {
      this.flaggedNumbers = this.flaggedNumbers.filter((n) => n !== number);
    } else {
      this.flaggedNumbers = [...this.flaggedNumbers, number].sort((a, b) => a - b);
    }
    const current = this.answers.get(qid);
    const isFlagged = this.isFlaggedNumber(number);
    if (current) this.answers.set(qid, { ...current, flagged: isFlagged });
  }

  submit() {
    if (this.flaggedNumbers.length > 0) {
      this.showMessage('Resolve flagged questions before submitting.');
      return;
    }
    const missing = this.findFirstUnanswered();
    if (missing) {
      this.goToQuestionNumber(missing.number);
      this.showMessage("Can't submit: some questions are still unanswered.");
      return;
    }
    const id = this.route.parent?.snapshot.params['id'] ?? this.route.snapshot.params['id'];
    const answers = Array.from(this.answers.values());
    this.qs.submitAnswers(id, { sessionId: this.sessionId, answers }).subscribe(() => {
      sessionStorage.removeItem(`q-session-${id}`);
      this.router.navigate(['/q', id, 'thank-you']);
    });
  }

  isFlagged(qid: string) {
    const num = this.getQuestionNumber(qid);
    return num > 0 && this.flaggedNumbers.includes(num);
  }

  isFlaggedNumber(num: number) {
    return this.flaggedNumbers.includes(num);
  }

  getQuestionNumber(qid: string) {
    const idx = this.numberedQuestions.findIndex((q: any) => q.id === qid);
    return idx >= 0 ? idx + 1 : -1;
  }

  getQuestionTextByNumber(num: number) {
    const q = this.numberedQuestions[num - 1];
    return q?.question_text || `Question ${num}`;
  }

  focusFlag(number: number) {
    this.goToQuestionNumber(number);
  }

  isMcqSelected(qid: string, opt: string) {
    return this.getAnswerValue(qid) === opt;
  }

  isCheckboxSelected(qid: string, opt: string) {
    const val = this.getAnswerValue(qid);
    return Array.isArray(val) && val.includes(opt);
  }

  isTrueFalseSelected(qid: string, val: boolean) {
    return this.getAnswerValue(qid) === val;
  }

  getRatingValue(qid: string) {
    const val = this.getAnswerValue(qid);
    return val ?? '';
  }

  getCardClasses(qid: string) {
    const classes = [];
    if (this.isFlagged(qid)) classes.push('border border-amber-200 bg-amber-50');
    if (this.highlightedId === qid) classes.push('flash-orange');
    return classes.join(' ');
  }

  nextPage() {
    if (this.currentPage < this.totalPages) this.currentPage += 1;
  }

  prevPage() {
    if (this.currentPage > 1) this.currentPage -= 1;
  }

  private goToQuestionNumber(num: number) {
    const targetPage = this.pageForNumber(num);
    if (targetPage !== this.currentPage) {
      this.currentPage = targetPage;
      setTimeout(() => this.scrollAndFlashByNumber(num), 50);
    } else {
      this.scrollAndFlashByNumber(num);
    }
  }

  private findFirstUnanswered(): { id: string; number: number } | null {
    const list = this.numberedQuestions || [];
    for (let i = 0; i < list.length; i++) {
      const q = list[i];
      if (!this.isAnswered(q)) return { id: q.id, number: i + 1 };
    }
    return null;
  }

  private isAnswered(q: any) {
    const ans = this.answers.get(q.id);
    if (!ans) return false;
    const val = ans.answerValue;
    if (q.type === 'truefalse') return val === true || val === false;
    if (q.type === 'checkbox') return Array.isArray(val) && val.length > 0;
    if (q.type === 'mcq') return val !== undefined && val !== null && val !== '';
    if (q.type === 'rating') return val !== undefined && val !== null && val !== '';
    if (q.type === 'text') return typeof val === 'string' ? val.trim().length > 0 : !!val;
    return !!val;
  }

  private showMessage(msg: string) {
    this.popupMessage = msg;
    this.showPopup = true;
    if (this.popupTimeoutId) clearTimeout(this.popupTimeoutId);
    this.popupTimeoutId = setTimeout(() => {
      this.showPopup = false;
    }, 3000);
  }

  private scrollAndFlashByNumber(number: number) {
    const qid = this.getQuestionIdByNumber(number);
    if (!qid) return;
    this.scrollToQuestion(qid);
    this.flashQuestion(qid);
  }

  private getQuestionIdByNumber(num: number) {
    const q = this.numberedQuestions[num - 1];
    return q?.id;
  }

  private getAnswerValue(qid: string) {
    return this.answers.get(qid)?.answerValue;
  }

  private scrollToQuestion(qid: string) {
    const target = this.questionCards?.find(
      (el) => el.nativeElement.getAttribute('data-qid') === qid
    );
    if (target) {
      target.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  private flashQuestion(qid: string) {
    this.highlightedId = qid;
    if (this.flashTimeoutId) clearTimeout(this.flashTimeoutId);
    this.flashTimeoutId = setTimeout(() => {
      this.highlightedId = null;
    }, 600);
  }

  private pageForNumber(num: number) {
    return Math.min(this.totalPages, Math.max(1, Math.ceil(num / this.pageSize)));
  }

  ngOnDestroy() {
    if (this.flashTimeoutId) clearTimeout(this.flashTimeoutId);
    if (this.popupTimeoutId) clearTimeout(this.popupTimeoutId);
  }
}
