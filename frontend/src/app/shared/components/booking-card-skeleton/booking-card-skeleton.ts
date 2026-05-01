import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Mirrors the footprint of `<app-booking-card>` — 80px thumb, two text rows,
 * status badge + total on the right.
 */
@Component({
  selector: 'app-booking-card-skeleton',
  template: `
    <div
      class="grid grid-cols-[80px_1fr_auto] gap-5 px-5 py-4 border border-line bg-bone items-center"
      aria-hidden="true"
    >
      <span class="w-20 h-[60px] bg-surface kitlo-shimmer shrink-0"></span>
      <div class="min-w-0 space-y-2">
        <span class="block h-4 w-2/3 bg-surface kitlo-shimmer"></span>
        <span class="block h-3 w-1/3 bg-surface kitlo-shimmer"></span>
        <span class="block h-3 w-1/2 bg-surface kitlo-shimmer"></span>
      </div>
      <div class="flex flex-col items-end gap-2 shrink-0">
        <span class="block h-5 w-16 bg-surface kitlo-shimmer"></span>
        <span class="block h-3 w-12 bg-surface kitlo-shimmer"></span>
      </div>
    </div>
  `,
  styles: `
    .kitlo-shimmer { animation: kitlo-skeleton 1.4s ease-in-out infinite; }
    @keyframes kitlo-skeleton {
      0%, 100% { opacity: 1; }
      50%      { opacity: 0.55; }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookingCardSkeleton {}
