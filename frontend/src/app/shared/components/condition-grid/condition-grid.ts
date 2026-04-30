import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ConditionCard } from '../condition-card/condition-card';

@Component({
  selector: 'app-condition-grid',
  imports: [ConditionCard],
  template: `
    <div class="grid grid-cols-3 gap-px bg-line border border-line">
      <app-condition-card
        condition="mint"
        description="Like new. Minimal use, no visible wear. Functions as if pulled fresh from the box."
      />
      <app-condition-card
        condition="field-ready"
        description="Solid working order with honest wear from time afield. Will perform to spec."
      />
      <app-condition-card
        condition="battle-scarred"
        description="Functional but well-loved. Cosmetic damage and visible wear, no functional issues."
      />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConditionGrid {}
