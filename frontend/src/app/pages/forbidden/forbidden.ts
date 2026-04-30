import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Button, EmptyState } from '../../shared';

@Component({
  selector: 'app-forbidden',
  imports: [Button, EmptyState, RouterLink],
  template: `
    <div class="px-10 py-16">
      <app-empty-state
        icon="403"
        title="No access."
        body="Your account doesn't have permission to view this page."
      />
      <div class="flex justify-center">
        <a appButton variant="primary" routerLink="/">Back to home</a>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Forbidden {}
