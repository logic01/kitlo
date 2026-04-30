import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { Button } from '../button/button';
import { Input } from '../input/input';
import { FormField } from '../form-field/form-field';
import { MoneyPipe } from '../../pipes/money.pipe';

@Component({
  selector: 'app-stripe-payment-form',
  imports: [Button, Input, FormField, MoneyPipe],
  template: `
    <form
      class="border border-line bg-bone p-6 space-y-4"
      (submit)="onSubmit($event)"
    >
      <p
        class="font-mono text-overline tracking-[0.10em] uppercase text-amber-dark mb-2"
      >
        Stripe Elements stub · payment integration deferred to Phase 5
      </p>

      <app-form-field label="Card number">
        <input appInput placeholder="4242 4242 4242 4242" inputmode="numeric" />
      </app-form-field>
      <div class="grid grid-cols-2 gap-4">
        <app-form-field label="Expires"><input appInput placeholder="MM / YY" /></app-form-field>
        <app-form-field label="CVC"><input appInput placeholder="123" /></app-form-field>
      </div>
      <app-form-field label="ZIP"><input appInput placeholder="80012" /></app-form-field>

      <div class="flex justify-between items-center pt-4 border-t border-line">
        <span class="text-sm text-muted">Total due now</span>
        <span class="font-mono text-h3 text-olive font-medium">{{ amountCents() | money }}</span>
      </div>

      <button
        appButton
        variant="primary"
        size="lg"
        type="submit"
        class="w-full"
        [disabled]="submitting()"
      >
        @if (submitting()) { Processing… } @else { Pay & confirm booking }
      </button>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StripePaymentForm {
  readonly amountCents = input.required<number>();
  readonly submitted = output<{ paid: true }>();

  protected readonly submitting = signal(false);

  protected onSubmit(event: Event): void {
    event.preventDefault();
    this.submitting.set(true);
    setTimeout(() => {
      this.submitting.set(false);
      this.submitted.emit({ paid: true });
    }, 800);
  }
}
