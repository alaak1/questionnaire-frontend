import { Component } from '@angular/core';

@Component({
  selector: 'app-loader',
  standalone: true,
  template: `
    <div class="flex items-center justify-center py-8">
      <div class="h-10 w-10 animate-spin rounded-full border-2 border-slate-200 border-t-primary-600"></div>
    </div>
  `
})
export class LoaderComponent {}
