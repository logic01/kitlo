import { ChangeDetectionStrategy, Component, input, model, output } from '@angular/core';
import { Modal } from '../modal/modal';
import { Button } from '../button/button';

export type ConfirmTone = 'primary' | 'danger';

@Component({
  selector: 'app-confirm-dialog',
  imports: [Modal, Button],
  template: `
    <app-modal [title]="title()" [(open)]="open" size="sm">
      <p class="text-sm text-ink leading-relaxed">{{ body() }}</p>
      <ng-container slot="footer">
        <button appButton variant="ghost" type="button" (click)="cancel()">
          {{ cancelLabel() }}
        </button>
        <button
          appButton
          [variant]="confirmTone() === 'danger' ? 'secondary' : 'primary'"
          type="button"
          (click)="confirmAction()"
        >
          {{ confirmLabel() }}
        </button>
      </ng-container>
    </app-modal>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmDialog {
  readonly title = input.required<string>();
  readonly body = input.required<string>();
  readonly confirmLabel = input<string>('Confirm');
  readonly cancelLabel = input<string>('Cancel');
  readonly confirmTone = input<ConfirmTone>('primary');
  readonly open = model<boolean>(false);
  readonly confirmed = output<void>();
  readonly cancelled = output<void>();

  protected confirmAction(): void {
    this.confirmed.emit();
    this.open.set(false);
  }

  protected cancel(): void {
    this.cancelled.emit();
    this.open.set(false);
  }
}
