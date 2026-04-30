import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

export type AvatarSize = 'sm' | 'md' | 'lg';
export type AvatarTone = 'olive' | 'slate' | 'brown';

const SIZE_CLASSES: Record<AvatarSize, string> = {
  sm: 'w-7 h-7 text-[13px]',
  md: 'w-10 h-10 text-[17px]',
  lg: 'w-12 h-12 text-[22px]',
};

const TONE_CLASSES: Record<AvatarTone, string> = {
  olive: 'bg-olive',
  slate: 'bg-slate',
  brown: 'bg-[#8B5A2B]',
};

@Component({
  selector: 'app-avatar',
  imports: [NgOptimizedImage],
  template: `
    @if (imageUrl(); as url) {
      <img
        [ngSrc]="url"
        [alt]="name()"
        [width]="dimension()"
        [height]="dimension()"
        class="rounded-full object-cover"
        [class]="sizeClass()"
      />
    } @else {
      <span [class]="initialsClass()" [attr.aria-label]="name()">{{ initials() }}</span>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Avatar {
  readonly name = input.required<string>();
  readonly imageUrl = input<string>();
  readonly size = input<AvatarSize>('md');
  readonly tone = input<AvatarTone>('olive');

  protected readonly initials = computed(() =>
    this.name()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase() ?? '')
      .join(''),
  );

  protected readonly sizeClass = computed(() => SIZE_CLASSES[this.size()]);

  protected readonly dimension = computed(() => {
    return { sm: 28, md: 40, lg: 48 }[this.size()];
  });

  protected readonly initialsClass = computed(
    () =>
      `inline-flex items-center justify-center rounded-full font-condensed font-extrabold text-on-dark shrink-0 ${TONE_CLASSES[this.tone()]} ${SIZE_CLASSES[this.size()]}`,
  );
}
