import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Mirrors the footprint of `<app-listing-card>` so the grid doesn't reflow
 * when real listings arrive. Outer dimensions (border, image height, body
 * padding) match `listing-card.ts`.
 */
@Component({
  selector: 'app-listing-card-skeleton',
  template: `
    <div class="block border border-line bg-bone" aria-hidden="true">
      <div class="h-40 bg-surface kitlo-shimmer"></div>
      <div class="px-5 py-4">
        <div class="flex justify-between items-start mb-2 gap-2">
          <span class="block h-4 w-2/3 bg-surface kitlo-shimmer"></span>
          <span class="block h-4 w-12 bg-surface kitlo-shimmer"></span>
        </div>
        <span class="block h-3 w-1/3 bg-surface kitlo-shimmer mb-4"></span>
        <div class="flex items-center gap-2 pt-4 border-t border-line">
          <span class="block h-3 w-24 bg-surface kitlo-shimmer"></span>
          <span class="block h-3 w-12 bg-surface kitlo-shimmer ml-auto"></span>
        </div>
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
export class ListingCardSkeleton {}
