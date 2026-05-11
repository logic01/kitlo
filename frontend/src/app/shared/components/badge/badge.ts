import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type Condition = 'mint' | 'fieldReady' | 'battleScarred';
export type BadgeKind = 'verified' | 'condition' | 'gear-type';

@Component({
  selector: 'app-badge',
  template: `<span [class]="classes()">{{ display() }}</span>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Badge {
  readonly kind = input.required<BadgeKind>();
  readonly condition = input<Condition>();
  readonly label = input<string>();

  protected readonly display = computed(() => {
    const k = this.kind();
    if (k === 'verified') return this.label() ?? 'Verified Hunter';
    if (k === 'condition') {
      return (
        this.label() ??
        ({
          mint: 'Mint',
          fieldReady: 'Field-Ready',
          battleScarred: 'Battle-Scarred',
        }[this.condition() ?? 'mint'])
      );
    }
    return this.label() ?? '';
  });

  protected readonly classes = computed(() => {
    const k = this.kind();
    if (k === 'verified') {
      return 'inline-flex items-center gap-1 font-condensed text-overline font-bold uppercase tracking-[0.10em] text-olive bg-olive-pale border border-olive-border px-1.5 py-0.5';
    }
    if (k === 'gear-type') {
      return 'inline-block font-condensed text-[12px] font-bold uppercase tracking-[0.10em] bg-slate/85 text-on-dark px-2.5 py-1';
    }
    const c = this.condition() ?? 'mint';
    const tone = {
      mint: 'text-mint bg-mint-pale border-mint-border',
      fieldReady: 'text-olive bg-olive-pale border-olive-border',
      battleScarred: 'text-battle bg-amber-pale border-[rgba(212,120,30,0.2)]',
    }[c];
    return `inline-block font-mono text-overline uppercase tracking-[0.08em] px-2 py-0.5 border ${tone}`;
  });
}
