import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { catchError, map, of, switchMap } from 'rxjs';
import {
  Alert,
  Button,
  CostTable,
  FormField,
  Input,
  PageHeader,
  type CostLine,
  type Crumb,
} from '../../../../shared';
import { BookingsService, type CancelPreview } from '../../../../core/services/bookings.service';
import type { BookingSummary } from '../../../../core/models/booking';

@Component({
  selector: 'app-dashboard-booking-cancel',
  imports: [RouterLink, FormsModule, Alert, Button, CostTable, FormField, Input, PageHeader],
  template: `
    @if (booking(); as b) {
      <div class="px-8 py-8 max-w-3xl">
        <app-page-header title="Cancel booking" [breadcrumbs]="crumbs()" />

        <app-alert tone="warning" class="block mt-5 mb-6">
          Cancelling this booking is irreversible. Refund amount depends on how close to pickup you are.
        </app-alert>

        <div class="border border-line bg-bone p-5 mb-6">
          <p class="font-mono text-overline text-muted tracking-[0.10em] uppercase mb-1">Booking</p>
          <p class="font-condensed text-h3 font-extrabold uppercase text-slate">{{ b.gearTitle }}</p>
          <p class="text-xs text-muted">{{ b.startDate }} → {{ b.endDate }} · {{ b.counterpartyName }}</p>
        </div>

        <p class="font-mono text-overline text-muted tracking-[0.10em] uppercase mb-3">Refund preview</p>
        <app-cost-table
          [lines]="refundLines()"
          [totalCents]="refundTotal()"
          totalLabel="Refund to your card"
        />
        <p class="text-xs text-muted mt-2 leading-relaxed">
          Policy: <strong>{{ policyLabel() }}</strong> — {{ policyMessage() }}
        </p>

        <div class="mt-6">
          <app-form-field label="Reason for cancellation (helps us improve)">
            <textarea appInput rows="3" [(ngModel)]="reason" placeholder="Schedule conflict, weather, change of plans…"></textarea>
          </app-form-field>
        </div>

        <div class="flex gap-2 mt-6">
          <a appButton variant="ghost" [routerLink]="['/dashboard/bookings', b.id]">Keep booking</a>
          <button appButton variant="primary" type="button" class="flex-1" (click)="confirm()">
            Confirm cancellation
          </button>
        </div>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardBookingCancel {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly bookings = inject(BookingsService);

  private readonly bookingId = toSignal(
    this.route.params.pipe(map((p) => p['id'] as string)),
    { initialValue: '' },
  );

  private readonly bookingResult = toSignal(
    toObservable(this.bookingId).pipe(
      switchMap((id) => (id ? this.bookings.getById(id).pipe(catchError(() => of(null))) : of(null))),
    ),
    { initialValue: null as BookingSummary | null },
  );

  private readonly previewResult = toSignal(
    toObservable(this.bookingId).pipe(
      switchMap((id) => (id ? this.bookings.cancelPreview(id).pipe(catchError(() => of(null))) : of(null))),
    ),
    { initialValue: null as CancelPreview | null },
  );

  protected readonly booking = computed(() => this.bookingResult());

  protected readonly crumbs = computed<Crumb[]>(() => [
    { label: 'Bookings', route: '/dashboard/bookings' },
    { label: this.booking()?.gearTitle ?? '', route: `/dashboard/bookings/${this.bookingId()}` },
    { label: 'Cancel' },
  ]);

  protected readonly policyLabel = computed(() => {
    const policy = this.previewResult()?.policy;
    return policy
      ? ({ flexible: 'Flexible', moderate: 'Moderate', strict: 'Strict' })[policy]
      : '—';
  });

  protected readonly policyMessage = computed(
    () => this.previewResult()?.message ?? 'Calculating refund…',
  );

  protected readonly refundLines = computed<CostLine[]>(() => {
    const b = this.booking();
    const preview = this.previewResult();
    if (!b || !preview) return [];
    return [
      { label: 'Booking total', amountCents: b.totalCents },
      { label: 'Fee retained', amountCents: -preview.feeRetainedCents },
    ];
  });

  protected readonly refundTotal = computed(() => this.previewResult()?.refundCents ?? 0);

  protected reason = '';

  protected confirm(): void {
    const id = this.bookingId();
    if (!id) return;
    this.bookings.cancel(id, this.reason || undefined).subscribe({
      next: () => this.router.navigateByUrl('/dashboard/bookings'),
    });
  }
}
