import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';

import { HomeComponent } from './components/dashboard/home/home.component';
import { SettingsComponent } from './components/dashboard/settings/settings.component';
import { TaskViewComponent } from './components/task-view/task-view.component';
import { User } from './models/user.model';
import { UserComponent } from './components/user/user.component';

import { isLoggedInGuard } from './guards/is-logged-in.guard';
import { JobComponent } from './components/job/job.component';
import { isAdminGuard } from './guards/is-admin.guard';
import { CostCenterComponent } from './components/cost-center/cost-center.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard/' },
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    canActivate: [isLoggedInGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'users' },
      {
        path: 'tasks',
        component: TaskViewComponent,
      },
      {
        path: 'users',
        component: UserComponent,
      },
      { path: 'jobs', component: JobComponent },
      // { path: 'job', component: UserComponent, data: { user: User } },
      {
        path: 'cost-center',
        component: CostCenterComponent,
        // canActivate: [isAdminGuard],
      },
      {
        path: 'settings',
        component: SettingsComponent,
      },
    ],
  },
];
