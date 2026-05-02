import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { catchError, map, of, startWith, switchMap } from 'rxjs';
import {
  Avatar,
  Button,
  CostTable,
  CountdownDisplay,
  PageHeader,
  Spinner,
  StatusBadge,
  Timeline,
  type CostLine,
  type Crumb,
} from '../../../../shared';
import { BookingsService } from '../../../../core/services/bookings.service';
import { ToastService } from '../../../../core/services/toast.service';
import type { BookingSummary, BookingTimelineEvent } from '../../../../core/models/booking';

type ActionKind = 'confirm' | 'pickup' | 'return' | 'complete';

interface ActionDef {
  kind: ActionKind;
  label: string;
  busyLabel: string;
}

const ACTIONS_BY_STATUS: Record<string, ActionDef[]> = {
  pending: [{ kind: 'confirm', label: 'Accept booking', busyLabel: 'Accepting…' }],
  confirmed: [{ kind: 'pickup', label: 'Confirm pickup', busyLabel: 'Saving…' }],
  active: [{ kind: 'return', label: 'Confirm return', busyLabel: 'Saving…' }],
  returned: [{ kind: 'complete', label: 'Release funds', busyLabel: 'Releasing…' }],
};

@Component({
  selector: 'app-dashboard-booking-detail',
  imports: [
    RouterLink,
    Avatar,
    Button,
    CostTable,
    CountdownDisplay,
    PageHeader,
    Spinner,
    StatusBadge,
    Timeline,
  ],
  template: `
    @if (loading()) {
      <div class="px-8 py-16 text-center"><app-spinner /></div>
    } @else if (booking(); as b) {
      <div class="px-8 py-8">
        <app-page-header [title]="b.gearTitle" [breadcrumbs]="crumbs()">
          <div slot="actions" class="flex gap-2 flex-wrap">
            @for (action of availableActions(b.status); track action.kind) {
              <button
                appButton
                variant="primary"
                type="button"
                [disabled]="acting()"
                (click)="runAction(b.id, action.kind)"
              >
                {{ acting() && actingKind() === action.kind ? action.busyLabel : action.label }}
              </button>
            }
            @if (canCancel(b.status)) {
              <a appButton variant="ghost" [routerLink]="['/dashboard/bookings', b.id, 'cancel']">
                Cancel booking
              </a>
            }
          </div>
        </app-page-header>

        <div class="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 mt-6">
          <div>
            <div class="flex gap-3 items-center mb-5">
              <app-status-badge [status]="b.status" />
              <span class="font-mono text-xs text-muted">KTL-{{ b.id }}</span>
            </div>

            <section class="mb-7">
              <p class="font-mono text-overline text-muted tracking-[0.10em] uppercase mb-3">Status</p>
              <app-countdown-display
                [targetDate]="b.status === 'active' ? b.endDate : b.startDate"
              />
            </section>

            <section class="mb-7">
              <p class="font-mono text-overline text-muted tracking-[0.10em] uppercase mb-3">Counterparty</p>
              <div class="flex items-center gap-4 p-4 border border-line bg-surface">
                <app-avatar size="md" [name]="b.counterpartyName" />
                <div class="flex-1">
                  <div class="font-semibold">{{ b.counterpartyName }}</div>
                  <div class="text-xs text-muted">Member since 2025 · ★ 4.8</div>
                </div>
                <a appButton variant="ghost" routerLink="/dashboard/messages">Message</a>
              </div>
            </section>

            <section>
              <p class="font-mono text-overline text-muted tracking-[0.10em] uppercase mb-3">Timeline</p>
              <app-timeline [events]="timeline()" />
            </section>
          </div>

          <aside>
            <div class="sticky top-20 border border-line bg-bone p-5">
              <p class="font-mono text-overline text-muted tracking-[0.10em] uppercase mb-3">
                Booking total
              </p>
              <app-cost-table [lines]="costLines()" [totalCents]="b.totalCents" totalLabel="Total" />
              <p class="text-xs text-muted mt-4 leading-relaxed">
                Funds are held in escrow until both parties confirm return.
              </p>
            </div>
          </aside>
        </div>
      </div>
    } @else {
      <div class="px-8 py-16 text-center text-muted">Booking not found.</div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardBookingDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly bookings = inject(BookingsService);
  private readonly toast = inject(ToastService);

  private readonly refresh = signal(0);

  private readonly bookingId = toSignal(
    this.route.params.pipe(map((p) => p['id'] as string)),
    { initialValue: '' },
  );

  private readonly bookingResult = toSignal(
    toObservable(computed(() => ({ id: this.bookingId(), v: this.refresh() }))).pipe(
      switchMap(({ id }) => (id ? this.bookings.getById(id).pipe(catchError(() => of(null))) : of(null))),
      startWith(undefined as BookingSummary | null | undefined),
    ),
    { initialValue: undefined as BookingSummary | null | undefined },
  );

  private readonly timelineResult = toSignal(
    toObservable(computed(() => ({ id: this.bookingId(), v: this.refresh() }))).pipe(
      switchMap(({ id }) =>
        id
          ? this.bookings.getTimeline(id).pipe(catchError(() => of([] as BookingTimelineEvent[])))
          : of([] as BookingTimelineEvent[]),
      ),
    ),
    { initialValue: [] as BookingTimelineEvent[] },
  );

  protected readonly loading = computed(() => this.bookingResult() === undefined);
  protected readonly booking = computed(() => this.bookingResult() ?? null);
  protected readonly timeline = computed(() => this.timelineResult());
  protected readonly acting = signal(false);
  protected readonly actingKind = signal<ActionKind | null>(null);
  protected readonly crumbs = computed<Crumb[]>(() => [
    { label: 'Bookings', route: '/dashboard/bookings' },
    { label: this.booking()?.gearTitle ?? 'Detail' },
  ]);
  protected readonly costLines = computed<CostLine[]>(() => {
    const b = this.booking();
    if (!b) return [];
    const days = Math.max(1, Math.round((+new Date(b.endDate) - +new Date(b.startDate)) / 86_400_000));
    const dailyCents = Math.round(b.totalCents / days);
    return [
      { label: `$${dailyCents / 100} × ${days} days`, amountCents: dailyCents * days },
    ];
  });

  protected availableActions(status: string): ActionDef[] {
    return ACTIONS_BY_STATUS[status] ?? [];
  }

  protected canCancel(status: string): boolean {
    return status !== 'cancelled' && status !== 'returned' && status !== 'completed';
  }

  protected runAction(id: string, kind: ActionKind): void {
    if (this.acting()) return;
    this.acting.set(true);
    this.actingKind.set(kind);
    const obs =
      kind === 'confirm' ? this.bookings.confirm(id)
      : kind === 'pickup' ? this.bookings.confirmPickup(id)
      : kind === 'return' ? this.bookings.confirmReturn(id)
      : this.bookings.complete(id);
    obs.subscribe({
      next: () => {
        this.acting.set(false);
        this.actingKind.set(null);
        this.refresh.update((n) => n + 1);
      },
      error: (err: { error?: { message?: string } }) => {
        this.toast.error(err.error?.message ?? 'Could not update booking.');
        this.acting.set(false);
        this.actingKind.set(null);
      },
    });
  }
}
