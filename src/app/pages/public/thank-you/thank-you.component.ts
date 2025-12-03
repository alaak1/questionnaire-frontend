import { Component, computed, inject } from '@angular/core';
import { CardComponent } from '../../../shared/components/card/card.component';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-thank-you',
  standalone: true,
  imports: [CardComponent, RouterLink, ButtonComponent],
  template: `
    <app-card class="text-center">
      <h2 class="text-2xl font-semibold text-slate-900">Thank you!</h2>
      <p class="mt-2 text-slate-600">
        {{ statusMessage() }}
      </p>
      <div class="mt-2 text-xs text-slate-500" *ngIf="reportId()">
        Report reference: {{ reportId() }}
      </div>
      <div class="mt-4">
        <app-button variant="secondary" routerLink="/">Back</app-button>
      </div>
    </app-card>
  `
})
export class ThankYouComponent {
  private router = inject(Router);
  private state =
    this.router.getCurrentNavigation()?.extras?.state || (typeof window !== 'undefined' ? window.history.state : {});

  reportStatus = computed(() => this.state['reportStatus']);
  reportId = computed(() => this.state['reportId']);

  statusMessage() {
    if (this.reportStatus()) {
      return 'Your responses were received. AI reporting is pending.';
    }
    return 'Your responses have been submitted.';
  }
}
