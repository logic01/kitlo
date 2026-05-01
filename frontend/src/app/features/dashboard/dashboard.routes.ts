import { Routes } from '@angular/router';
import { AuthenticatedLayout } from '../../layouts/authenticated-layout/authenticated-layout';
import { authGuard, roleGuard } from '../../core/guards/auth.guard';

import { DashboardHome } from './pages/home/home';
import { DashboardBookings } from './pages/bookings/bookings';
import { DashboardBookingDetail } from './pages/booking-detail/booking-detail';
import { DashboardBookingCancel } from './pages/booking-cancel/booking-cancel';
import { DashboardBookingRequest } from './pages/booking-request/booking-request';
import { DashboardBookingCheckout } from './pages/booking-checkout/booking-checkout';
import { DashboardBookingConfirmed } from './pages/booking-confirmed/booking-confirmed';
import { DashboardMessagesInbox } from './pages/messages-inbox/messages-inbox';
import { DashboardMessagesThread } from './pages/messages-thread/messages-thread';
import { DashboardProfile } from './pages/profile/profile';
import { DashboardPublicProfile } from './pages/public-profile/public-profile';
import { DashboardReviews } from './pages/reviews/reviews';
import { DashboardLeaveReview } from './pages/leave-review/leave-review';
import { DashboardNotifications } from './pages/notifications/notifications';

import { DashboardListings } from './pages/listings/listings';
import { DashboardListingCreate } from './pages/listing-create/listing-create';
import { DashboardListingEdit } from './pages/listing-edit/listing-edit';
import { DashboardAvailabilityCalendar } from './pages/availability-calendar/availability-calendar';
import { DashboardBundleCreate } from './pages/bundle-create/bundle-create';
import { DashboardEarnings } from './pages/earnings/earnings';
import { DashboardBankAccount } from './pages/bank-account/bank-account';
import { DashboardSetupOnboarding } from './pages/setup-onboarding/setup-onboarding';

const listerRoles = ['lister', 'admin'] as const;

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    component: AuthenticatedLayout,
    canActivate: [authGuard],
    children: [
      { path: '', component: DashboardHome, data: { title: 'Dashboard' } },
      { path: 'bookings', component: DashboardBookings, data: { title: 'Bookings' } },
      { path: 'bookings/:id', component: DashboardBookingDetail, data: { title: 'Booking detail' } },
      { path: 'bookings/:id/cancel', component: DashboardBookingCancel, data: { title: 'Cancel booking' } },
      { path: 'bookings/:id/review', component: DashboardLeaveReview, data: { title: 'Leave a review' } },
      { path: 'messages', component: DashboardMessagesInbox, data: { title: 'Messages' } },
      { path: 'messages/:id', component: DashboardMessagesThread, data: { title: 'Message thread' } },
      { path: 'profile', component: DashboardProfile, data: { title: 'Profile' } },
      { path: 'reviews', component: DashboardReviews, data: { title: 'Reviews' } },
      { path: 'notifications', component: DashboardNotifications, data: { title: 'Notifications' } },
      {
        path: 'listings',
        canActivate: [roleGuard([...listerRoles])],
        component: DashboardListings,
        data: { title: 'My listings' },
      },
      {
        path: 'listings/new',
        canActivate: [roleGuard([...listerRoles])],
        component: DashboardListingCreate,
        data: { title: 'Create listing' },
      },
      {
        path: 'listings/bundle/new',
        canActivate: [roleGuard([...listerRoles])],
        component: DashboardBundleCreate,
        data: { title: 'Create bundle' },
      },
      {
        path: 'listings/:id/edit',
        canActivate: [roleGuard([...listerRoles])],
        component: DashboardListingEdit,
        data: { title: 'Edit listing' },
      },
      {
        path: 'listings/:id/calendar',
        canActivate: [roleGuard([...listerRoles])],
        component: DashboardAvailabilityCalendar,
        data: { title: 'Availability' },
      },
      {
        path: 'earnings',
        canActivate: [roleGuard([...listerRoles])],
        component: DashboardEarnings,
        data: { title: 'Earnings' },
      },
      {
        path: 'setup-onboarding',
        canActivate: [roleGuard([...listerRoles])],
        component: DashboardSetupOnboarding,
        data: { title: 'Lister onboarding' },
      },
      {
        path: 'bank-account',
        canActivate: [roleGuard([...listerRoles])],
        component: DashboardBankAccount,
        data: { title: 'Bank account' },
      },
      { path: 'users/:id', component: DashboardPublicProfile, data: { title: 'Public profile' } },
    ],
  },
];

export const BOOKING_ROUTES: Routes = [
  {
    path: '',
    component: AuthenticatedLayout,
    canActivate: [authGuard],
    children: [
      { path: ':id', component: DashboardBookingDetail, data: { title: 'Booking detail' } },
      { path: ':id/request', component: DashboardBookingRequest, data: { title: 'Booking request' } },
      { path: ':id/checkout', component: DashboardBookingCheckout, data: { title: 'Checkout' } },
      { path: ':id/confirmed', component: DashboardBookingConfirmed, data: { title: 'Booking confirmed' } },
    ],
  },
];
