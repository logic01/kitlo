import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenStorage } from '../auth/token-storage';
import { environment } from '../../../environments/environment';

/**
 * Adds `Authorization: Bearer <token>` to every same-origin / API request when
 * a token is present. Skips requests to other origins so we don't leak the
 * token to third-party CDNs (Cloudinary, Mapbox tiles, etc.).
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(TokenStorage).accessToken();
  if (!token) return next(req);

  const url = req.url;
  const isApi = url.startsWith(environment.apiUrl) || url.startsWith('/api');
  if (!isApi) return next(req);

  return next(
    req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    }),
  );
};
