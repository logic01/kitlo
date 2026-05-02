import { Injectable, signal } from '@angular/core';

const ACCESS_KEY = 'kitlo_access_token';
const REFRESH_KEY = 'kitlo_refresh_token';

/**
 * Persists JWTs in localStorage and exposes the current access token as a
 * signal so the auth interceptor + guards can react when it changes.
 */
@Injectable({ providedIn: 'root' })
export class TokenStorage {
  private readonly _accessToken = signal<string | null>(this.read(ACCESS_KEY));

  readonly accessToken = this._accessToken.asReadonly();

  set(access: string, refresh?: string): void {
    this.write(ACCESS_KEY, access);
    if (refresh !== undefined) this.write(REFRESH_KEY, refresh);
    this._accessToken.set(access);
  }

  getRefresh(): string | null {
    return this.read(REFRESH_KEY);
  }

  clear(): void {
    this.write(ACCESS_KEY, null);
    this.write(REFRESH_KEY, null);
    this._accessToken.set(null);
  }

  private read(key: string): string | null {
    if (typeof localStorage === 'undefined') return null;
    return localStorage.getItem(key);
  }

  private write(key: string, value: string | null): void {
    if (typeof localStorage === 'undefined') return;
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  }
}
