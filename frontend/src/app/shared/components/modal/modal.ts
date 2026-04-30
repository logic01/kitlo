import { ChangeDetectionStrategy, Component, computed, input, model } from '@angular/core';

export type ModalSize = 'sm' | 'md' | 'lg' | 'sheet';

const SIZE: Record<ModalSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-2xl',
  sheet: 'max-w-2xl self-end',
};

@Component({
  selector: 'app-modal',
  template: `
    @if (open()) {
      <div
        class="fixed inset-0 bg-slate/60 flex items-center justify-center z-[200] p-6 outline-none"
        (click)="onOverlayClick()"
        (keydown.escape)="open.set(false)"
        tabindex="-1"
        role="presentation"
      >
        <div
          [class]="dialogClass()"
          role="dialog"
          aria-modal="true"
          [attr.aria-labelledby]="titleId"
          (click)="$event.stopPropagation()"
          (keydown)="$event.stopPropagation()"
        >
          <header class="px-6 py-5 border-b border-line flex items-start justify-between gap-4">
            <h2
              [id]="titleId"
              class="font-condensed text-h3 font-extrabold uppercase tracking-[0.06em] text-slate"
            >{{ title() }}</h2>
            <button
              type="button"
              class="text-muted text-lg cursor-pointer bg-none border-none p-0 shrink-0"
              (click)="open.set(false)"
              aria-label="Close"
            >×</button>
          </header>
          <div class="px-6 py-6">
            <ng-content />
          </div>
          <footer class="px-6 py-5 border-t border-line flex justify-end gap-3">
            <ng-content select="[slot=footer]" />
          </footer>
        </div>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Modal {
  readonly title = input.required<string>();
  readonly size = input<ModalSize>('md');
  readonly open = model<boolean>(false);
  readonly closeOnOverlay = input<boolean>(true);

  protected readonly titleId = `modal-title-${++modalCounter}`;

  protected readonly dialogClass = computed(
    () =>
      `bg-bone border border-line w-full max-h-[90vh] overflow-y-auto ${SIZE[this.size()]}`,
  );

  protected onOverlayClick(): void {
    if (this.closeOnOverlay()) this.open.set(false);
  }
}

let modalCounter = 0;
