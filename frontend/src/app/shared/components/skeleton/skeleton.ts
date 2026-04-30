import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type SkeletonVariant = 'card' | 'line' | 'avatar' | 'image';

const VARIANT_CLASSES: Record<SkeletonVariant, string> = {
  card: 'h-44 w-full',
  line: 'h-3 w-full',
  avatar: 'h-10 w-10 rounded-full',
  image: 'h-40 w-full',
};

@Component({
  selector: 'app-skeleton',
  template: `
    @for (_ of times(); track $index) {
      <span [class]="classes()" aria-hidden="true"></span>
    }
  `,
  styles: `
    :host { display: flex; flex-direction: column; gap: 8px; }
    span {
      display: block;
      background: var(--color-surface);
      animation: kitlo-skeleton 1.4s ease-in-out infinite;
    }
    @keyframes kitlo-skeleton {
      0%, 100% { opacity: 1; }
      50%      { opacity: 0.55; }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Skeleton {
  readonly variant = input<SkeletonVariant>('line');
  readonly count = input(1);

  protected readonly classes = computed(() => VARIANT_CLASSES[this.variant()]);
  protected readonly times = computed(() => Array(this.count()).fill(0));
}
