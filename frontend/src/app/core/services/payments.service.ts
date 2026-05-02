import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface PaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
}

@Injectable({ providedIn: 'root' })
export class PaymentsService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/payments`;

  /** Create a PaymentIntent (rental + deposit) for the booking. */
  createIntent(bookingId: string): Observable<PaymentIntentResponse> {
    return this.http.post<PaymentIntentResponse>(`${this.base}/intent`, { bookingId });
  }

  /**
   * Confirm the booking's payments server-side. In live mode the client also
   * runs `confirmCardPayment` against the returned `clientSecret`; this call
   * captures the rental and authorizes the deposit hold.
   */
  confirm(bookingId: string): Observable<void> {
    return this.http.post<void>(`${this.base}/confirm`, { bookingId });
  }

  refund(paymentId: string, amountCents?: number): Observable<void> {
    const query = amountCents != null ? `?amountCents=${amountCents}` : '';
    return this.http.post<void>(`${this.base}/${paymentId}/refund${query}`, {});
  }
}
