import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface WaitlistJoinInput {
  name: string;
  email: string;
  zip: string;
  firstRental?: string;
  interestedAsLister?: boolean;
  source?: string;
  hpCompany?: string;
}

export interface WaitlistJoinResult {
  id: string;
  alreadyOnList: boolean;
}

export interface WaitlistEntry {
  id: string;
  email: string;
  name: string;
  zip: string;
  firstRental: string | null;
  interestedAsLister: boolean;
  source: string | null;
  createdAt: string;
  convertedUserId: string | null;
}

export interface WaitlistPage {
  items: WaitlistEntry[];
  total: number;
  page: number;
  pageSize: number;
}

export interface WaitlistListQuery {
  q?: string;
  zip?: string;
  listersOnly?: boolean;
  page?: number;
  pageSize?: number;
}

@Injectable({ providedIn: 'root' })
export class WaitlistService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/waitlist`;

  join(input: WaitlistJoinInput): Observable<WaitlistJoinResult> {
    return this.http
      .post<{ ok?: boolean; next?: string }>(
        environment.waitlistEndpoint,
        {
          name: input.name,
          email: input.email,
          zip: input.zip,
          firstRental: input.firstRental ?? '',
          interestedAsLister: input.interestedAsLister ? 'yes' : 'no',
          source: input.source ?? '',
          _gotcha: input.hpCompany ?? '',
          _subject: `Kitlo waitlist — ${input.zip}`,
        },
        { headers: { Accept: 'application/json' } },
      )
      .pipe(
        tap(() => {
          if (typeof window !== 'undefined') {
            window.dispatchEvent(
              new CustomEvent('kitlo:waitlist_submit', {
                detail: { zip: input.zip, lister: !!input.interestedAsLister },
              }),
            );
          }
        }),
        map(() => ({ id: '', alreadyOnList: false })),
      );
  }

  list(query: WaitlistListQuery = {}): Observable<WaitlistPage> {
    let params = new HttpParams();
    if (query.q) params = params.set('q', query.q);
    if (query.zip) params = params.set('zip', query.zip);
    if (query.listersOnly) params = params.set('listersOnly', 'true');
    if (query.page) params = params.set('page', String(query.page));
    if (query.pageSize) params = params.set('pageSize', String(query.pageSize));
    return this.http.get<WaitlistPage>(this.base, { params });
  }

  exportCsv(): Observable<Blob> {
    return this.http.get(`${this.base}/export.csv`, { responseType: 'blob' });
  }
}
