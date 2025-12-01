import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { QuestionnaireService } from '../../../core/services/questionnaire.service';
import { CardComponent } from '../../../shared/components/card/card.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';

@Component({
  selector: 'app-user-info',
  standalone: true,
  imports: [ReactiveFormsModule, CardComponent, InputComponent, ButtonComponent],
  template: `
    <app-card>
      <h2 class="text-xl font-semibold text-slate-800">Tell us about you</h2>
      <form class="mt-6 flex flex-col space-y-5" [formGroup]="form" (ngSubmit)="submit()">
        <app-input label="Name" formControlName="name"></app-input>
        <app-input label="Age" type="number" formControlName="age"></app-input>
        <app-input label="Email" type="email" formControlName="email"></app-input>
        <app-input label="Phone" type="text" formControlName="phone"></app-input>
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

  submit() {
    if (this.form.invalid) return;
    this.qs.startSession(this.id, this.form.value).subscribe((res) => {
      this.router.navigate(['/q', this.id, 'fill'], { queryParams: { sessionId: res.sessionId } });
    });
  }
}
