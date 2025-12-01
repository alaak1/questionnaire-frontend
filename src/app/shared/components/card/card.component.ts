import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [NgClass],
  template: `<div class="rounded-xl bg-white p-4 shadow-card" [ngClass]="extraClass"><ng-content></ng-content></div>`
})
export class CardComponent {
  @Input() extraClass = '';
}
