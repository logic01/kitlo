import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Button, EmptyState } from '../../shared';

@Component({
  selector: 'app-server-error',
  imports: [Button, EmptyState, RouterLink],
  template: `
    <div class="px-10 py-16">
      <app-empty-state
        icon="500"
        title="Something broke on our end."
        body="The page failed to load. Try again, or come back in a minute."
      />
      <div class="flex justify-center">
        <a appButton variant="primary" routerLink="/">Back to home</a>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServerError {}
