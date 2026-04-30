import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import type { BookingTimelineEvent } from '../../../core/models/booking';

const TS_FMT = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
});

@Component({
  selector: 'app-timeline',
  template: `
    <ol class="flex flex-col py-4">
      @for (event of computedEvents(); track event.id; let last = $last) {
        <li class="flex gap-4 pb-5 relative">
          @if (!last) {
            <span
              class="absolute left-[7px] top-5 bottom-0 w-px bg-line"
              aria-hidden="true"
            ></span>
          }
          <span [class]="dotClass(event.state)" aria-hidden="true"></span>
          <div>
            <p class="text-sm font-medium text-slate leading-tight">{{ event.label }}</p>
            <p class="font-mono text-[11px] text-muted mt-0.5 tracking-[0.04em]">
              {{ event.formattedTs }}
            </p>
            @if (event.detail) {
              <p class="text-xs text-muted mt-1 leading-relaxed">{{ event.detail }}</p>
            }
          </div>
        </li>
      }
    </ol>
  `,
  styles: `
    .dot { width: 16px; height: 16px; border-radius: 50%; flex-shrink: 0; margin-top: 3px; position: relative; z-index: 1; }
    .dot-base { background: var(--color-bone); border: 2px solid var(--color-line); }
    .dot-done { background: var(--color-olive); border-color: var(--color-olive); }
    .dot-now { background: var(--color-amber); border: 2px solid var(--color-amber); box-shadow: 0 0 0 3px rgba(242,153,74,0.20); }
    .dot-alert { background: var(--color-battle); border-color: var(--color-battle); }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Timeline {
  readonly events = input.required<BookingTimelineEvent[]>();

  protected readonly computedEvents = computed(() =>
    this.events().map((e) => ({
      ...e,
      formattedTs: TS_FMT.format(new Date(e.occurredAt)),
    })),
  );

  protected dotClass(state: BookingTimelineEvent['state']): string {
    return `dot dot-${state}`;
  }
}
