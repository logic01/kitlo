import { ChangeDetectionStrategy, Component, computed, input, model } from '@angular/core';

export interface DateRangeValue {
  start: Date | null;
  end: Date | null;
}

const FMT = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' });

@Component({
  selector: 'app-date-range-input',
  template: `
    <div
      class="grid grid-cols-2 gap-px border-2 border-slate"
    >
      <button type="button" class="px-4 py-3 bg-bone hover:bg-surface text-left cursor-pointer" (click)="picking.set('start')">
        <span class="font-mono text-overline tracking-[0.10em] uppercase text-muted block mb-0.5">Start</span>
        <span class="text-sm font-medium text-slate block">{{ startLabel() }}</span>
      </button>
      <button type="button" class="px-4 py-3 bg-bone hover:bg-surface text-left cursor-pointer" (click)="picking.set('end')">
        <span class="font-mono text-overline tracking-[0.10em] uppercase text-muted block mb-0.5">End</span>
        <span class="text-sm font-medium text-slate block">{{ endLabel() }}</span>
      </button>
    </div>
    @if (picking() !== null) {
      <p class="text-xs text-muted mt-2 font-mono">
        {{ picking() === 'start' ? 'Pick start date in calendar →' : 'Pick end date in calendar →' }}
      </p>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DateRangeInput {
  readonly min = input<Date>();
  readonly max = input<Date>();
  readonly range = model<DateRangeValue>({ start: null, end: null });
  readonly picking = model<'start' | 'end' | null>('start');

  protected readonly startLabel = computed(() => {
    const s = this.range().start;
    return s ? FMT.format(s) : 'Add date';
  });

  protected readonly endLabel = computed(() => {
    const e = this.range().end;
    return e ? FMT.format(e) : 'Add date';
  });
}
