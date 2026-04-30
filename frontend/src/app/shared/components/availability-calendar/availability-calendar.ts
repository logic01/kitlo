import { ChangeDetectionStrategy, Component, computed, input, model } from '@angular/core';
import type { DateRangeValue } from '../date-range-input/date-range-input';

export type CalendarMode = 'view' | 'select-range';

interface Cell {
  date: Date;
  inMonth: boolean;
  isToday: boolean;
  state: 'free' | 'booked' | 'blocked' | 'pending' | 'selected' | 'in-range';
}

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const MONTH_FMT = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' });
const MS_PER_DAY = 86_400_000;

function startOfDay(d: Date): Date {
  const c = new Date(d);
  c.setHours(0, 0, 0, 0);
  return c;
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

@Component({
  selector: 'app-availability-calendar',
  template: `
    <div class="border border-line bg-bone">
      <header class="flex items-center justify-between px-5 py-4 border-b border-line">
        <h3 class="font-condensed text-h4 font-extrabold uppercase tracking-[0.06em] text-slate">
          {{ monthLabel() }}
        </h3>
        <div class="flex gap-2">
          <button type="button" class="cal-nav" (click)="step(-1)" aria-label="Previous month">‹</button>
          <button type="button" class="cal-nav" (click)="step(1)" aria-label="Next month">›</button>
        </div>
      </header>

      <div class="grid grid-cols-7 gap-px bg-line border-b border-line">
        @for (d of weekdays; track $index) {
          <div class="font-mono text-[9px] tracking-[0.10em] uppercase text-muted text-center py-2 bg-surface">
            {{ d }}
          </div>
        }
      </div>

      <div class="grid grid-cols-7 gap-px bg-line">
        @for (cell of cells(); track cell.date.getTime()) {
          <button
            type="button"
            [class]="cellClass(cell)"
            [disabled]="!cell.inMonth || cell.state === 'booked' || cell.state === 'blocked'"
            (click)="onCellClick(cell)"
          >{{ cell.date.getDate() }}</button>
        }
      </div>

      <footer class="flex gap-5 px-5 py-3 border-t border-line">
        <span class="cal-legend"><span class="cal-dot" style="background: var(--color-olive)"></span> Today</span>
        <span class="cal-legend"><span class="cal-dot" style="background: rgba(45,107,58,0.5)"></span> Booked</span>
        <span class="cal-legend"><span class="cal-dot" style="background: var(--color-amber)"></span> Pending</span>
      </footer>
    </div>
  `,
  styles: `
    .cal-nav {
      background: none; border: 1px solid var(--color-line);
      padding: 4px 10px; cursor: pointer;
      font-family: var(--font-condensed); font-weight: 800;
      font-size: var(--text-xs); letter-spacing: 0.06em;
      text-transform: uppercase; color: var(--color-muted);
      transition: all 120ms ease;
    }
    .cal-nav:hover { border-color: var(--color-slate); color: var(--color-slate); }
    .cal-legend {
      display: flex; align-items: center; gap: 8px;
      font-family: var(--font-mono); font-size: 10px;
      color: var(--color-muted); text-transform: uppercase;
      letter-spacing: 0.06em;
    }
    .cal-dot { width: 10px; height: 10px; border-radius: 1px; flex-shrink: 0; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvailabilityCalendar {
  readonly mode = input<CalendarMode>('view');
  readonly blockedDates = input<Date[]>([]);
  readonly bookedDates = input<Date[]>([]);
  readonly pendingDates = input<Date[]>([]);
  readonly viewMonth = model<Date>(new Date());
  readonly range = model<DateRangeValue>({ start: null, end: null });

  protected readonly weekdays = WEEKDAYS;
  protected readonly monthLabel = computed(() => MONTH_FMT.format(this.viewMonth()));

  protected readonly cells = computed<Cell[]>(() => {
    const view = this.viewMonth();
    const year = view.getFullYear();
    const month = view.getMonth();
    const firstOfMonth = new Date(year, month, 1);
    const startOffset = firstOfMonth.getDay();
    const startDate = new Date(year, month, 1 - startOffset);
    const today = startOfDay(new Date());
    const blocked = this.blockedDates().map(startOfDay);
    const booked = this.bookedDates().map(startOfDay);
    const pending = this.pendingDates().map(startOfDay);
    const r = this.range();
    const start = r.start ? startOfDay(r.start) : null;
    const end = r.end ? startOfDay(r.end) : null;

    return Array.from({ length: 42 }, (_, i) => {
      const date = new Date(startDate.getTime() + i * MS_PER_DAY);
      const day = startOfDay(date);
      const inMonth = day.getMonth() === month;
      const isToday = isSameDay(day, today);
      let state: Cell['state'] = 'free';
      if (booked.some((d) => isSameDay(d, day))) state = 'booked';
      else if (blocked.some((d) => isSameDay(d, day))) state = 'blocked';
      else if (pending.some((d) => isSameDay(d, day))) state = 'pending';
      else if (start && end && day >= start && day <= end) {
        state = isSameDay(day, start) || isSameDay(day, end) ? 'selected' : 'in-range';
      } else if (start && isSameDay(day, start)) {
        state = 'selected';
      }
      return { date, inMonth, isToday, state };
    });
  });

  protected step(delta: number): void {
    const v = this.viewMonth();
    this.viewMonth.set(new Date(v.getFullYear(), v.getMonth() + delta, 1));
  }

  protected onCellClick(cell: Cell): void {
    if (this.mode() !== 'select-range') return;
    if (cell.state === 'booked' || cell.state === 'blocked') return;
    const r = this.range();
    if (!r.start || (r.start && r.end)) {
      this.range.set({ start: cell.date, end: null });
      return;
    }
    if (cell.date < r.start) {
      this.range.set({ start: cell.date, end: r.start });
      return;
    }
    this.range.set({ start: r.start, end: cell.date });
  }

  protected cellClass(cell: Cell): string {
    const base =
      'aspect-square flex items-center justify-center text-xs font-medium bg-bone cursor-pointer transition-colors relative';
    if (!cell.inMonth) return `${base} text-faint bg-surface pointer-events-none`;
    if (cell.state === 'booked') return `${base} bg-mint-pale text-mint cursor-default`;
    if (cell.state === 'blocked') return `${base} bg-surface text-faint line-through cursor-default`;
    if (cell.state === 'pending') return `${base} bg-[rgba(242,153,74,0.08)] text-amber-dark`;
    if (cell.state === 'selected') return `${base} bg-slate text-on-dark font-extrabold`;
    if (cell.state === 'in-range') return `${base} bg-[rgba(47,53,59,0.06)]`;
    if (cell.isToday) return `${base} text-ink font-extrabold hover:bg-surface`;
    return `${base} text-ink hover:bg-surface`;
  }
}
