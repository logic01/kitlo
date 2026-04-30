import { Directive, computed, input } from '@angular/core';

export type ButtonVariant = 'primary' | 'secondary' | 'olive' | 'ghost' | 'outline';
export type ButtonSize = 'sm' | 'md' | 'lg';

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: 'bg-amber text-white hover:bg-amber-dark',
  secondary: 'bg-slate text-on-dark hover:bg-slate-mid',
  olive: 'bg-olive text-on-dark hover:bg-[#3D4420]',
  ghost: 'bg-transparent text-ink hover:text-slate',
  outline: 'bg-transparent text-on-dark border border-line-dark hover:bg-white/5',
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'px-3.5 py-1.5 text-xs',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3.5 text-body',
};

@Directive({
  selector: 'button[appButton], a[appButton]',
  host: {
    '[class]': 'classes()',
  },
})
export class Button {
  readonly variant = input<ButtonVariant>('primary');
  readonly size = input<ButtonSize>('md');
  readonly condensed = input(false, { transform: (v: boolean | string) => v === '' || v === true });

  readonly classes = computed(() => {
    const base =
      'inline-flex items-center justify-center gap-2 font-bold whitespace-nowrap leading-none transition-colors rounded-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber';
    const condensed = this.condensed()
      ? 'font-condensed font-extrabold uppercase tracking-[0.1em]'
      : '';
    return `${base} ${VARIANT_CLASSES[this.variant()]} ${SIZE_CLASSES[this.size()]} ${condensed}`.trim();
  });
}
