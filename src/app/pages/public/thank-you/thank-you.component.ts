import { Component } from '@angular/core';
import { CardComponent } from '../../../shared/components/card/card.component';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../../../shared/components/button/button.component';

@Component({
  selector: 'app-thank-you',
  standalone: true,
  imports: [CardComponent, RouterLink, ButtonComponent],
  template: `
    <app-card class="text-center">
      <h2 class="text-2xl font-semibold text-slate-900">Thank you!</h2>
      <p class="mt-2 text-slate-600">Your responses have been submitted.</p>
      <div class="mt-4">
        <app-button variant="secondary" routerLink="/">Back</app-button>
      </div>
    </app-card>
  `
})
export class ThankYouComponent {}
