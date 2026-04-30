import { ChangeDetectionStrategy, Component, computed, model } from '@angular/core';

@Component({
  selector: 'app-star-input',
  template: `
    <div class="flex gap-2" role="radiogroup" aria-label="Star rating">
      @for (star of stars(); track star.value) {
        <button
          type="button"
          role="radio"
          [attr.aria-checked]="star.filled"
          [attr.aria-label]="star.value + ' star' + (star.value === 1 ? '' : 's')"
          [class]="btnClass(star.filled)"
          (click)="value.set(star.value)"
        >★</button>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StarInput {
  readonly value = model<1 | 2 | 3 | 4 | 5>(5);

  protected readonly stars = computed(() => {
    const v = this.value();
    return [1, 2, 3, 4, 5].map((i) => ({ value: i as 1 | 2 | 3 | 4 | 5, filled: i <= v }));
  });

  protected btnClass(filled: boolean): string {
    const base =
      'w-8 h-8 inline-flex items-center justify-center text-lg cursor-pointer transition-colors border';
    return filled
      ? `${base} bg-amber border-amber text-white`
      : `${base} bg-surface border-line text-muted hover:bg-amber hover:border-amber hover:text-white`;
  }
}
