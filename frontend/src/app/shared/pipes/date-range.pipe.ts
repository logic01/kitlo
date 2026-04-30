import { Pipe, PipeTransform } from '@angular/core';

export interface DateRange {
  start: Date | string;
  end: Date | string;
}

const FMT = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' });

@Pipe({ name: 'dateRange' })
export class DateRangePipe implements PipeTransform {
  transform(range: DateRange | null | undefined, opts?: { showDays?: boolean }): string {
    if (!range) return '';
    const start = new Date(range.start);
    const end = new Date(range.end);
    const days = Math.max(1, Math.round((end.getTime() - start.getTime()) / 86_400_000));
    const range_ = `${FMT.format(start)} – ${FMT.format(end)}`;
    return opts?.showDays === false ? range_ : `${range_} · ${days} day${days === 1 ? '' : 's'}`;
  }
}
