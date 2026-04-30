import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type AlertTone = 'info' | 'success' | 'warning' | 'danger';

const TONE: Record<AlertTone, { box: string; label: string }> = {
  info: {
    box: 'bg-[rgba(83,90,45,0.05)] border-olive-border text-slate',
    label: 'text-olive',
  },
  success: {
    box: 'bg-[rgba(45,107,58,0.06)] border-[rgba(45,107,58,0.20)] text-slate',
    label: 'text-mint',
  },
  warning: {
    box: 'bg-[rgba(242,153,74,0.08)] border-[rgba(242,153,74,0.25)] text-slate',
    label: 'text-amber-dark',
  },
  danger: {
    box: 'bg-[rgba(139,0,0,0.06)] border-[rgba(139,0,0,0.20)] text-slate',
    label: 'text-[#8B0000]',
  },
};

@Component({
  selector: 'app-alert',
  template: `
    <div [class]="boxClass()" role="alert">
      <div class="flex-1">
        @if (label()) {
          <span [class]="labelClass()">{{ label() }}</span>
        }
        <p class="text-sm leading-relaxed">
          <ng-content />
        </p>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Alert {
  readonly tone = input<AlertTone>('info');
  readonly label = input<string>();

  protected readonly boxClass = computed(
    () => `flex items-start gap-4 px-5 py-4 border text-sm leading-relaxed ${TONE[this.tone()].box}`,
  );

  protected readonly labelClass = computed(
    () =>
      `font-mono text-overline tracking-[0.10em] uppercase block mb-1 ${TONE[this.tone()].label}`,
  );
}
