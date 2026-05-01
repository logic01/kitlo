import { Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import type { Review, ReviewAccuracy } from '../models/review';
import { MOCK_RENTER_REVIEWS, MOCK_REVIEWS_BY_LISTING } from '../mock-data';
import { generateId, mockError, mockResponse, nowIso } from './mock-response';

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

const DEFAULT_PAGE_SIZE = 10;

@Injectable({ providedIn: 'root' })
export class ReviewsService {
  private byListing: Record<string, Review[]> = Object.fromEntries(
    MOCK_REVIEWS_BY_LISTING.map((g) => [g.listingId, g.reviews.map((r) => ({ ...r }))]),
  );
  private aboutUser: Record<string, Review[]> = { 'u-renter-1': MOCK_RENTER_REVIEWS.map((r) => ({ ...r })) };
  private listingByBookingId: Record<string, string> = {};

  getByListing(listingId: string, page = 1, pageSize = DEFAULT_PAGE_SIZE): Observable<ReviewPage> {
    const all = this.byListing[listingId] ?? [];
    const start = (page - 1) * pageSize;
    return mockResponse({
      items: all.slice(start, start + pageSize),
      total: all.length,
      page,
      pageSize,
    });
  }

  getByUser(userId: string, _role?: 'lister' | 'renter'): Observable<Review[]> {
    return mockResponse((this.aboutUser[userId] ?? []).map((r) => ({ ...r })));
  }

  submit(input: SubmitReviewInput): Observable<Review> {
    if (!input.listingId && !input.aboutUserId) {
      return mockError('Review must reference a listing or a user');
    }
    const review: Review = {
      id: generateId('rv'),
      reviewerName: input.reviewerName,
      reviewerAvatarUrl: input.reviewerAvatarUrl,
      reviewedAt: nowIso(),
      rating: input.rating,
      accuracy: input.accuracy,
      text: input.text,
      tags: input.tags,
    };
    if (input.listingId) {
      this.byListing[input.listingId] = [review, ...(this.byListing[input.listingId] ?? [])];
    }
    if (input.aboutUserId) {
      this.aboutUser[input.aboutUserId] = [review, ...(this.aboutUser[input.aboutUserId] ?? [])];
    }
    return mockResponse({ ...review });
  }
}
