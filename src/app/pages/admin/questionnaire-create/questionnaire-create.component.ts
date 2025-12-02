import { Component, OnInit, inject } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { QuestionnaireService } from '../../../core/services/questionnaire.service';
import { Router } from '@angular/router';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { CardComponent } from '../../../shared/components/card/card.component';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-questionnaire-create',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonComponent, InputComponent, CardComponent, NgFor, NgIf],
  template: `
    <h2 class="mb-4 text-xl font-semibold text-slate-800">Create Questionnaire</h2>
    <form [formGroup]="form" class="flex flex-col space-y-5" (ngSubmit)="save()">
      <app-card>
        <app-input label="Title" formControlName="title"></app-input>
        <div class="mt-4 space-y-2">
          <label class="text-sm text-slate-600">Description</label>
          <textarea
            formControlName="description"
            class="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
            rows="3"
          ></textarea>
        </div>
      </app-card>

      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-slate-800">Questions</h3>
          <app-button variant="secondary" (click)="addQuestion()" type="button">Add Question</app-button>
        </div>

        <app-card *ngFor="let q of questions.controls; let i = index" class="space-y-3">
          <div class="flex items-center justify-between">
            <div class="text-sm font-semibold text-slate-600">Question #{{ i + 1 }}</div>
            <button type="button" class="text-xs text-danger-600" (click)="removeQuestion(i)">Remove</button>
          </div>
          <app-input [label]="'Question text'" [formControl]="q.get('question_text')"></app-input>
          <div>
            <label class="text-sm text-slate-600">Type</label>
            <select
              class="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              [formControl]="q.get('type')"
              (change)="onTypeChange(q)"
            >
              <option value="text">Text</option>
              <option value="truefalse">True / False</option>
              <option value="mcq">Multiple Choice</option>
              <option value="checkbox">Checkbox</option>
              <option value="rating">Rating</option>
            </select>
          </div>
          <div *ngIf="showOptions(q)" class="space-y-2">
            <label class="text-sm text-slate-600">Options (comma separated)</label>
            <input
              class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              [value]="(q.get('options')?.value || []).join(', ')"
              (input)="onOptionsInput(q, $event)"
            />
          </div>
        </app-card>
      </div>

      <div class="flex justify-end pt-2">
        <app-button variant="primary" type="submit">Save</app-button>
      </div>
    </form>
  `
})
export class QuestionnaireCreateComponent implements OnInit {
  private fb = inject(FormBuilder);
  private qs = inject(QuestionnaireService);
  private router = inject(Router);

  form = this.fb.group({
    title: ['', Validators.required],
    description: [''],
    questions: this.fb.array([])
  });

  ngOnInit() {
    this.addQuestion();
  }

  get questions() {
    return this.form.get('questions') as FormArray;
  }

  addQuestion() {
    this.questions.push(
      this.fb.group({
        question_text: ['', Validators.required],
        type: ['text', Validators.required],
        options: [[]],
        order_index: [this.questions.length]
      })
    );
  }

  removeQuestion(idx: number) {
    this.questions.removeAt(idx);
  }

  showOptions(group: any) {
    const type = group.get('type')?.value;
    return type === 'mcq' || type === 'checkbox';
  }

  onTypeChange(group: any) {
    if (!this.showOptions(group)) group.get('options')?.setValue([]);
  }

  onOptionsInput(group: any, event: Event) {
    const value = (event.target as HTMLInputElement).value;
    const options = value
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s);
    group.get('options')?.setValue(options);
  }

  save() {
    if (this.form.invalid) return;
    const payload = this.form.getRawValue() as any;
    this.qs.create(payload).subscribe(() => {
      this.router.navigate(['/admin/questionnaires']);
    });
  }
}
