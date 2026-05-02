import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import type { Review, ReviewAccuracy } from '../models/review';

export interface ReviewPage {
  items: Review[];
  total: number;
  page: number;
  pageSize: number;
}

export interface SubmitReviewInput {
  bookingId: string;
  listingId?: string;
  aboutUserId?: string;
  rating: 1 | 2 | 3 | 4 | 5;
  text: string;
  accuracy?: ReviewAccuracy;
  tags?: string[];
  reviewerName: string;
  reviewerAvatarUrl?: string;
  reviewedRole: 'lister' | 'renter';
}

interface BackendReview {
  id: string;
  bookingId: string;
  reviewerName: string;
  reviewerAvatarUrl?: string | null;
  submittedAt: string;
  rating: number;
  accuracy?: number | null;
  text: string;
  tags?: string[] | null;
}

const ACCURACY: ReviewAccuracy[] = ['accurate', 'somewhat', 'inaccurate'];

function mapReview(b: BackendReview): Review {
  const r = Math.min(5, Math.max(1, Math.round(b.rating))) as 1 | 2 | 3 | 4 | 5;
  return {
    id: b.id,
    reviewerName: b.reviewerName,
    reviewerAvatarUrl: b.reviewerAvatarUrl ?? undefined,
    reviewedAt: b.submittedAt,
    rating: r,
    accuracy: b.accuracy != null ? ACCURACY[b.accuracy] : undefined,
    text: b.text,
    tags: b.tags ?? undefined,
  };
}

@Injectable({ providedIn: 'root' })
export class ReviewsService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.apiUrl;

  getByListing(listingId: string, page = 1, pageSize = 10): Observable<ReviewPage> {
    const params = new HttpParams().set('page', String(page)).set('pageSize', String(pageSize));
    return this.http
      .get<{ items: BackendReview[]; total: number; page: number; pageSize: number }>(
        `${this.base}/listings/${listingId}/reviews`,
        { params },
      )
      .pipe(
        map((r) => ({
          items: r.items.map(mapReview),
          total: r.total,
          page: r.page,
          pageSize: r.pageSize,
        })),
      );
  }

  getByUser(userId: string, _role?: 'lister' | 'renter'): Observable<Review[]> {
    return this.http
      .get<{ items: BackendReview[] }>(`${this.base}/reviews`, { params: new HttpParams().set('userId', userId) })
      .pipe(map((r) => r.items.map(mapReview)));
  }

  submit(input: SubmitReviewInput): Observable<Review> {
    return this.http
      .post<BackendReview>(`${this.base}/reviews/bookings/${input.bookingId}`, {
        rating: input.rating,
        accuracy: input.accuracy != null ? ACCURACY.indexOf(input.accuracy) : null,
        text: input.text,
        tags: input.tags ?? null,
      })
      .pipe(map(mapReview));
  }
}
