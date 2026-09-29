import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main/main.component';
import { UnauthorizedGuard } from './shared/guards/unauthorized.guard';
import { AuthorizatedGuard } from './shared/guards/authentication.guard';

export const appRoutes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [UnauthorizedGuard]
  },
  {
    path: 'main/:id',
    component: MainComponent,
    canActivate: [AuthorizatedGuard]
  },
  {
    path: '**',
    redirectTo: 'login',
    pathMatch: 'full'
  }
];
