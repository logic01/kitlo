import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { Button, EmptyState } from '../../shared';

/**
 * Placeholder rendered for any route whose page hasn't been built yet.
 * Pages land in 3.12–3.16 and replace these.
 */
@Component({
  selector: 'app-placeholder-page',
  imports: [Button, EmptyState, RouterLink],
  template: `
    <div class="px-10 py-16">
      <app-empty-state
        icon="∎"
        [title]="title()"
        [body]="body()"
      />
      <div class="flex justify-center">
        <a appButton variant="ghost" routerLink="/">Back to home</a>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaceholderPage {
  private readonly route = inject(ActivatedRoute);
  private readonly data = toSignal(this.route.data, { initialValue: {} as Record<string, unknown> });

  protected readonly title = computed(() => (this.data()['title'] as string) ?? 'Page placeholder');
  protected readonly body = computed(() => {
    const task = this.data()['task'] as string | undefined;
    const task_ = task ? `Built in task ${task}.` : 'Built in a later task.';
    return `${task_} Routes and guards work; the real shell lands when pages 3.12–3.16 ship.`;
  });
}
