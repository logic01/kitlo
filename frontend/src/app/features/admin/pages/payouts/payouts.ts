import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { DataTable, PageHeader, StatCard, type ColumnDef } from '../../../../shared';
import { PayoutsService } from '../../../../core/services/payouts.service';
import type { Payout } from '../../../../core/models/payout';

@Component({
  selector: 'app-admin-payouts',
  imports: [DataTable, PageHeader, StatCard],
  template: `
    <div class="px-8 py-8">
      <app-page-header title="Payouts" subtitle="Pending and completed payouts across all listers." />

      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6 mb-8">
        <app-stat-card overline="Pending payouts" [value]="pendingCount().toString()" sublabel="Awaiting payout" tone="pending" />
        <app-stat-card overline="In transit" [value]="formatMoney(inTransitCents())" sublabel="Stripe processing" />
        <app-stat-card overline="Paid this month" [value]="formatMoney(paidCents())" [sublabel]="paidCount() + ' payouts'" tone="primary" />
        <app-stat-card overline="Failed" value="0" sublabel="No retries needed" />
      </div>

      <app-data-table [columns]="columns" [rows]="payouts()" />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminPayouts {
  private readonly payoutsApi = inject(PayoutsService);

  protected readonly payouts = toSignal(
    this.payoutsApi.getHistory(1, 100).pipe(map((p) => p.items)),
    { initialValue: [] as Payout[] },
  );

  protected readonly pendingCount = computed(
    () => this.payouts().filter((p) => p.status === 'scheduled').length,
  );

  protected readonly inTransitCents = computed(() =>
    this.payouts().filter((p) => p.status === 'in-transit').reduce((s, p) => s + p.netCents, 0),
  );

  protected readonly paidCents = computed(() =>
    this.payouts().filter((p) => p.status === 'paid').reduce((s, p) => s + p.netCents, 0),
  );

  protected readonly paidCount = computed(
    () => this.payouts().filter((p) => p.status === 'paid').length,
  );

  protected formatMoney(cents: number): string {
    return '$' + (cents / 100).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  }

  protected readonly columns: ColumnDef<Payout>[] = [
    { key: 'scheduledFor', header: 'Scheduled', accessor: (r) => r.scheduledFor, variant: 'mono' },
    { key: 'listingTitle', header: 'Listing', accessor: (r) => r.listingTitle, variant: 'name' },
    { key: 'rentalDays', header: 'Days', accessor: (r) => r.rentalDays },
    { key: 'gross', header: 'Gross', accessor: (r) => '$' + (r.grossCents / 100).toFixed(2) },
    { key: 'fee', header: 'Platform fee', accessor: (r) => '$' + (r.platformFeeCents / 100).toFixed(2) },
    { key: 'net', header: 'Net to lister', accessor: (r) => '$' + (r.netCents / 100).toFixed(2), variant: 'mono' },
    { key: 'status', header: 'Status', accessor: (r) => r.status },
  ];
}
