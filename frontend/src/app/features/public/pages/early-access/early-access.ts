import { ChangeDetectionStrategy, Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Button, FormField, Input } from '../../../../shared';
import { WaitlistService } from '../../../../core/services';

interface CategoryTile {
  label: string;
  body: string;
}

@Component({
  selector: 'app-early-access',
  imports: [RouterLink, ReactiveFormsModule, Button, FormField, Input],
  template: `
    <div class="bg-bone min-h-screen flex flex-col text-ink w-full overflow-x-hidden">
      <header class="border-b border-line">
        <div
          class="mx-auto max-w-(--kitlo-max-width) px-(--kitlo-page-gutter) h-15 flex items-center justify-between"
        >
          <a routerLink="/early-access" class="font-condensed text-h4 font-black uppercase tracking-[0.04em] text-slate">
            Kitlo
          </a>
          <a
            class="font-mono text-overline uppercase tracking-[0.10em] text-muted hover:text-slate"
            href="#waitlist"
          >Join waitlist</a>
        </div>
      </header>

      <main class="flex-1">
        <!-- Hero -->
        <section class="border-b-2 border-slate">
          <div
            class="mx-auto max-w-(--kitlo-max-width) px-(--kitlo-page-gutter) py-12 md:py-20 grid md:grid-cols-2 gap-10 md:gap-12 items-center"
          >
            <div class="min-w-0">
              <p
                class="font-mono text-overline text-muted tracking-[0.10em] uppercase mb-6 pb-3.5 border-b border-line"
              >Peer-to-peer overland gear rental · Early access</p>
              <h1 class="font-condensed font-black uppercase text-slate leading-[0.95] tracking-[-0.005em] break-words text-[clamp(34px,8.5vw,104px)]">
                Rent overland gear
                <span class="text-olive">from the people who own it.</span>
              </h1>
              <p class="text-body-lg text-muted mt-7 max-w-md">
                A peer-to-peer marketplace. Owners list rooftop tents, 12V fridges, recovery, optics, and waders when their kit is sitting idle. You book it for a trip and return it when you're back.
              </p>
              <div class="mt-8 md:mt-10 flex flex-col sm:flex-row sm:flex-wrap gap-3">
                <button appButton size="lg" condensed type="button" class="w-full sm:w-auto" (click)="scrollToForm()">
                  Join the waitlist
                </button>
                <a appButton variant="ghost" size="lg" href="#how" class="w-full sm:w-auto">How it works</a>
              </div>
            </div>

            <div id="waitlist" #formAnchor class="bg-surface border border-line p-6 sm:p-8 md:p-10 min-w-0 relative">
              @if (submitted()) {
                <div class="text-center py-6">
                  <p
                    class="font-mono text-overline text-amber tracking-[0.10em] uppercase mb-3"
                  >You're on the list</p>
                  <h2 class="font-condensed text-h2 font-extrabold uppercase text-slate mb-3 leading-tight">
                    Welcome to Kitlo.
                  </h2>
                  <p class="text-body text-muted max-w-sm mx-auto">
                    We'll email you when Kitlo opens in
                    <span class="font-medium text-ink">{{ submittedZip() }}</span>.
                    @if (submittedAlreadyOnList()) {
                      <span class="block mt-2 text-xs text-muted">(You were already on the list — we updated your details.)</span>
                    }
                  </p>
                </div>
              } @else {
                <h2
                  class="font-condensed text-h3 font-extrabold uppercase text-slate mb-1 tracking-[0.04em]"
                >Join the waitlist</h2>
                <p class="text-sm text-muted mb-6">
                  No spam, no charge. We email when Kitlo opens in your area.
                </p>

                <form [formGroup]="form" (ngSubmit)="submit()" novalidate>
                  <app-form-field
                    label="Name"
                    [required]="true"
                    [control]="form.controls.name"
                  >
                    <input
                      appInput
                      formControlName="name"
                      autocomplete="name"
                      [invalid]="isInvalid('name')"
                    />
                  </app-form-field>

                  <app-form-field
                    label="Email"
                    [required]="true"
                    [control]="form.controls.email"
                    [errorMessages]="{ pattern: 'Enter a valid email address.' }"
                  >
                    <input
                      appInput
                      type="email"
                      formControlName="email"
                      autocomplete="email"
                      [invalid]="isInvalid('email')"
                    />
                  </app-form-field>

                  <app-form-field
                    label="Zip code"
                    [required]="true"
                    [control]="form.controls.zip"
                    [errorMessages]="{ pattern: 'Enter a 5-digit ZIP code.' }"
                  >
                    <input
                      appInput
                      inputmode="numeric"
                      maxlength="5"
                      formControlName="zip"
                      autocomplete="postal-code"
                      [invalid]="isInvalid('zip')"
                    />
                  </app-form-field>

                  <app-form-field
                    label="What would you rent first?"
                    hint="Optional — helps us prioritize gear."
                    [control]="form.controls.firstRental"
                  >
                    <input
                      appInput
                      formControlName="firstRental"
                      placeholder="e.g., rooftop tent + fridge for a weekend in Moab"
                    />
                  </app-form-field>

                  <label
                    class="flex items-start gap-3 py-3 text-sm text-slate cursor-pointer mb-3"
                  >
                    <input
                      type="checkbox"
                      class="mt-1 h-4 w-4 accent-olive"
                      formControlName="interestedAsLister"
                    />
                    <span>
                      I'd also be open to renting out my own gear.
                      <span class="block text-xs text-muted mt-0.5">
                        We'll send a separate invite when Kitlo opens lister applications.
                      </span>
                    </span>
                  </label>

                  <!-- Honeypot. Real users never fill this; bots usually do. -->
                  <div class="sr-only" aria-hidden="true">
                    <label for="hp_company">Company</label>
                    <input
                      id="hp_company"
                      type="text"
                      tabindex="-1"
                      autocomplete="off"
                      formControlName="hpCompany"
                    />
                  </div>

                  @if (errorMessage()) {
                    <p class="text-sm text-battle mb-3" role="alert">{{ errorMessage() }}</p>
                  }

                  <button
                    appButton
                    size="lg"
                    condensed
                    class="w-full"
                    type="submit"
                    [disabled]="submitting()"
                  >
                    @if (submitting()) {
                      Sending…
                    } @else {
                      Join the waitlist
                    }
                  </button>
                </form>
              }
            </div>
          </div>
        </section>

        <!-- How it works -->
        <section id="how" class="border-b border-line">
          <div class="mx-auto max-w-(--kitlo-max-width) px-(--kitlo-page-gutter) py-16 md:py-20">
            <p class="font-mono text-overline text-muted tracking-[0.10em] uppercase mb-3">How Kitlo works</p>
            <h2 class="font-condensed text-h2 font-extrabold uppercase text-slate mb-3 max-w-2xl">
              Three steps from couch to campsite.
            </h2>
            <p class="text-body text-muted max-w-2xl mb-10">
              Kitlo connects people with gear sitting idle to people who need it for a trip. No big-box rental counter, no shipping. You meet a verified overlander in your area, take the kit, and bring it back.
            </p>
            <ol class="grid md:grid-cols-3 gap-6">
              @for (step of howItWorks; track step.title; let i = $index) {
                <li class="border border-line p-6 bg-surface relative">
                  <span
                    class="font-mono text-overline text-amber tracking-[0.10em] uppercase block mb-2"
                  >Step {{ i + 1 }}</span>
                  <h3
                    class="font-condensed text-h4 font-extrabold uppercase text-slate tracking-[0.04em] mb-2"
                  >{{ step.title }}</h3>
                  <p class="text-sm text-muted leading-relaxed">{{ step.body }}</p>
                </li>
              }
            </ol>
            <p class="font-mono text-xs uppercase tracking-[0.10em] text-muted mt-8">
              Own gear? <a class="text-slate underline underline-offset-2 hover:text-olive" href="#listers">List it and earn when it's idle ↓</a>
            </p>
          </div>
        </section>

        <!-- Categories -->
        <section class="mx-auto max-w-(--kitlo-max-width) px-(--kitlo-page-gutter) py-16">
          <p class="font-mono text-overline text-muted tracking-[0.10em] uppercase mb-3">What you can rent</p>
          <h2 class="font-condensed text-h2 font-extrabold uppercase text-slate mb-3 max-w-2xl">
            High-value gear, sitting idle most of the year.
          </h2>
          <p class="text-body text-muted max-w-2xl mb-10">
            Camping and overlanding is the anchor; hunting optics, fly fishing, and portable power layer in for the
            trips overlanders take. No firearms, no bows — Kitlo never moves a weapon. Optics that mount to your own
            rifle are welcome.
          </p>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            @for (cat of categories; track cat.label) {
              <article class="border border-line p-5 bg-surface">
                <p class="font-condensed text-[15px] font-extrabold uppercase text-slate tracking-[0.04em] mb-2">
                  {{ cat.label }}
                </p>
                <p class="text-xs text-muted leading-relaxed">{{ cat.body }}</p>
              </article>
            }
          </div>
        </section>

        <!-- Trust -->
        <section class="bg-surface border-y border-line">
          <div class="mx-auto max-w-(--kitlo-max-width) px-(--kitlo-page-gutter) py-16">
            <p class="font-mono text-overline text-muted tracking-[0.10em] uppercase mb-3">Why Kitlo works</p>
            <h2 class="font-condensed text-h2 font-extrabold uppercase text-slate mb-10">
              Three things matter.
            </h2>
            <div class="grid md:grid-cols-3 gap-6">
              @for (t of trust; track t.title) {
                <article class="border border-line p-6 bg-bone">
                  <p
                    class="font-mono text-overline text-amber tracking-[0.10em] uppercase mb-2"
                  >{{ t.label }}</p>
                  <h3
                    class="font-condensed text-h4 font-extrabold uppercase text-slate tracking-[0.04em] mb-2"
                  >{{ t.title }}</h3>
                  <p class="text-sm text-muted leading-relaxed">{{ t.body }}</p>
                </article>
              }
            </div>
          </div>
        </section>

        <!-- Lenders -->
        <section id="listers" class="bg-slate">
          <div
            class="mx-auto max-w-(--kitlo-max-width) px-(--kitlo-page-gutter) py-14 md:py-16 grid md:grid-cols-2 gap-10 md:gap-12 items-center"
          >
            <div class="min-w-0">
              <p
                class="font-mono text-overline text-amber tracking-[0.10em] uppercase mb-4"
              >For listers</p>
              <h2
                class="font-condensed text-[clamp(34px,6vw,48px)] font-black uppercase text-on-dark leading-[1.05] tracking-[0.01em] break-words"
              >Want to earn money renting out your gear?</h2>
              <p class="text-body-lg text-on-dark-muted leading-relaxed mt-4">
                Average booking value: <span class="text-on-dark font-medium">$400–$900</span>
                for a 3–5 day overland trip. Kitlo takes 5%. Payouts run through Stripe.
              </p>
            </div>
            <div class="flex md:justify-end">
              <button
                appButton
                variant="primary"
                size="lg"
                condensed
                type="button"
                class="w-full sm:w-auto"
                (click)="scrollToFormAsLister()"
              >List your gear</button>
            </div>
          </div>
        </section>

        <!-- Final CTA -->
        <section class="border-t-2 border-slate">
          <div
            class="mx-auto max-w-(--kitlo-max-width) px-(--kitlo-page-gutter) py-16 md:py-20 text-center"
          >
            <h2 class="font-condensed font-black uppercase text-slate leading-[0.95] tracking-[-0.005em] break-words text-[clamp(40px,9vw,104px)]">
              Get on the list.
              <span class="block text-olive">Be first to book.</span>
            </h2>
            <p class="text-body-lg text-muted mt-6 max-w-lg mx-auto">
              Kitlo opens to early-access overlanders first. One email when we launch in your zip.
            </p>
            <div class="mt-8">
              <button appButton size="lg" condensed type="button" (click)="scrollToForm()">
                Join the waitlist
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer class="border-t border-line">
        <div
          class="mx-auto max-w-(--kitlo-max-width) px-(--kitlo-page-gutter) py-8 flex flex-wrap items-center justify-between gap-4 text-xs text-muted"
        >
          <span>&copy; {{ year }} Kitlo. Peer-to-peer overlanding gear rental.</span>
          <a routerLink="/privacy" class="hover:text-slate">Privacy</a>
        </div>
      </footer>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EarlyAccess {
  private readonly fb = inject(FormBuilder);
  private readonly waitlist = inject(WaitlistService);

  protected readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(120)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(254)]],
    zip: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
    firstRental: ['', [Validators.maxLength(200)]],
    interestedAsLister: [false],
    hpCompany: [''], // honeypot
  });

  protected readonly submitting = signal(false);
  protected readonly submitted = signal(false);
  protected readonly submittedZip = signal('');
  protected readonly submittedAlreadyOnList = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  protected readonly year = new Date().getFullYear();

  private readonly formAnchor = viewChild<ElementRef<HTMLElement>>('formAnchor');

  protected readonly categories: CategoryTile[] = [
    { label: 'Camping & overlanding', body: 'Rooftop tents, awnings, 12V fridges, recovery boards, dual-battery, full kits.' },
    { label: 'Hunting optics', body: 'Thermal monoculars, NV scopes, clip-ons, spotting scopes — bundle thermal+NV.' },
    { label: 'Portable power', body: 'Power stations and solar — pairs with overlanding rigs and basecamps.' },
    { label: 'Fly fishing', body: 'Waders, wading boots, rod-and-reel setups, specialty Spey/Switch weights.' },
  ];

  protected readonly howItWorks = [
    {
      title: 'Browse listings nearby',
      body: 'Search your zip for gear from local overlanders. See photos, condition, daily rate, and reviews from past renters before you book.',
    },
    {
      title: 'Book your trip dates',
      body: 'Pay through Kitlo when you book. Funds sit in escrow until both sides confirm the return — no cash exchanged in person.',
    },
    {
      title: 'Pick up, head out, return',
      body: 'Meet the owner at a local handoff, take the kit on your trip, and return it on the agreed date. Both parties leave a review.',
    },
  ];

  protected readonly trust = [
    {
      label: 'Safe & secure',
      title: 'Verified listers only',
      body: 'Government ID + selfie verification. Funds held in escrow until both parties confirm return.',
    },
    {
      label: 'Affordable',
      title: 'Try before you buy',
      body: 'Test a rooftop tent or fridge for the cost of a tank of gas. Pay only when you book.',
    },
    {
      label: 'Local',
      title: 'Pickup nearby',
      body: 'Meet a verified overlander in your area. No shipping, no waiting.',
    },
  ];

  protected isInvalid(name: 'name' | 'email' | 'zip' | 'firstRental'): boolean {
    const c = this.form.controls[name];
    return c.invalid && (c.touched || c.dirty);
  }

  protected scrollToForm(): void {
    this.formAnchor()?.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  protected scrollToFormAsLister(): void {
    this.form.controls.interestedAsLister.setValue(true);
    this.scrollToForm();
  }

  protected submit(): void {
    if (this.submitting()) return;
    this.errorMessage.set(null);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    const v = this.form.getRawValue();
    this.waitlist
      .join({
        name: v.name.trim(),
        email: v.email.trim(),
        zip: v.zip.trim(),
        firstRental: v.firstRental?.trim() || undefined,
        interestedAsLister: v.interestedAsLister,
        hpCompany: v.hpCompany || undefined,
      })
      .subscribe({
        next: (res) => {
          this.submitting.set(false);
          this.submitted.set(true);
          this.submittedZip.set(v.zip);
          this.submittedAlreadyOnList.set(res.alreadyOnList);
        },
        error: (err: unknown) => {
          this.submitting.set(false);
          if (err instanceof HttpErrorResponse) {
            const msg = (err.error as { message?: string } | null)?.message;
            this.errorMessage.set(msg ?? 'Something went wrong. Please try again.');
          } else {
            this.errorMessage.set('Something went wrong. Please try again.');
          }
        },
      });
  }
}
