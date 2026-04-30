import { ChangeDetectionStrategy, Component, computed, input, model, output } from '@angular/core';
import { Button } from '../button/button';
import { CostTable, CostLine } from '../cost-table/cost-table';
import { DateRangeInput, DateRangeValue } from '../date-range-input/date-range-input';
import { MoneyPipe } from '../../pipes/money.pipe';
import type { Listing } from '../../../core/models/listing';

@Component({
  selector: 'app-booking-sidebar',
  imports: [Button, CostTable, DateRangeInput, MoneyPipe],
  template: `
    <aside class="border border-line bg-bone p-5 sticky top-20">
      <p class="font-mono text-h2 font-medium text-olive mb-5">
        {{ listing().dailyRateCents | money }}<span class="text-sm text-muted font-normal"> /day</span>
      </p>

      <app-date-range-input [(range)]="range" />

      @if (lines().length > 0) {
        <div class="mt-5">
          <app-cost-table
            [lines]="lines()"
            [totalCents]="total()"
            totalLabel="Total"
            [depositCents]="listing().depositCents"
          />
        </div>
      }

      <button
        appButton
        variant="primary"
        size="lg"
        type="button"
        class="w-full mt-5"
        [disabled]="!range().start || !range().end"
        (click)="book.emit()"
      >
        Request this gear
      </button>

      <p class="text-xs text-muted text-center mt-3">
        You won't be charged until the lister approves.
      </p>
    </aside>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookingSidebar {
  readonly listing = input.required<Listing>();
  readonly range = model<DateRangeValue>({ start: null, end: null });
  readonly book = output<void>();

  protected readonly nights = computed(() => {
    const r = this.range();
    if (!r.start || !r.end) return 0;
    return Math.max(1, Math.round((r.end.getTime() - r.start.getTime()) / 86_400_000));
  });

  protected readonly lines = computed<CostLine[]>(() => {
    const n = this.nights();
    if (n === 0) return [];
    const rate = this.listing().dailyRateCents;
    const subtotal = rate * n;
    const fee = Math.round(subtotal * this.listing().serviceFeePct);
    return [
      { label: `${this.listing().dailyRateCents / 100} × ${n} day${n === 1 ? '' : 's'}`, amountCents: subtotal },
      { label: 'Service fee', amountCents: fee },
    ];
  });

  protected readonly total = computed(() => this.lines().reduce((s, l) => s + l.amountCents, 0));
}
