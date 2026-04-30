import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export interface SpecRow {
  key: string;
  value: string;
}

@Component({
  selector: 'app-spec-table',
  template: `
    <dl class="w-full">
      @for (row of rows(); track row.key) {
        <div class="grid grid-cols-2 border-b border-line last:border-b-0">
          <dt class="font-mono text-overline tracking-[0.10em] uppercase text-muted py-3">
            {{ row.key }}
          </dt>
          <dd class="font-mono text-sm font-medium text-slate py-3">{{ row.value }}</dd>
        </div>
      }
    </dl>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpecTable {
  readonly rows = input.required<SpecRow[]>();
}
