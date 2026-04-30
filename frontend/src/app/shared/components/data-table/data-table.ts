import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

export interface ColumnDef<T = unknown> {
  key: string;
  header: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  accessor: (row: T) => any;
  variant?: 'default' | 'name' | 'mono';
}

@Component({
  selector: 'app-data-table',
  template: `
    <table class="w-full border-collapse text-sm">
      <thead>
        <tr class="border-b-2 border-slate">
          @for (col of columns(); track col.key) {
            <th
              class="font-mono text-overline tracking-[0.12em] uppercase text-muted text-left px-4 py-3 font-normal whitespace-nowrap"
            >
              {{ col.header }}
            </th>
          }
        </tr>
      </thead>
      <tbody>
        @for (row of rows(); track $index) {
          <tr class="hover:bg-surface transition-colors">
            @for (col of columns(); track col.key) {
              <td [class]="cellClass(col.variant)">{{ col.accessor(row) }}</td>
            }
          </tr>
        } @empty {
          <tr>
            <td
              [attr.colspan]="columns().length"
              class="px-4 py-12 text-center text-sm text-muted"
            >
              {{ emptyMessage() }}
            </td>
          </tr>
        }
      </tbody>
    </table>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataTable<T> {
  readonly columns = input.required<ColumnDef<T>[]>();
  readonly rows = input.required<T[]>();
  readonly emptyMessage = input<string>('No results.');
  readonly rowClick = output<T>();

  protected cellClass(variant: ColumnDef['variant']): string {
    const base = 'px-4 py-3 border-b border-line text-ink align-middle';
    if (variant === 'name')
      return `${base} font-condensed text-base font-extrabold uppercase tracking-[0.04em] text-slate`;
    if (variant === 'mono') return `${base} font-mono text-xs text-muted`;
    return base;
  }
}
