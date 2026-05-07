import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'early-access',
    loadComponent: () =>
      import('./features/public/pages/early-access/early-access').then((m) => m.EarlyAccess),
    data: { title: 'Early access' },
  },
  { path: '**', redirectTo: 'early-access' },
];
