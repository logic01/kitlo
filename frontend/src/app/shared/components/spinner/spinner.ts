import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type SpinnerSize = 'sm' | 'md' | 'lg';

const SIZE_CLASSES: Record<SpinnerSize, string> = {
  sm: 'w-4 h-4 border-2',
  md: 'w-6 h-6 border-2',
  lg: 'w-10 h-10 border-[3px]',
};

@Component({
  selector: 'app-spinner',
  template: `<span role="status" [attr.aria-label]="label()" [class]="classes()"></span>`,
  styles: `
    :host { display: inline-flex; }
    span {
      border-style: solid;
      border-radius: 9999px;
      border-color: var(--color-line);
      border-top-color: var(--color-slate);
      animation: kitlo-spin 0.8s linear infinite;
    }
    @keyframes kitlo-spin { to { transform: rotate(360deg); } }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Spinner {
  readonly size = input<SpinnerSize>('md');
  readonly label = input('Loading');
  protected readonly classes = computed(() => SIZE_CLASSES[this.size()]);
}
