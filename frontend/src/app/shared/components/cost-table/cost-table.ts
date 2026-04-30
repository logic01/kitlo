import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MoneyPipe } from '../../pipes/money.pipe';

export interface CostLine {
  label: string;
  amountCents: number;
}

@Component({
  selector: 'app-cost-table',
  imports: [MoneyPipe],
  template: `
    <div class="w-full">
      @for (line of lines(); track $index) {
        <div class="flex justify-between items-center py-3 border-b border-line text-sm last:border-b-0">
          <span class="text-muted">{{ line.label }}</span>
          <span class="font-mono font-medium text-slate">{{ line.amountCents | money }}</span>
        </div>
      }
      <div class="flex justify-between items-center pt-4 mt-2 border-t-2 border-slate">
        <span class="font-semibold text-slate">{{ totalLabel() }}</span>
        <span class="font-mono font-medium text-olive text-body-lg">
          {{ totalCents() | money }}
        </span>
      </div>
      @if (depositCents() !== undefined && depositCents() !== null) {
        <div class="bg-surface border border-line px-4 py-3 flex justify-between text-sm mt-3">
          <span class="text-muted italic">Refundable deposit (held)</span>
          <span class="font-mono text-muted">{{ depositCents() | money }}</span>
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CostTable {
  readonly lines = input.required<CostLine[]>();
  readonly totalCents = input.required<number>();
  readonly totalLabel = input<string>('Total');
  readonly depositCents = input<number>();
}
