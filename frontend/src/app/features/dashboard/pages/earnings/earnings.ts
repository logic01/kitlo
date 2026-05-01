import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { startWith } from 'rxjs';
import { map } from 'rxjs/operators';
import { Button, DataTable, PageHeader, StatCard, type ColumnDef } from '../../../../shared';
import { MoneyPipe } from '../../../../shared/pipes/money.pipe';
import { PayoutsService } from '../../../../core/services/payouts.service';
import type { EarningsSummary, Payout } from '../../../../core/models/payout';

@Component({
  selector: 'app-dashboard-earnings',
  imports: [Button, DataTable, PageHeader, StatCard, MoneyPipe],
  template: `
    <div class="px-8 py-8">
      <app-page-header title="Earnings" subtitle="Lifetime + monthly breakdown of payouts.">
        <div slot="actions">
          <button appButton variant="ghost" type="button" (click)="exportCsv()">Export CSV</button>
        </div>
      </app-page-header>

      @if (summary(); as s) {
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6 mb-8">
          <app-stat-card overline="Lifetime" value="{{ s.lifetimeCents | money }}" sublabel="{{ s.bookingsCount }} rentals" tone="primary" />
          <app-stat-card overline="Pending" value="{{ s.pendingCents | money }}" sublabel="In escrow / scheduled" tone="pending" />
          <app-stat-card overline="This month" value="{{ s.thisMonthCents | money }}" />
          <app-stat-card overline="Avg daily rate" value="{{ s.averageDailyRateCents | money }}" />
        </div>
      }

      <h2 class="font-condensed text-h3 font-extrabold uppercase tracking-[0.06em] text-slate mb-4">
        Payout history
      </h2>
      <app-data-table [columns]="columns" [rows]="payouts()" />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardEarnings {
  private readonly payoutsApi = inject(PayoutsService);

  protected readonly summary = toSignal(
    this.payoutsApi.getSummary().pipe(startWith(null as EarningsSummary | null)),
    { initialValue: null as EarningsSummary | null },
  );

  private readonly history = toSignal(
    this.payoutsApi.getHistory(1, 50).pipe(map((p) => p.items)),
    { initialValue: [] as Payout[] },
  );

  protected readonly payouts = computed(() => this.history());

  protected exportCsv(): void {
    this.payoutsApi.exportCsv().subscribe((csv) => {
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'kitlo-earnings.csv';
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  protected readonly columns: ColumnDef<Payout>[] = [
    { key: 'scheduledFor', header: 'Date', accessor: (r) => r.scheduledFor, variant: 'mono' },
    { key: 'listingTitle', header: 'Listing', accessor: (r) => r.listingTitle, variant: 'name' },
    { key: 'rentalDays', header: 'Days', accessor: (r) => r.rentalDays },
    { key: 'gross', header: 'Gross', accessor: (r) => '$' + (r.grossCents / 100).toFixed(2) },
    { key: 'fee', header: 'Fee', accessor: (r) => '$' + (r.platformFeeCents / 100).toFixed(2) },
    { key: 'net', header: 'Net', accessor: (r) => '$' + (r.netCents / 100).toFixed(2), variant: 'mono' },
    { key: 'status', header: 'Status', accessor: (r) => r.status },
  ];
}
