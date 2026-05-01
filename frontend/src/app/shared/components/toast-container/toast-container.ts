import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ToastService } from '../../../core/services/toast.service';
import { Toast } from '../toast/toast';

@Component({
  selector: 'app-toast-container',
  imports: [Toast],
  template: `
    <div
      class="fixed top-4 right-4 z-[300] flex flex-col gap-3 w-[min(380px,calc(100vw-2rem))] pointer-events-none"
      role="region"
      aria-label="Notifications"
    >
      @for (toast of toasts(); track toast.id) {
        <app-toast
          [tone]="toast.tone"
          [message]="toast.message"
          [label]="toast.label"
          (dismiss)="onDismiss(toast.id)"
        />
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastContainer {
  private readonly toastService = inject(ToastService);
  protected readonly toasts = this.toastService.toasts;

  protected onDismiss(id: string): void {
    this.toastService.dismiss(id);
  }
}
