import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { catchError, map, of, startWith, switchMap } from 'rxjs';
import {
  Alert,
  Avatar,
  Badge,
  Button,
  PageHeader,
  Spinner,
  StatusDot,
  type Crumb,
} from '../../../../shared';
import { MoneyPipe } from '../../../../shared/pipes/money.pipe';
import { AdminService } from '../../../../core/services/admin.service';
import { DisputesService } from '../../../../core/services/disputes.service';
import type { Dispute, DisputeResolution } from '../../../../core/models/dispute';

@Component({
  selector: 'app-admin-dispute-detail',
  imports: [FormsModule, DatePipe, MoneyPipe, Alert, Avatar, Badge, Button, PageHeader, Spinner, StatusDot],
  template: `
    @if (loading()) {
      <div class="px-8 py-16 text-center"><app-spinner /></div>
    } @else if (dispute(); as d) {
      <div class="px-8 py-8 max-w-5xl">
        <app-page-header [title]="'Dispute ' + d.id" [breadcrumbs]="crumbs()">
          <div slot="actions" class="flex gap-2">
            <button appButton variant="ghost" type="button">Message parties</button>
            <button appButton variant="primary" type="button">Issue ruling</button>
          </div>
        </app-page-header>

        <div class="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8 mt-6">
          <div>
            <div class="flex items-center gap-3 mb-5">
              <app-status-dot [tone]="d.status === 'resolved' ? 'confirmed' : 'disputed'" />
              <span class="font-condensed text-overline font-extrabold uppercase tracking-[0.10em]">
                {{ d.status }}
              </span>
              <span class="text-xs text-muted">Filed {{ d.filedAt | date: 'MMM d, h:mm a' }}</span>
            </div>

            <section class="mb-7">
              <p class="font-mono text-overline text-muted tracking-[0.10em] uppercase mb-2">Reason</p>
              <h2 class="font-condensed text-h2 font-extrabold uppercase text-slate">{{ d.reasonLabel }}</h2>
              <p class="text-body text-muted leading-relaxed mt-2">{{ d.summary }}</p>
            </section>

            <section class="mb-7">
              <p class="font-mono text-overline text-muted tracking-[0.10em] uppercase mb-3">Evidence ({{ d.evidence.length }})</p>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                @for (e of d.evidence; track e.id) {
                  <article class="border border-line bg-bone p-3">
                    <div class="flex items-center gap-2 mb-2">
                      <app-badge kind="gear-type" [label]="e.kind" />
                      <span class="font-mono text-xs text-muted">{{ e.uploadedAt | date: 'MMM d' }}</span>
                    </div>
                    @if (e.url) {
                      <div class="aspect-video bg-surface mb-2"></div>
                    }
                    @if (e.text) {
                      <p class="text-sm leading-relaxed">{{ e.text }}</p>
                    }
                  </article>
                }
              </div>
            </section>

            @if (d.resolution) {
              <app-alert tone="success" class="block">
                <strong>Resolved.</strong>
                {{ d.resolutionNote }}
              </app-alert>
            }
          </div>

          <aside class="space-y-5">
            <section class="border border-line bg-bone p-5">
              <p class="font-mono text-overline text-muted tracking-[0.10em] uppercase mb-3">Parties</p>
              <div class="flex items-center gap-3 mb-3">
                <app-avatar size="md" [name]="d.filedByName" />
                <div class="flex-1">
                  <div class="font-semibold text-sm">{{ d.filedByName }}</div>
                  <div class="text-xs text-muted">Filer</div>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <app-avatar size="md" name="Counterparty" />
                <div class="flex-1">
                  <div class="font-semibold text-sm">Counterparty</div>
                  <div class="text-xs text-muted">Booking {{ d.bookingId }}</div>
                </div>
              </div>
            </section>

            <section class="border border-line bg-bone p-5">
              <p class="font-mono text-overline text-muted tracking-[0.10em] uppercase mb-3">Amount in dispute</p>
              <p class="font-condensed text-h2 font-black text-olive">
                {{ d.amountInDisputeCents | money }}
              </p>
            </section>

            <section class="border border-line bg-bone p-5">
              <p class="font-mono text-overline text-muted tracking-[0.10em] uppercase mb-3">Issue ruling</p>
              <select class="w-full border border-line bg-bone px-3 py-2 text-sm font-mono mb-3" [(ngModel)]="ruling">
                <option value="refund-renter-full">Full refund to renter</option>
                <option value="refund-renter-partial">Partial refund to renter</option>
                <option value="release-lister-full">Full release to lister</option>
                <option value="release-lister-partial">Partial release to lister</option>
                <option value="split">Split 50/50</option>
              </select>
              <textarea
                class="w-full border border-line bg-bone px-3 py-2 text-sm mb-3"
                rows="4"
                [(ngModel)]="note"
                placeholder="Resolution note for both parties…"
              ></textarea>
              <button
                appButton
                variant="primary"
                type="button"
                class="w-full"
                [disabled]="submitting()"
                (click)="submitRuling()"
              >
                {{ submitting() ? 'Submitting…' : 'Submit ruling' }}
              </button>
            </section>
          </aside>
        </div>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminDisputeDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly admin = inject(AdminService);
  private readonly disputes = inject(DisputesService);

  private readonly disputeId = toSignal(
    this.route.params.pipe(map((p) => p['id'] as string)),
    { initialValue: '' },
  );

  private readonly disputeResult = toSignal(
    toObservable(this.disputeId).pipe(
      switchMap((id) => (id ? this.disputes.getById(id).pipe(catchError(() => of(null))) : of(null))),
      startWith(undefined as Dispute | null | undefined),
    ),
    { initialValue: undefined as Dispute | null | undefined },
  );

  protected readonly loading = computed(() => this.disputeResult() === undefined);
  protected readonly dispute = computed(() => this.disputeResult() ?? null);
  protected readonly submitting = signal(false);

  protected readonly crumbs = computed<Crumb[]>(() => [
    { label: 'Disputes', route: '/admin/disputes' },
    { label: this.dispute()?.id ?? 'Detail' },
  ]);

  protected ruling: DisputeResolution = 'split';
  protected note = '';

  protected submitRuling(): void {
    const id = this.disputeId();
    if (!id || this.submitting()) return;
    this.submitting.set(true);
    this.admin.ruleDispute(id, this.ruling, this.note).subscribe({
      next: () => this.router.navigateByUrl('/admin/disputes'),
      error: () => this.submitting.set(false),
    });
  }
}
