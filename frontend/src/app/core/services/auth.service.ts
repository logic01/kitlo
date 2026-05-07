import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TokenStorage } from '../auth/token-storage';
import type { User, UserRole } from '../models/user';

const USER_KEY = 'kitlo_current_user';

const SEED_USERS: Record<string, User> = {
  renter: {
    id: 'u-renter-1', name: 'Sam Hunter', email: 'sam@example.com',
    role: 'renter', verified: true, city: 'Aurora', state: 'CO', joinedAt: '2025-09-12',
  },
  lister: {
    id: 'u-lister-1', name: 'Jess Park', email: 'jess@example.com',
    role: 'lister', verified: true, city: 'Boulder', state: 'CO', joinedAt: '2025-04-04',
  },
  admin: {
    id: 'u-admin-1', name: 'Lee Brown', email: 'lee@kitlo.com',
    role: 'admin', verified: true, city: 'Denver', state: 'CO', joinedAt: '2024-11-01',
  },
};

export interface SignupInput {
  name: string;
  email: string;
  intent: 'renter' | 'lister' | 'both';
  password?: string;
  city?: string;
  state?: string;
}

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: BackendUser;
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

/** Default password used by signup forms that don't collect one. Real flow lands when login UX is finished. */
const DEFAULT_PASSWORD = 'kitlo-default';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly tokens = inject(TokenStorage);
  private readonly _currentUser = signal<User | null>(this.readUser());

  readonly currentUser = this._currentUser.asReadonly();
  readonly isAuthenticated = computed(() => this._currentUser() !== null);
  readonly role = computed<UserRole | null>(() => this._currentUser()?.role ?? null);

  login(email: string, password: string): Observable<User> {
    return this.http
      .post<AuthResponse>(`${environment.apiUrl}/auth/login`, { email, password })
      .pipe(
        tap((res) => this.tokens.set(res.accessToken, res.refreshToken)),
        map((res) => this.toUser(res.user)),
        tap((user) => this.setUser(user)),
      );
  }

  signup(input: SignupInput): Observable<User> {
    return this.http
      .post<AuthResponse>(`${environment.apiUrl}/auth/signup`, {
        name: input.name,
        email: input.email,
        password: input.password ?? DEFAULT_PASSWORD,
        intent: input.intent,
        city: input.city,
        state: input.state,
      })
      .pipe(
        tap((res) => this.tokens.set(res.accessToken, res.refreshToken)),
        map((res) => this.toUser(res.user)),
        tap((user) => this.setUser(user)),
      );
  }

  logout(): void {
    const refreshToken = this.tokens.getRefresh();
    this.tokens.clear();
    this.setUser(null);
    this.http
      .post(`${environment.apiUrl}/auth/logout`, refreshToken ? { refreshToken } : {})
      .subscribe({ error: () => undefined }); // best-effort
  }

  /**
   * Exchange the stored refresh token for a fresh access+refresh pair via the
   * backend's `/auth/refresh` rotation endpoint. Used by the auth interceptor
   * to recover from a 401 transparently.
   */
  refresh(): Observable<string> {
    const refreshToken = this.tokens.getRefresh();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    return this.http
      .post<AuthResponse>(`${environment.apiUrl}/auth/refresh`, { refreshToken })
      .pipe(
        tap((res) => this.tokens.set(res.accessToken, res.refreshToken)),
        tap((res) => this.setUser(this.toUser(res.user))),
        map((res) => res.accessToken),
      );
  }

  /**
   * Dev-only role switcher. Only works when `environment.production === false` —
   * the backend doesn't accept seed-user logins as-is, so this is a frontend-only
   * convenience that bypasses real auth and lets QA walk every workflow.
   */
  switchTo(role: UserRole | 'guest'): void {
    if (environment.production) return;
    if (role === 'guest') {
      this.tokens.clear();
      this.setUser(null);
      return;
    }
    this.setUser(SEED_USERS[role]);
  }

  private setUser(user: User | null): void {
    this._currentUser.set(user);
    if (typeof localStorage === 'undefined') return;
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
    else localStorage.removeItem(USER_KEY);
  }

  private readUser(): User | null {
    if (typeof localStorage === 'undefined') return null;
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  }

  private toUser(b: BackendUser): User {
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
}
