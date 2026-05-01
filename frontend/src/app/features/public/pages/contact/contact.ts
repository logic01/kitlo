import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule, NonNullableFormBuilder, Validators } from '@angular/forms';
import { Button, FormField, Input } from '../../../../shared';

@Component({
  selector: 'app-public-contact',
  imports: [ReactiveFormsModule, Button, FormField, Input],
  template: `
    <div class="mx-auto max-w-2xl px-(--kitlo-page-gutter) py-16">
      <p class="font-mono text-overline text-muted tracking-[0.10em] uppercase mb-3">Get in touch</p>
      <h1 class="font-condensed text-h1 font-black uppercase text-slate mb-4 leading-none">
        Contact Kitlo
      </h1>
      <p class="text-body text-muted mb-10">
        For dispute escalation use your booking page. For partnerships, press, or general questions, send a note below.
      </p>

      <form [formGroup]="form" (ngSubmit)="submit()" class="space-y-5">
        <app-form-field label="Your name" required>
          <input appInput formControlName="name" placeholder="Sam Hunter" />
        </app-form-field>
        <app-form-field label="Email" required>
          <input appInput type="email" formControlName="email" placeholder="you@example.com" />
        </app-form-field>
        <app-form-field label="Subject" required>
          <input appInput formControlName="subject" placeholder="What's this about?" />
        </app-form-field>
        <app-form-field label="Message" required>
          <textarea
            appInput
            formControlName="body"
            rows="6"
            placeholder="Tell us what's going on…"
          ></textarea>
        </app-form-field>
        <button appButton variant="primary" type="submit" [disabled]="form.invalid">
          Send message
        </button>
      </form>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicContact {
  private readonly fb = inject(NonNullableFormBuilder);

  protected readonly form = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    subject: ['', Validators.required],
    body: ['', [Validators.required, Validators.minLength(20)]],
  });

  protected submit(): void {
    if (this.form.invalid) return;
    this.form.reset();
  }
}
