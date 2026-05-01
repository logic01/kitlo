import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import type { ToastTone } from '../../../core/services/toast.service';

const TONE: Record<ToastTone, { box: string; label: string }> = {
  success: {
    box: 'bg-bone border-[rgba(45,107,58,0.30)]',
    label: 'text-mint',
  },
  info: {
    box: 'bg-bone border-olive-border',
    label: 'text-olive',
  },
  warning: {
    box: 'bg-bone border-[rgba(242,153,74,0.35)]',
    label: 'text-amber-dark',
  },
  error: {
    box: 'bg-bone border-[rgba(139,0,0,0.30)]',
    label: 'text-[#8B0000]',
  },
};

const ROLE_BY_TONE: Record<ToastTone, 'alert' | 'status'> = {
  error: 'alert',
  warning: 'alert',
  success: 'status',
  info: 'status',
};

@Component({
  selector: 'app-toast',
  template: `
    <div
      [class]="boxClass()"
      [attr.role]="role()"
      [attr.aria-live]="role() === 'alert' ? 'assertive' : 'polite'"
    >
      <div class="flex-1 min-w-0">
        @if (label()) {
          <span [class]="labelClass()">{{ label() }}</span>
        }
        <p class="text-sm text-slate leading-relaxed break-words">{{ message() }}</p>
      </div>
      <button
        type="button"
        class="text-muted text-lg leading-none cursor-pointer bg-none border-none p-0 shrink-0 self-start"
        aria-label="Dismiss"
        (click)="dismiss.emit()"
      >×</button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Toast {
  readonly tone = input.required<ToastTone>();
  readonly message = input.required<string>();
  readonly label = input<string>();
  readonly dismiss = output<void>();

  protected readonly boxClass = computed(
    () =>
      `flex items-start gap-4 px-5 py-4 border shadow-sm pointer-events-auto ${TONE[this.tone()].box}`,
  );

  protected readonly labelClass = computed(
    () =>
      `font-mono text-overline tracking-[0.10em] uppercase block mb-1 ${TONE[this.tone()].label}`,
  );

  protected readonly role = computed(() => ROLE_BY_TONE[this.tone()]);
}
