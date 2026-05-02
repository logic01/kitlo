import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import type { ProfileSummary, User, UserRole } from '../models/user';
import { AuthService } from './auth.service';

export interface NotificationPreferences {
  emailBookingUpdates: boolean;
  emailMessages: boolean;
  emailMarketing: boolean;
  pushBookingUpdates: boolean;
  pushMessages: boolean;
  smsBookingReminders: boolean;
}

export interface OnboardingStatus {
  profileComplete: boolean;
  identityVerified: boolean;
  bankConnected: boolean;
  listerAgreementSigned: boolean;
  firstListingPublished: boolean;
}

export interface PublicProfile {
  user: User;
  profile: ProfileSummary;
  listerSince?: string;
  totalRentals: number;
  responseHours: number;
}

interface BackendUser {
  id: string;
  email: string;
  name: string;
  role: string;
  verified: boolean;
  city?: string | null;
  state?: string | null;
  avatarUrl?: string | null;
  joinedAt: string;
}

interface BackendPublicProfile {
  id: string;
  name: string;
  avatarUrl?: string | null;
  verified: boolean;
  city?: string | null;
  state?: string | null;
  joinedAt: string;
  ratingAverage: number;
  ratingCount: number;
}

interface BackendPreferences {
  emailEnabled: boolean;
  pushEnabled: boolean;
  smsEnabled: boolean;
  optedOutMask: number;
}

const DEFAULT_PREFS: NotificationPreferences = {
  emailBookingUpdates: true,
  emailMessages: true,
  emailMarketing: false,
  pushBookingUpdates: true,
  pushMessages: true,
  smsBookingReminders: false,
};

const AGREEMENT_KEY = 'kitlo_lister_agreement';

function toUser(b: BackendUser): User {
  return {
    id: b.id,
    name: b.name,
    email: b.email,
    role: (b.role as UserRole) ?? 'renter',
    verified: b.verified,
    city: b.city ?? undefined,
    state: b.state ?? undefined,
    avatarUrl: b.avatarUrl ?? undefined,
    joinedAt: b.joinedAt,
  };
}

function toProfile(b: BackendPublicProfile): ProfileSummary {
  return {
    id: b.id,
    name: b.name,
    avatarUrl: b.avatarUrl ?? undefined,
    verified: b.verified,
    city: b.city ?? undefined,
    state: b.state ?? undefined,
    rating: b.ratingCount > 0 ? { average: b.ratingAverage, count: b.ratingCount } : undefined,
  };
}

/**
 * Frontend exposes per-event toggles; backend exposes per-channel toggles + an
 * opt-out bitmask. We collapse for now — granular per-event opt-outs land
 * behind a follow-up endpoint.
 */
function toFrontendPrefs(b: BackendPreferences): NotificationPreferences {
  return {
    emailBookingUpdates: b.emailEnabled,
    emailMessages: b.emailEnabled,
    emailMarketing: b.emailEnabled,
    pushBookingUpdates: b.pushEnabled,
    pushMessages: b.pushEnabled,
    smsBookingReminders: b.smsEnabled,
  };
}

function fromFrontendPrefs(p: NotificationPreferences): BackendPreferences {
  return {
    emailEnabled: p.emailBookingUpdates || p.emailMessages || p.emailMarketing,
    pushEnabled: p.pushBookingUpdates || p.pushMessages,
    smsEnabled: p.smsBookingReminders,
    optedOutMask: 0,
  };
}

@Injectable({ providedIn: 'root' })
export class UsersService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);
  private readonly base = environment.apiUrl;

  getMe(): Observable<User> {
    return this.http.get<BackendUser>(`${this.base}/users/me`).pipe(map(toUser));
  }

  getProfile(id: string): Observable<ProfileSummary> {
    return this.http.get<BackendPublicProfile>(`${this.base}/users/${id}/profile`).pipe(map(toProfile));
  }

  getPublicProfile(id: string): Observable<PublicProfile> {
    return this.http.get<BackendPublicProfile>(`${this.base}/users/${id}/profile`).pipe(
      map((p) => {
        const profile = toProfile(p);
        return {
          user: {
            id: p.id,
            name: p.name,
            email: '',
            role: 'lister' as UserRole,
            verified: p.verified,
            city: p.city ?? undefined,
            state: p.state ?? undefined,
            avatarUrl: p.avatarUrl ?? undefined,
            joinedAt: p.joinedAt,
          },
          profile,
          listerSince: p.joinedAt,
          totalRentals: p.ratingCount,
          responseHours: 4,
        };
      }),
    );
  }

  updateProfile(patch: Partial<User> & { bio?: string }): Observable<User> {
    const me = this.auth.currentUser();
    if (!me) throw new Error('Not authenticated');
    return this.http
      .put<BackendUser>(`${this.base}/users/${me.id}`, {
        name: patch.name,
        city: patch.city,
        state: patch.state,
        avatarUrl: patch.avatarUrl,
        bio: patch.bio,
      })
      .pipe(map(toUser));
  }

  /**
   * Intent is now persisted at signup time. Kept as a no-op so existing callers
   * (signup wizard) don't break; safe to delete once those flows finish migrating.
   */
  saveIntent(_intent: 'renter' | 'lister' | 'both'): Observable<void> {
    return of(undefined);
  }

  /**
   * Cloudinary signed-upload integration is scaffolded in 5.5 but inert without
   * a configured cloud. Returns a placehold.co URL so previews still render in dev.
   */
  uploadProfilePhoto(_file: File | Blob): Observable<string> {
    const url = `https://placehold.co/240x240/333/eee?text=Avatar`;
    return of(url);
  }

  getNotificationPreferences(): Observable<NotificationPreferences> {
    return this.http
      .get<BackendPreferences>(`${this.base}/notifications/preferences`)
      .pipe(map(toFrontendPrefs));
  }

  updateNotificationPreferences(prefs: Partial<NotificationPreferences>): Observable<NotificationPreferences> {
    const merged: NotificationPreferences = { ...DEFAULT_PREFS, ...prefs };
    return this.http
      .put<BackendPreferences>(`${this.base}/notifications/preferences`, fromFrontendPrefs(merged))
      .pipe(map(toFrontendPrefs));
  }

  /**
   * Onboarding status is computed client-side from the cached `currentUser` plus a
   * locally-tracked agreement signature. A dedicated `/api/users/me/onboarding`
   * endpoint is owed in a follow-up.
   */
  getOnboardingStatus(): Observable<OnboardingStatus> {
    const me = this.auth.currentUser();
    const signed = typeof localStorage !== 'undefined' && !!localStorage.getItem(AGREEMENT_KEY);
    return of({
      profileComplete: !!me?.city && !!me?.state,
      identityVerified: !!me?.verified,
      bankConnected: false,
      listerAgreementSigned: signed,
      firstListingPublished: false,
    });
  }

  recordListerAgreement(): Observable<{ signedAt: string }> {
    const signedAt = new Date().toISOString();
    if (typeof localStorage !== 'undefined') localStorage.setItem(AGREEMENT_KEY, signedAt);
    return of({ signedAt });
  }
}
