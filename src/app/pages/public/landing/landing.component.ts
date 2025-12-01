import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { QuestionnaireService } from '../../../core/services/questionnaire.service';
import { CardComponent } from '../../../shared/components/card/card.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink, CardComponent, ButtonComponent, NgIf],
  template: `
    <app-card *ngIf="data">
      <div class="text-sm uppercase tracking-wide text-primary-600">Questionnaire</div>
      <h1 class="mt-2 text-2xl font-bold text-slate-900">{{ data.title }}</h1>
      <p class="mt-2 text-slate-600">{{ data.description }}</p>
      <div class="mt-6">
        <app-button variant="primary" [routerLink]="['/q', id, 'user']">Start Questionnaire</app-button>
      </div>
    </app-card>
  `
})
export class LandingComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private qs = inject(QuestionnaireService);

  data: any;
  id = '';

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.qs.getPublic(this.id).subscribe((res) => (this.data = res.questionnaire));
  }
}
