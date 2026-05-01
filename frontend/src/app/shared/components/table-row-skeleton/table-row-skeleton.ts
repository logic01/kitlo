import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/**
 * Renders one or more skeleton rows for `<app-data-table>`. Matches the
 * cell padding of `data-table.ts` so the swap-in is layout-stable.
 *
 * Usage:
 *   <tbody>
 *     @if (loading()) {
 *       <app-table-row-skeleton [columns]="cols.length" [rows]="5" />
 *     } @else {
 *       ...
 *     }
 *   </tbody>
 */
@Component({
  selector: 'app-table-row-skeleton, [appTableRowSkeleton]',
  template: `
    @for (_ of rowsArray(); track $index) {
      <tr aria-hidden="true">
        @for (__ of colsArray(); track $index) {
          <td class="px-4 py-3 border-b border-line">
            <span class="block h-3 w-full max-w-[160px] bg-surface kitlo-shimmer"></span>
          </td>
        }
      </tr>
    }
  `,
  styles: `
    :host { display: contents; }
    .kitlo-shimmer { animation: kitlo-skeleton 1.4s ease-in-out infinite; }
    @keyframes kitlo-skeleton {
      0%, 100% { opacity: 1; }
      50%      { opacity: 0.55; }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableRowSkeleton {
  readonly columns = input.required<number>();
  readonly rows = input(3);

  protected readonly rowsArray = computed(() => Array(this.rows()).fill(0));
  protected readonly colsArray = computed(() => Array(this.columns()).fill(0));
}
