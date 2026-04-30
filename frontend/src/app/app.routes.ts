import { Routes } from '@angular/router';
import { PublicLayout } from './layouts/public-layout/public-layout';
import { AuthenticatedLayout } from './layouts/authenticated-layout/authenticated-layout';
import { AdminLayout } from './layouts/admin-layout/admin-layout';
import { PlaceholderPage } from './pages/placeholder/placeholder';
import { NotFound } from './pages/not-found/not-found';
import { Forbidden } from './pages/forbidden/forbidden';
import { authGuard, roleGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: PublicLayout,
    children: [
      { path: '', component: PlaceholderPage, data: { title: 'Home', task: '3.12' } },
      { path: 'how-it-works', component: PlaceholderPage, data: { title: 'How it works', task: '3.12' } },
      { path: 'search', component: PlaceholderPage, data: { title: 'Search & discovery', task: '3.12' } },
      { path: 'listing/:id', component: PlaceholderPage, data: { title: 'Listing detail', task: '3.12' } },
      { path: 'list-your-gear', component: PlaceholderPage, data: { title: 'For listers', task: '3.12' } },
      { path: 'about', component: PlaceholderPage, data: { title: 'About', task: '3.12' } },
      { path: 'contact', component: PlaceholderPage, data: { title: 'Contact', task: '3.12' } },
      { path: 'forbidden', component: Forbidden },
    ],
  },
  {
    path: 'auth',
    component: PublicLayout,
    children: [
      { path: 'login', component: PlaceholderPage, data: { title: 'Sign in', task: '3.13' } },
      { path: 'signup', component: PlaceholderPage, data: { title: 'Create account', task: '3.13' } },
      { path: 'forgot-password', component: PlaceholderPage, data: { title: 'Forgot password', task: '3.13' } },
      { path: 'verify-email', component: PlaceholderPage, data: { title: 'Verify email', task: '3.13' } },
    ],
  },
  {
    path: 'dashboard',
    component: AuthenticatedLayout,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'bookings', pathMatch: 'full' },
      { path: 'bookings', component: PlaceholderPage, data: { title: 'Bookings', task: '3.14' } },
      { path: 'messages', component: PlaceholderPage, data: { title: 'Messages', task: '3.14' } },
      { path: 'profile', component: PlaceholderPage, data: { title: 'Profile', task: '3.14' } },
      { path: 'reviews', component: PlaceholderPage, data: { title: 'Reviews', task: '3.14' } },
      { path: 'notifications', component: PlaceholderPage, data: { title: 'Notifications', task: '3.14' } },
      {
        path: 'listings',
        canActivate: [roleGuard(['lister', 'admin'])],
        component: PlaceholderPage,
        data: { title: 'My listings', task: '3.15' },
      },
      {
        path: 'listings/new',
        canActivate: [roleGuard(['lister', 'admin'])],
        component: PlaceholderPage,
        data: { title: 'Create listing', task: '3.15' },
      },
      {
        path: 'earnings',
        canActivate: [roleGuard(['lister', 'admin'])],
        component: PlaceholderPage,
        data: { title: 'Earnings', task: '3.15' },
      },
      {
        path: 'setup-onboarding',
        canActivate: [roleGuard(['lister', 'admin'])],
        component: PlaceholderPage,
        data: { title: 'Lister onboarding', task: '3.15' },
      },
      {
        path: 'bank-account',
        canActivate: [roleGuard(['lister', 'admin'])],
        component: PlaceholderPage,
        data: { title: 'Bank account', task: '3.15' },
      },
    ],
  },
  {
    path: 'booking/:id',
    component: AuthenticatedLayout,
    canActivate: [authGuard],
    children: [
      { path: '', component: PlaceholderPage, data: { title: 'Booking detail', task: '3.14' } },
    ],
  },
  {
    path: 'admin',
    component: AdminLayout,
    canActivate: [roleGuard(['admin'])],
    children: [
      { path: '', redirectTo: 'listings', pathMatch: 'full' },
      { path: 'listings', component: PlaceholderPage, data: { title: 'Listing review', task: '3.16' } },
      { path: 'disputes', component: PlaceholderPage, data: { title: 'Disputes', task: '3.16' } },
      { path: 'users', component: PlaceholderPage, data: { title: 'Users', task: '3.16' } },
      { path: 'payouts', component: PlaceholderPage, data: { title: 'Payouts', task: '3.16' } },
    ],
  },
  { path: '**', component: NotFound },
];
