import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Mirrors the footprint of `<app-profile-card>` (avatar + 3 text rows on the
 * right). Used as a stand-in for the profile header / card during load.
 */
@Component({
  selector: 'app-profile-card-skeleton',
  template: `
    <div class="border border-line bg-bone p-5 flex gap-4 items-start" aria-hidden="true">
      <span class="w-10 h-10 rounded-full bg-surface kitlo-shimmer shrink-0"></span>
      <div class="flex-1 min-w-0 space-y-2">
        <span class="block h-4 w-1/2 bg-surface kitlo-shimmer"></span>
        <span class="block h-3 w-1/3 bg-surface kitlo-shimmer"></span>
        <span class="block h-3 w-2/3 bg-surface kitlo-shimmer"></span>
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
export class ProfileCardSkeleton {}
