import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs/operators';
import { DataTable, Input, PageHeader, type ColumnDef } from '../../../../shared';
import { AdminService, type UserAdminRecord } from '../../../../core/services/admin.service';

@Component({
  selector: 'app-admin-users',
  imports: [FormsModule, DataTable, Input, PageHeader],
  template: `
    <div class="px-8 py-8">
      <app-page-header title="Users" subtitle="Search and manage user accounts." />

      <div class="my-6">
        <input
          appInput
          class="max-w-md"
          [ngModel]="search()"
          (ngModelChange)="search.set($event)"
          placeholder="Search by name or email…"
        />
      </div>

      <app-data-table [columns]="columns" [rows]="rows()" />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminUsers {
  private readonly admin = inject(AdminService);

  protected search = signal('');

  protected readonly rows = toSignal(
    toObservable(this.search).pipe(
      switchMap((term) => this.admin.searchUsers({ search: term })),
    ),
    { initialValue: [] as UserAdminRecord[] },
  );

  protected readonly columns: ColumnDef<UserAdminRecord>[] = [
    { key: 'name', header: 'Name', accessor: (r) => r.user.name, variant: 'name' },
    { key: 'email', header: 'Email', accessor: (r) => r.user.email, variant: 'mono' },
    { key: 'role', header: 'Role', accessor: (r) => r.user.role },
    { key: 'verified', header: 'Verified', accessor: (r) => (r.user.verified ? 'Yes' : 'No') },
    { key: 'status', header: 'Status', accessor: (r) => r.status },
    { key: 'location', header: 'Location', accessor: (r) => `${r.user.city ?? '—'}, ${r.user.state ?? ''}` },
    { key: 'joined', header: 'Joined', accessor: (r) => r.user.joinedAt, variant: 'mono' },
  ];
}
