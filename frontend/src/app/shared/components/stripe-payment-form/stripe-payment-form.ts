import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  computed,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { loadStripe, type Stripe, type StripeElements, type StripeCardElement } from '@stripe/stripe-js';
import { environment } from '../../../../environments/environment';
import { Button } from '../button/button';
import { MoneyPipe } from '../../pipes/money.pipe';

@Component({
  selector: 'app-stripe-payment-form',
  imports: [Button, MoneyPipe],
  template: `
    <form
      class="border border-line bg-bone p-6 space-y-4"
      (submit)="onSubmit($event)"
    >
      @if (!hasKey()) {
        <p class="font-mono text-overline tracking-[0.10em] uppercase text-amber-dark mb-2">
          Stripe publishable key missing — set <code>environment.stripePublicKey</code> to enable real payments.
        </p>
      }

      <div role="group" aria-label="Card details" class="block">
        <span class="font-mono text-overline tracking-[0.12em] uppercase text-muted block mb-2">
          Card details
        </span>
        <div
          #cardEl
          class="block w-full bg-bone border border-line rounded-md px-3.5 py-3 min-h-[44px]"
        ></div>
      </div>

      @if (errorMessage(); as msg) {
        <p class="font-mono text-xs text-battle" role="alert">{{ msg }}</p>
      }

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
        [disabled]="submitting() || !hasKey() || !ready()"
      >
        @if (submitting()) { Processing… } @else { Pay & confirm booking }
      </button>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StripePaymentForm implements AfterViewInit, OnDestroy {
  readonly amountCents = input.required<number>();
  /** PaymentIntent client_secret returned by `POST /api/payments/intent`. */
  readonly clientSecret = input<string | null>(null);
  readonly submitted = output<{ paymentIntentId: string }>();

  private readonly cardEl = viewChild.required<ElementRef<HTMLElement>>('cardEl');

  protected readonly submitting = signal(false);
  protected readonly ready = signal(false);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly hasKey = computed(() => !!environment.stripePublicKey);

  private stripe?: Stripe | null;
  private elements?: StripeElements;
  private card?: StripeCardElement;

  async ngAfterViewInit(): Promise<void> {
    if (!environment.stripePublicKey) {
      this.errorMessage.set('Stripe key not configured.');
      return;
    }
    this.stripe = await loadStripe(environment.stripePublicKey);
    if (!this.stripe) {
      this.errorMessage.set('Stripe failed to load.');
      return;
    }
    this.elements = this.stripe.elements();
    this.card = this.elements.create('card', { style: { base: { fontFamily: 'inherit', fontSize: '14px' } } });
    this.card.mount(this.cardEl().nativeElement);
    this.ready.set(true);
  }

  ngOnDestroy(): void {
    this.card?.unmount();
  }

  protected async onSubmit(event: Event): Promise<void> {
    event.preventDefault();
    if (!this.stripe || !this.card) return;
    const secret = this.clientSecret();
    if (!secret) {
      this.errorMessage.set('No PaymentIntent client secret provided.');
      return;
    }

    this.errorMessage.set(null);
    this.submitting.set(true);

    const result = await this.stripe.confirmCardPayment(secret, {
      payment_method: { card: this.card },
    });

    if (result.error) {
      this.errorMessage.set(result.error.message ?? 'Payment failed.');
      this.submitting.set(false);
      return;
    }
    this.submitting.set(false);
    this.submitted.emit({ paymentIntentId: result.paymentIntent.id });
  }
}
