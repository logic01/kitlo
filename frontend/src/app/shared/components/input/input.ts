import { Directive, computed, input } from '@angular/core';

@Directive({
  selector: 'input[appInput], textarea[appInput], select[appInput]',
  host: {
    '[class]': 'classes()',
    '[attr.aria-invalid]': 'invalid() ? "true" : null',
  },
})
export class Input {
  readonly invalid = input(false, { transform: (v: boolean | string) => v === '' || v === true });

  readonly classes = computed(() => {
    const base =
      'block w-full bg-bone border text-ink font-medium text-sm leading-snug px-3.5 py-2.5 rounded-md outline-none transition-colors placeholder:text-muted/70';
    const border = this.invalid()
      ? 'border-battle focus:border-battle'
      : 'border-line focus:border-slate';
    return `${base} ${border}`;
  });
}
