import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Avatar } from '../avatar/avatar';
import { StatusBadge } from '../status-badge/status-badge';
import { DateRangePipe } from '../../pipes/date-range.pipe';
import { MoneyPipe } from '../../pipes/money.pipe';
import type { BookingSummary } from '../../../core/models/booking';

@Component({
  selector: 'app-booking-card',
  imports: [RouterLink, Avatar, StatusBadge, DateRangePipe, MoneyPipe],
  template: `
    <a
      [routerLink]="['/booking', booking().id]"
      class="grid grid-cols-[80px_1fr_auto] gap-5 px-5 py-4 border border-line bg-bone items-center text-inherit no-underline transition-colors hover:border-slate"
    >
      <div
        class="w-20 h-[60px] bg-surface bg-cover bg-center shrink-0"
        [style.background-image]="'url(' + booking().gearPhotoUrl + ')'"
        role="img"
        [attr.aria-label]="booking().gearTitle"
      ></div>

      <div class="min-w-0">
        <h3
          class="font-condensed text-[17px] font-extrabold uppercase tracking-[0.04em] text-slate leading-tight mb-1"
        >
          {{ booking().gearTitle }}
        </h3>
        <p class="font-mono text-[11px] text-muted mb-2 uppercase tracking-[0.06em]">
          {{ { start: booking().startDate, end: booking().endDate } | dateRange }}
        </p>
        <div class="flex items-center gap-2 text-xs text-muted">
          <app-avatar
            [name]="booking().counterpartyName"
            [imageUrl]="booking().counterpartyAvatarUrl"
            size="sm"
          />
          <span>{{ booking().counterpartyName }}</span>
        </div>
      </div>

      <div class="flex flex-col items-end gap-2 shrink-0">
        <app-status-badge [status]="booking().status" />
        <span class="font-mono text-sm font-medium text-slate">
          {{ booking().totalCents | money }}
        </span>
      </div>
    </a>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookingCard {
  readonly booking = input.required<BookingSummary>();
}
