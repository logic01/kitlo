import { HttpErrorResponse, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { TokenStorage } from '../auth/token-storage';
import { AuthService } from '../services/auth.service';
import { environment } from '../../../environments/environment';

const REFRESH_PATH = '/auth/refresh';
const LOGIN_PATH = '/auth/login';
const SIGNUP_PATH = '/auth/signup';

/**
 * Attaches `Authorization: Bearer <token>` to API requests and, on a 401, attempts
 * a single refresh-token rotation against `/auth/refresh` before replaying the
 * original request. Skips third-party origins so we don't leak the access token
 * to CDNs (Cloudinary, Mapbox tiles, etc.).
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokens = inject(TokenStorage);
  const auth = inject(AuthService);
  const url = req.url;
  const isApi = url.startsWith(environment.apiUrl) || url.startsWith('/api');
  if (!isApi) return next(req);

  const token = tokens.accessToken();
  const authed = token ? withBearer(req, token) : req;

  return next(authed).pipe(
    catchError((err: unknown) => {
      if (
        !(err instanceof HttpErrorResponse) ||
        err.status !== 401 ||
        isAuthEndpoint(url) ||
        !tokens.getRefresh()
      ) {
        return throwError(() => err);
      }

      return auth.refresh().pipe(
        switchMap((newToken) => next(withBearer(req, newToken))),
        catchError((refreshErr: unknown) => {
          tokens.clear();
          return throwError(() => refreshErr);
        }),
      );
    }),
  );
};

function withBearer<T>(req: HttpRequest<T>, token: string): HttpRequest<T> {
  return req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
}

function isAuthEndpoint(url: string): boolean {
  return url.includes(REFRESH_PATH) || url.includes(LOGIN_PATH) || url.includes(SIGNUP_PATH);
}
