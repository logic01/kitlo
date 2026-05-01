import { Routes } from '@angular/router';
import { AdminLayout } from '../../layouts/admin-layout/admin-layout';
import { roleGuard } from '../../core/guards/auth.guard';

import { AdminHome } from './pages/home/home';
import { AdminListings } from './pages/listings/listings';
import { AdminListingDetail } from './pages/listing-detail/listing-detail';
import { AdminDisputes } from './pages/disputes/disputes';
import { AdminDisputeDetail } from './pages/dispute-detail/dispute-detail';
import { AdminUsers } from './pages/users/users';
import { AdminUserDetail } from './pages/user-detail/user-detail';
import { AdminPayouts } from './pages/payouts/payouts';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminLayout,
    canActivate: [roleGuard(['admin'])],
    children: [
      { path: '', component: AdminHome, data: { title: 'Admin overview' } },
      { path: 'listings', component: AdminListings, data: { title: 'Listing review' } },
      { path: 'listings/:id', component: AdminListingDetail, data: { title: 'Listing review' } },
      { path: 'disputes', component: AdminDisputes, data: { title: 'Disputes' } },
      { path: 'disputes/:id', component: AdminDisputeDetail, data: { title: 'Dispute detail' } },
      { path: 'users', component: AdminUsers, data: { title: 'Users' } },
      { path: 'users/:id', component: AdminUserDetail, data: { title: 'User detail' } },
      { path: 'payouts', component: AdminPayouts, data: { title: 'Payouts' } },
    ],
  },
];
