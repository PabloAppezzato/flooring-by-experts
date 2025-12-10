import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'workorders',
    loadChildren: () => import('./features/workorders/workorders.module').then(m => m.WorkordersModule)
  },
  { path: '**', redirectTo: 'login' }
];