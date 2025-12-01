import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './layout/admin-layout/admin-layout.component';
import { PublicLayoutComponent } from './layout/public-layout/public-layout.component';
import { LoginComponent } from './pages/admin/login/login.component';
import { DashboardComponent } from './pages/admin/dashboard/dashboard.component';
import { QuestionnaireListComponent } from './pages/admin/questionnaire-list/questionnaire-list.component';
import { QuestionnaireCreateComponent } from './pages/admin/questionnaire-create/questionnaire-create.component';
import { QuestionnaireEditComponent } from './pages/admin/questionnaire-edit/questionnaire-edit.component';
import { QuestionnaireResultsComponent } from './pages/admin/questionnaire-results/questionnaire-results.component';
import { QuestionnaireSubmissionComponent } from './pages/admin/questionnaire-submission/questionnaire-submission.component';
import { LandingComponent } from './pages/public/landing/landing.component';
import { UserInfoComponent } from './pages/public/user-info/user-info.component';
import { QuestionnaireComponent } from './pages/public/questionnaire/questionnaire.component';
import { ThankYouComponent } from './pages/public/thank-you/thank-you.component';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: 'admin',
    children: [
      { path: 'login', component: LoginComponent },
      {
        path: '',
        component: AdminLayoutComponent,
        canActivate: [adminGuard],
        children: [
          { path: 'dashboard', component: DashboardComponent },
          { path: 'questionnaires', component: QuestionnaireListComponent },
          { path: 'questionnaires/new', component: QuestionnaireCreateComponent },
          { path: 'questionnaires/:id/edit', component: QuestionnaireEditComponent },
          { path: 'questionnaires/:id/results', component: QuestionnaireResultsComponent },
          { path: 'questionnaires/:id/submissions/:submissionId', component: QuestionnaireSubmissionComponent },
          { path: '', pathMatch: 'full', redirectTo: 'dashboard' }
        ]
      }
    ]
  },
  {
    path: 'q/:id',
    component: PublicLayoutComponent,
    children: [
      { path: '', component: LandingComponent },
      { path: 'user', component: UserInfoComponent },
      { path: 'fill', component: QuestionnaireComponent },
      { path: 'thank-you', component: ThankYouComponent }
    ]
  },
  { path: '', pathMatch: 'full', redirectTo: '/admin/login' },
  { path: '**', redirectTo: '/admin/login' }
];
