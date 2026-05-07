import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { combineLatest } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import {
  Button,
  DataTable,
  Input,
  PageHeader,
  type ColumnDef,
} from '../../../../shared';
import {
  WaitlistService,
  type WaitlistEntry,
} from '../../../../core/services';

@Component({
  selector: 'app-admin-waitlist',
  imports: [FormsModule, Button, DataTable, Input, PageHeader],
  template: `
    <div class="px-8 py-8">
      <app-page-header
        title="Waitlist"
        subtitle="Early-access signups from /early-access. Sorted newest first."
      />

      <div class="my-6 flex flex-wrap items-center gap-4">
        <input
          appInput
          class="max-w-xs"
          [ngModel]="search()"
          (ngModelChange)="search.set($event)"
          placeholder="Search name or email…"
        />
        <input
          appInput
          class="max-w-[8rem]"
          inputmode="numeric"
          maxlength="5"
          [ngModel]="zip()"
          (ngModelChange)="zip.set($event)"
          placeholder="ZIP"
        />
        <label class="flex items-center gap-2 text-sm text-slate cursor-pointer">
          <input
            type="checkbox"
            class="h-4 w-4 accent-olive"
            [checked]="listersOnly()"
            (change)="toggleListersOnly($event)"
          />
          <span>Lender intent only</span>
        </label>

        <div class="ml-auto flex items-center gap-3">
          <span class="text-xs text-muted font-mono">
            Total: <span class="text-ink font-medium">{{ total() }}</span>
          </span>
          <button
            appButton
            variant="secondary"
            size="sm"
            condensed
            type="button"
            [disabled]="exporting()"
            (click)="exportCsv()"
          >
            @if (exporting()) {
              Exporting…
            } @else {
              Export CSV
            }
          </button>
        </div>
      </div>

      <app-data-table
        [columns]="columns"
        [rows]="rows()"
        emptyMessage="No waitlist signups yet."
      />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminWaitlist {
  private readonly waitlist = inject(WaitlistService);

  protected readonly search = signal('');
  protected readonly zip = signal('');
  protected readonly listersOnly = signal(false);
  protected readonly exporting = signal(false);

  private readonly page$ = combineLatest([
    toObservable(this.search),
    toObservable(this.zip),
    toObservable(this.listersOnly),
  ]).pipe(
    debounceTime(200),
    distinctUntilChanged(
      (a, b) => a[0] === b[0] && a[1] === b[1] && a[2] === b[2],
    ),
    switchMap(([q, z, lister]) =>
      this.waitlist.list({
        q: q || undefined,
        zip: z || undefined,
        listersOnly: lister || undefined,
        pageSize: 100,
      }),
    ),
  );

  private readonly page = toSignal(this.page$, {
    initialValue: { items: [] as WaitlistEntry[], total: 0, page: 1, pageSize: 100 },
  });

  protected readonly rows = computed(() => this.page().items);
  protected readonly total = computed(() => this.page().total);

  protected readonly columns: ColumnDef<WaitlistEntry>[] = [
    {
      key: 'createdAt',
      header: 'Joined',
      accessor: (r) => new Date(r.createdAt).toLocaleString(),
      variant: 'mono',
    },
    { key: 'name', header: 'Name', accessor: (r) => r.name, variant: 'name' },
    { key: 'email', header: 'Email', accessor: (r) => r.email, variant: 'mono' },
    { key: 'zip', header: 'ZIP', accessor: (r) => r.zip, variant: 'mono' },
    {
      key: 'lister',
      header: 'Lender intent',
      accessor: (r) => (r.interestedAsLister ? 'Yes' : '—'),
    },
    {
      key: 'firstRental',
      header: 'Wants first',
      accessor: (r) => r.firstRental ?? '—',
    },
    {
      key: 'converted',
      header: 'Status',
      accessor: (r) => (r.convertedUserId ? 'Signed up' : 'Waiting'),
    },
  ];

  protected toggleListersOnly(event: Event): void {
    this.listersOnly.set((event.target as HTMLInputElement).checked);
  }

  protected exportCsv(): void {
    if (this.exporting()) return;
    this.exporting.set(true);
    this.waitlist.exportCsv().subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `waitlist-${new Date().toISOString().slice(0, 10)}.csv`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        this.exporting.set(false);
      },
      error: () => this.exporting.set(false),
    });
  }
}
