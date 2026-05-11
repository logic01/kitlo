import { Routes } from '@angular/router';
import { NotFound } from './pages/not-found/not-found';

export const routes: Routes = [
  {
    path: 'early-access',
    loadComponent: () =>
      import('./features/public/pages/early-access/early-access').then((m) => m.EarlyAccess),
    data: { title: 'Early access' },
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./features/dashboard/dashboard.routes').then((m) => m.DASHBOARD_ROUTES),
  },
  {
    path: 'booking/:id',
    loadChildren: () => import('./features/dashboard/dashboard.routes').then((m) => m.BOOKING_ROUTES),
  },
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.routes').then((m) => m.ADMIN_ROUTES),
  },
  {
    path: '',
       loadComponent: () =>
      import('./features/public/pages/early-access/early-access').then((m) => m.EarlyAccess),
    data: { title: 'Early access' },
  },
  { path: '**', component: NotFound },
];
