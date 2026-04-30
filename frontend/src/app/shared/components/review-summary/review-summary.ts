import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-review-summary',
  template: `
    <div
      class="flex items-center gap-5 py-5 border-b-2 border-slate mb-6"
    >
      <span
        class="font-mono text-display font-medium text-slate leading-none"
      >{{ averageRating().toFixed(1) }}</span>
      <div>
        <p class="font-mono text-xs text-muted uppercase tracking-[0.06em]">
          {{ count() }} review{{ count() === 1 ? '' : 's' }}
        </p>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewSummary {
  readonly averageRating = input.required<number>();
  readonly count = input.required<number>();
}
