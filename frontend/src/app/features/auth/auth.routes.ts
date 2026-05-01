import { Routes } from '@angular/router';
import { PublicLayout } from '../../layouts/public-layout/public-layout';
import { AuthLogin } from './pages/login/login';
import { AuthSignup } from './pages/signup/signup';
import { AuthForgotPassword } from './pages/forgot-password/forgot-password';
import { AuthVerifyEmail } from './pages/verify-email/verify-email';

export const AUTH_ROUTES: Routes = [
  {
    path: '',
    component: PublicLayout,
    children: [
      { path: 'login', component: AuthLogin, data: { title: 'Sign in' } },
      { path: 'signup', component: AuthSignup, data: { title: 'Create account' } },
      { path: 'forgot-password', component: AuthForgotPassword, data: { title: 'Forgot password' } },
      { path: 'verify-email', component: AuthVerifyEmail, data: { title: 'Verify email' } },
    ],
  },
];
