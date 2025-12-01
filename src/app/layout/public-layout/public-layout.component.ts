import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="min-h-screen bg-slate-50">
      <main class="mx-auto max-w-4xl px-4 py-6">
        <router-outlet></router-outlet>
      </main>
    </div>
  `
})
export class PublicLayoutComponent {}
