import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { QuestionnaireService } from '../../../core/services/questionnaire.service';
import { CardComponent } from '../../../shared/components/card/card.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-user-info',
  standalone: true,
  imports: [ReactiveFormsModule, CardComponent, InputComponent, ButtonComponent, NgClass],
  template: `
    <app-card>
      <h2 class="text-xl font-semibold text-slate-800">Tell us about you</h2>
      <form class="mt-6 flex flex-col space-y-5" [formGroup]="form" (ngSubmit)="submit()">
        <div>
          <label class="block mb-2.5 text-sm font-medium text-slate-900" for="name">Name <span class="text-red-600 text-md">*</span></label>
          <input
            id="name"
            type="text"
            class="bg-slate-50 border text-slate-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full px-3 py-2.5 shadow-sm placeholder:text-slate-500"
            [ngClass]="inputClass('name')"
            placeholder="Your name"
            formControlName="name"
          />
          <p *ngIf="invalid('name')" class="mt-1 text-xs text-red-600">Name is required.</p>
        </div>
        <div>
          <label class="block mb-2.5 text-sm font-medium text-slate-900" for="age">Age <span class="text-red-600 text-md">*</span></label>
          <input
            id="age"
            type="number"
            class="bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full px-3 py-2.5 shadow-sm placeholder:text-slate-500"
            placeholder="30"
            formControlName="age"
          />
        </div>
        <div>
          <label for="email" class="block mb-2.5 text-sm font-medium text-slate-900">Your Email <span class="text-red-600 text-md">*</span> </label> 
          <div class="relative">
            <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg class="w-4 h-4 text-slate-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="m3.5 5.5 7.893 6.036a1 1 0 0 0 1.214 0L20.5 5.5M4 19h16a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Z"/></svg>
            </div>
            <input
              type="email"
              id="email"
              class="block w-full pl-9 pr-3 py-2.5 bg-slate-50 border text-slate-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-sm placeholder:text-slate-500"
              [ngClass]="inputClass('email')"
              placeholder="name@example.com"
              formControlName="email"
            />
          </div>
          <p *ngIf="invalid('email')" class="mt-1 text-xs text-red-600">Valid email is required.</p>
        </div>
        <div>
          <label class="block mb-2.5 text-sm font-medium text-slate-900" for="phone">Phone</label>
          <input
            id="phone"
            type="text"
            class="bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full px-3 py-2.5 shadow-sm placeholder:text-slate-500"
            placeholder="+1 555 123 4567"
            formControlName="phone"
          />
        </div>
        <div class="flex justify-end pt-2">
          <app-button variant="primary" type="submit">Continue</app-button>
        </div>
      </form>
    </app-card>
  `
})
export class UserInfoComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private qs = inject(QuestionnaireService);

  id = '';
  form = this.fb.group({
    name: ['', Validators.required],
    age: [null],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    saveUser: [true]
  });

  ngOnInit() {
    this.id = this.route.parent?.snapshot.params['id'] ?? this.route.snapshot.params['id'];
  }

  invalid(control: string) {
    const c = this.form.get(control);
    return !!c && c.invalid && (c.dirty || c.touched);
  }

  inputClass(control: string) {
    return this.invalid(control) ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-slate-200';
  }

  submit() {
    if (this.form.invalid) return;
    this.qs.startSession(this.id, this.form.value).subscribe((res) => {
      sessionStorage.setItem(`q-session-${this.id}`, res.sessionId);
      this.router.navigate(['/q', this.id, 'fill'], { queryParams: { sessionId: res.sessionId } });
    });
  }
}
