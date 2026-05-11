# Kitlo — Task Tracker

> Restart instructions: Open this file, check the status column, pick up at the first non-completed item. Completed work is archived in `docs/done-tasks.md`. All feature docs live in `/features`. Brand assets in `/brand`. Docs in `/docs`.

Last updated: 2026-05-01

> **Phase 0–4 complete (3.25, 4.3, 4.12–4.14 ⚠️ Partial). Phase 5 integration landed — frontend talks to backend over HTTP + SignalR; Stripe/Cloudinary scaffolded pending live keys.** End-to-end smoke verified against Dockerized Postgres: signup → JWT → `/api/users/me` + `/api/listings` (real seeded data).

---

## Phase 3 — Frontend Development (in progress)

> **Goal of Phase 3**: a runnable Angular site that walks through every persona's full workflow using in-memory mock data — no backend, no Stripe, no Cloudinary, no real WebSocket. Real integrations move to Phase 5.

### Page Shells with Mocks
| # | Task | Status | Notes |
|---|------|--------|-------|
| 3.12 | Public page shells |  ✅ Done | Wired Home, Search, Listing detail through `ListingsService` + `ReviewsService`; sidebar filters now propagate. See `docs/done-tasks.md`. |
| 3.13 | Auth flow page shells |  ✅ Done | login/signup/forgot-password/verify-email — error + submitting signals; signup persists intent via `UsersService.saveIntent`. See `docs/done-tasks.md`. |
| 3.14 | Renter dashboard page shells |  ✅ Done | bookings, booking-detail/cancel/checkout/leave-review, messages inbox/thread, profile, reviews, notifications all read/write through mock services. See `docs/done-tasks.md`. |
| 3.15 | Lister dashboard page shells |  ✅ Done | listings list, listing-create/edit, bundle-create, earnings, setup-onboarding routed through `ListingsService` / `PayoutsService` / `UsersService`. See `docs/done-tasks.md`. |
| 3.16 | Admin dashboard page shells |  ✅ Done | listings queue + detail, disputes queue + detail, users search + detail, payouts; actions hit `AdminService` (approve/reject/rule/warn/restrict/suspend/reinstate). See `docs/done-tasks.md`. |

### Cross-cutting UX
| # | Task | Status | Notes |
|---|------|--------|-------|
| 3.17 | Global error handling + toast service |  ✅ Done | `ToastService` (signal-backed queue with success/error/info/warning + dedupe + auto-dismiss), `Toast` + `ToastContainer` components mounted in `app.html`, functional `errorInterceptor` mapping HTTP failures to toasts (and 5xx → `/server-error`), `GlobalErrorHandler` for uncaught exceptions, new `ServerError` (500) page. Wired via `provideHttpClient(withInterceptors([...]))` + `{ provide: ErrorHandler }` in `app.config.ts`. |
| 3.18 | Loading states + skeleton patterns |  ✅ Done | Card-shaped skeleton components (`ListingCardSkeleton`, `ProfileCardSkeleton`, `BookingCardSkeleton`, `TableRowSkeleton`) sized to match their real counterparts. `loadable()` helper in `core/loading/loadable.ts` returns `{ data, loading, error, hasData }` signals from an `Observable<T>`. Applied to `PublicHome`, `PublicSearch`, `PublicListingDetail`, `DashboardBookings`, `AdminListings` — centered spinners replaced with structured skeletons. |
| 3.19 | Form validators + error display patterns |  ✅ Done | `core/forms/validators.ts` — `kitloValidators.zip / dailyRate / photoCount / dateRange`. `core/forms/error-messages.ts` — `DEFAULT_ERROR_MESSAGES` map + `firstErrorMessage()` resolver covering all built-in + Kitlo keys. `FormField` accepts `[control]` for auto-derived errors (after touched/dirty), `[errorMessages]` overrides, `aria-describedby` wiring. Applied to `AuthLogin`, `AuthSignup`, `DashboardListingCreate` (uses `kitloValidators.zip` + `dailyRate`). |
| 3.20 | URL query-string sync for search filters |  ✅ Done | `PublicSearch` hydrates state from `route.queryParamMap` once on init, then writes `q / location / conditions / gearTypes / minPrice / maxPrice / verifiedOnly / radius / sort` back via `router.navigate({ replaceUrl: true })`. Default values omitted to keep URLs clean. |

### Verification & Testing
| # | Task | Status | Notes |
|---|------|--------|-------|
| 3.21 | Unit tests for components & services |  ✅ Done | 58 vitest tests across 9 files: existing `services.spec.ts` (10) + new `toast.service.spec.ts` (8), `loadable.spec.ts` (3), `validators.spec.ts` (15), `error-messages.spec.ts` (7), `error-interceptor.spec.ts` (6), `global-error-handler.spec.ts` (2), `form-field.spec.ts` (5), `app.spec.ts` (2). All green. Coverage focus: new core modules from 3.17–3.19. |
| 3.22 | E2E tests for critical workflows |  ✅ Done | Playwright wired (`playwright.config.ts`) with chromium project pointing at `npm start` dev server. 9 specs across `e2e/` covering home/search/listing-detail browse, auth login validation, signup wizard, forgot-password, 404/500/forbidden error pages. Coverage of full booking + dispute + admin workflows is partial — see notes in `done-tasks.md`. |
| 3.23 | Lint & type checking |  ✅ Done | `npm run lint` clean (ESLint flat config + angular-eslint template-accessibility rules). `npm run build` runs full TS strict check with no errors. ESLint ignores `dist/`, `e2e/`, `playwright.config.ts`. |
| 3.24 | Build production bundle |  ✅ Done | `npm run build` produces `404.86 kB` initial / `102.47 kB` transfer (under the 500 kB warning budget in `angular.json`). Lazy chunks per route. Zero warnings. |
| 3.25 | Manual workflow walkthrough (THE Phase 3 acceptance gate) |  ⚠️ Partial | `npm start` boots cleanly; all key routes return 200; all 15 E2E (incl. axe) pass. **Full 22-workflow walkthrough through the dev role switcher (features/01–22 end-to-end, desktop + mobile devtools) requires a human in a browser — that part is owed by the user before declaring Phase 3 closed.** |
| 3.26 | Accessibility audit |  ✅ Done | Automated AXE via `@axe-core/playwright` runs against home/search/login/signup/500/404 (`e2e/a11y.spec.ts`) — 0 critical or serious violations across all 6 pages with WCAG 2 A + AA + 2.1 AA tags. Fixes applied: `--color-muted` darkened to `#5e6469`, `--color-faint` to `#6f757b`, `--color-on-dark-muted/faint` opacity bumped to 0.85/0.80 for AA on charcoal & olive, primary button text changed `text-white → text-ink` (4.6:1 vs amber), `<select>` labelling on search sort + role-switcher, `role="region"` on toast container, removed nested-interactive in `Toggle` by moving `role="switch"` onto the input, decorative step-card numerals marked `aria-hidden`. Lighthouse + manual keyboard-nav audit still owed if user wants belt-and-braces. |

---

## Phase 4 — Backend Development & Database

### Database Setup
| # | Task | Status | Notes |
|---|------|--------|-------|
| 4.1 | Scaffold C# .NET project |  ✅ Done | `backend/Kitlo.slnx` (new .NET 10 XML solution format) + `Kitlo.Api` (webapi, net10.0, controllers + OpenAPI), `Kitlo.Core` (classlib), `Kitlo.Data` (classlib with `Microsoft.EntityFrameworkCore` + `Npgsql.EntityFrameworkCore.PostgreSQL`). Project refs: Api → Core + Data, Data → Core. Api has `Microsoft.EntityFrameworkCore.Design` for migrations. Folder skeleton (Controllers/Services/Models/Middleware) committable via `.gitkeep`. `appsettings.json` has `ConnectionStrings:Default` (Postgres) and `Jwt` placeholders. `backend/.gitignore` covers `bin/`, `obj/`, IDE files. `dotnet build` clean (0 warnings); `dotnet run --project Kitlo.Api` boots cleanly on port 5268; `/openapi/v1.json` returns 200. |
| 4.2 | Create Entity Framework Core models |  ✅ Done | `Kitlo.Core/Enums/Enums.cs` (20+ enums) and 13 entity files in `Kitlo.Core/Models/`: `User`, `Listing` (+`ListingPhoto`, `ListingSpec`, `BundleItem`, `AvailabilityBlock`), `Booking` (+`BookingEvent`), `Payment`, `Payout`, `MessageThread` (+`ThreadParticipant`, `Message`), `Review`, `Dispute` (+`DisputeEvidence`), `Notification` (+`NotificationPreferences`), `AdminAction`, `Report`. All money in cents (int). DateOnly for booking dates, DateTimeOffset for timestamps. `KitloDbContext` configures all relationships, indexes, composite keys (`BundleItem`, `ThreadParticipant`), unique constraints (`User.Email`, `Review` per booking+kind), and cascade rules. |
| 4.3 | Configure PostgreSQL & migrations |  ⚠️ Partial | DbContext + Npgsql provider wired in `Kitlo.Data/KitloDbContext.cs`. Connection string in `appsettings.json:ConnectionStrings:Default`. Initial migration scaffolded as `Kitlo.Data/Migrations/20260501205342_InitialCreate.cs`. `Program.cs` calls `db.Database.MigrateAsync()` on startup (skippable via `SkipDatabase=true` config flag). **`dotnet ef database update` requires a running Postgres — not run in this session.** |
| 4.4 | Seed initial data |  ✅ Done | `Kitlo.Data/Seed/SeedData.cs` — idempotent dev seed (returns early if `Users.AnyAsync()`). Inserts renter/lister/admin demo users + 2 published listings (Pulsar Thermion thermal, ATN X-Sight NV) with photos and specs. Hooked into `Program.cs` after `MigrateAsync`, gated on `IsDevelopment()`. |

### Authentication & Authorization
| # | Task | Status | Notes |
|---|------|--------|-------|
| 4.5 | JWT authentication service |  ✅ Done | `Auth/TokenService.cs` issues HS256 access tokens (configurable lifetime, sub/email/role/jti claims) and 64-byte URL-safe refresh tokens. `Auth/JwtSettings.cs` binds `appsettings.Jwt`. `Auth/PasswordHasher.cs` wraps BCrypt.Net-Next (work factor 11). |
| 4.6 | Auth middleware & route protection |  ✅ Done | `Microsoft.AspNetCore.Authentication.JwtBearer` registered in `Program.cs` with full `TokenValidationParameters` (issuer + audience + lifetime + signing key). Authorization policies: `KitloPolicies.Admin` and `KitloPolicies.Lister` (admin elevated). Controllers use `[Authorize]` and `[Authorize(Policy = ...)]`. `ErrorHandlingMiddleware` maps `DomainException` → 400/401/403/404/409 with JSON body. |
| 4.7 | Auth API endpoints |  ✅ Done | `AuthController` — `POST /api/auth/signup` (creates user + NotificationPreferences, returns token + user), `POST /api/auth/login` (BCrypt verify, status checks), `POST /api/auth/logout` (204). `POST /api/auth/refresh` returns 401 with a TODO note — persistent refresh-token storage is owed in 5.x. |

### Core API Services
| # | Task | Status | Notes |
|---|------|--------|-------|
| 4.8 | Listings API (CRUD) |  ✅ Done | `ListingsController` + `ListingService`. Endpoints: GET `/api/listings` (Search), POST (Create draft, lister), GET `/{id}`, PUT `/{id}` (lister-owner only), POST `/{id}/publish` (validates ≥3 photos + non-zero rate), DELETE `/{id}` (soft archive), POST `/{id}/photos`, GET `/{id}/availability`. |
| 4.9 | Users API |  ✅ Done | `UsersController` — GET `/api/users/me` (auth), PUT `/api/users/{id}` (self-only), GET `/api/users/{id}/profile` (public, includes rating aggregate from visible Reviews). |
| 4.10 | Bookings API |  ✅ Done | `BookingsController` + `BookingService`. State-machine transitions in `TransitionAsync`: pending → confirmed → active → returned → completed (or cancelled). GET list (renter/lister filter, status filter, paged), POST create (computes total = rental + deposit + fee, reserves dates via AvailabilityBlock), PUT `/{id}/status`, GET `/{id}` returns full booking + timeline. |
| 4.11 | Search & discovery API |  ✅ Done | `ListingsController.Search` — query params `gearType`, `conditions` (csv), `minPriceCents`, `maxPriceCents`, `verifiedOnly`, `location` (zip prefix), `sort` (relevance / price-asc / price-desc / rating / newest), pagination. Only `Published` listings returned. |

### Payment & Stripe Integration
| # | Task | Status | Notes |
|---|------|--------|-------|
| 4.12 | Stripe Connect setup |  ⚠️ Partial | `StripeService.CreateOnboardingLinkAsync` returns a placeholder URL. Live `Stripe.NET` AccountLink wiring needs real keys + Phase 5 work. `IsLive` flag gates live-vs-test paths. Config slot in `appsettings.json:Stripe:SecretKey` (currently absent). |
| 4.13 | Payment flow endpoints |  ⚠️ Partial | `PaymentsController` + `StripeService.CreatePaymentIntentAsync` / `ConfirmAsync` / `RefundAsync` implement the two-PI shape (rental + deposit) and write `Payment` rows with bcrypt-style fake `pi_test_*` ids. Real `Stripe.PaymentIntents.CreateAsync` calls deferred to Phase 5. |
| 4.14 | Stripe webhook receiver |  ⚠️ Partial | `WebhooksController.Stripe` reads raw body + `Stripe-Signature` header and hands to `StripeService.HandleWebhookAsync` (no-op in scaffold mode). Signature verification + event dispatch (identity, account, payment_intent, transfer, dispute) deferred to Phase 5. |
| 4.15 | Payouts logic |  ✅ Done | `PayoutService.CreatePayoutAsync` (gross − fee = net, scheduled +2 days), `ListAsync` (paged, lister-scoped), `SummaryAsync` (lifetime/pending/this-month + bookings count + average daily rate), `ExportCsvAsync`. `PayoutsController` exposes `/api/payouts`, `/summary`, `/export` (CSV download). Lister policy gated. |

### Additional Features
| # | Task | Status | Notes |
|---|------|--------|-------|
| 4.16 | Messaging API |  ✅ Done | `MessagesController` + `MessageService`. GET `/threads`, GET `/threads/{id}` (marks read), POST `/threads/{id}` (sends message + updates thread preview). Membership enforced via `ThreadParticipant` composite key. Real-time WebSocket/SignalR push deferred to Phase 5. |
| 4.17 | Reviews & ratings API |  ✅ Done | `ReviewService.SubmitAsync` enforces post-return-only, role inference (renter↔lister), unique per booking+kind. Blind two-way: 14-day reveal window OR immediate reveal when counterpart submits. POST `/api/reviews/bookings/{id}`, GET `/api/reviews?userId=`, GET `/api/listings/{id}/reviews` — only `VisibleAt <= now` rows returned. Updates listing `RatingAverage`/`RatingCount`. |
| 4.18 | Dispute resolution API |  ✅ Done | `DisputesController` + `DisputeService`. POST file (transitions Booking → Disputed), POST evidence (transitions Open → Evidence), PUT resolution (admin-only — applies booking outcome, writes `AdminAction` audit row). GET list (admin, status filter, paged). |
| 4.19 | Notifications API |  ✅ Done | `NotificationsController` + `NotificationService`. List (paged, unread filter), unread-count, mark-read, mark-all-read (bulk SQL), delete, GET/PUT preferences (Email/Push/SMS toggles + opt-out bitmask). `EnqueueAsync` for service-to-service fan-out. |
| 4.20 | Admin API |  ✅ Done | `AdminController` (admin policy). GET `/stats` (pending listings + open disputes + pending verifications), GET `/listings` (review queue with SLA hours), POST `/listings/{id}/approve|reject` (writes AdminAction), GET `/users` (paged search), PUT `/users/{id}/status` (warn/restrict/suspend/ban/reinstate). |

---

## Phase 5 — Integration (Frontend ↔ Backend & Third-Party)

> Phase 3 ships with mocks and stubs so the site is walkable without a backend. Phase 5 replaces those one-by-one once Phase 4 is live.

| # | Task | Status | Notes |
|---|------|--------|-------|
| 5.1 | HTTP client + JWT interceptor |  ✅ Done | `core/auth/token-storage.ts` (signal-backed `accessToken` + localStorage). `core/http/auth.interceptor.ts` injects `Authorization: Bearer <token>` only on same-origin / API requests. Registered in `app.config.ts` ahead of `errorInterceptor`. `environment.development.ts` points at `http://localhost:5268/api`. |
| 5.2 | Swap mock services for live API calls |  ✅ Done | All 9 services in `core/services/*.ts` rewritten to call backend endpoints via `HttpClient`. Public method signatures unchanged so callers keep building. Mock-data fixtures still imported by 4 placeholder pages (dashboard home, public-profile, etc.) — those finish migrating in a 5.10 follow-up. Mock-only `services.spec.ts` + `mock-response.ts` deleted. New `listings.service.spec.ts` uses `HttpTestingController`. |
| 5.3 | Real AuthService + guards |  ✅ Done | `AuthService` calls `POST /api/auth/login` / `/signup` and stores tokens via `TokenStorage`. `currentUser` signal preserved so existing pages stay reactive. Role-switcher kept for dev (env-gated by `environment.production`); `switchTo` short-circuits in production builds. Login + signup pages updated to `subscribe()` the now-async flow. |
| 5.4 | Stripe Elements integration |  ⚠️ Partial | `@stripe/stripe-js` installed; `StripePaymentForm` mounts a real Card Element when `environment.stripePublicKey` is set, otherwise shows a "key missing" hint. `confirmCardPayment(client_secret, ...)` called against the secret returned by `POST /api/payments/intent`. Inert without a publishable key. |
| 5.5 | Cloudinary upload integration |  ⚠️ Partial | `core/media/cloudinary.service.ts` — POSTs to `https://api.cloudinary.com/v1_1/{cloud}/image/upload` with the configured upload preset; returns a placehold.co URL when `cloudinaryCloudName` is empty. Upload-zone consumers can swap in `CloudinaryService.upload(file)` once a cloud is provisioned. |
| 5.6 | Real-time messaging client |  ✅ Done | Backend `Hubs/MessagesHub.cs` (SignalR, `[Authorize]`, `JoinThread/LeaveThread` group methods). `RealtimeMessageService` wraps `MessageService.SendAsync` and broadcasts via `IHubContext`. `MessagesController.Send` swapped to it. JWT pulled from `?access_token=` for `/hubs/*` requests (browsers can't set Authorization on WS handshake). Frontend `core/realtime/messages-hub.client.ts` connects with `withAutomaticReconnect` and exposes `messages$` observable. |
| 5.7 | Map / location component |  ✅ Done | `MapView` rewritten to use Leaflet + OpenStreetMap tiles (no API key). `leaflet.css` imported globally; marker icons sourced from unpkg CDN to dodge bundler asset-resolution issues. `allowedCommonJsDependencies: ["leaflet"]` in `angular.json`; initial-bundle warning budget bumped to 650 kB (current 565 kB). `pins` re-rendered reactively via signal `effect()`; auto-fits bounds. |
| 5.8 | E2E tests against real backend |  ⚠️ Partial | Existing Playwright suite (15 specs) still passes against the dev server. Hooking E2E to the real .NET API is one config change in `playwright.config.ts` (chain `dotnet run` after `npm start`); deferred until Stripe/Cloudinary keys land so the booking E2E can actually clear payment. Manual signup→login→`/api/users/me`→`/api/listings` smoke verified end-to-end against Dockerized Postgres. |
| 5.9 | Production deployment |  ⚠️ Partial | `Kitlo.Api/Dockerfile` (multi-stage SDK→runtime, exposes 8080, env-var configurable). `backend/docker-compose.yml` adds an `api` service behind `--profile full` that depends on a healthy Postgres. Real cloud deploy (DNS, secret management, frontend host, domain, smoke tests in production) is infrastructure work outside this codebase. |

---

## P2P Platform Research Findings

### Top platforms studied
| Platform | Category | Key lesson for Kitlo |
|---|---|---|
| **Airbnb** | Accommodation | Trust via two-way reviews + payment escrow. Map-first search. Profile photos build human connection. |
| **Turo** | Car rental | Risk scoring with 50+ data sources. Insurance tiers by vehicle value. Instant book vs. approve flow. |
| **Fat Llama** | Equipment | Insurance up to £25K is table-stakes. Lenders get 80% take. Condition at handoff is the critical trust moment. |
| **GeerGarage** | Outdoor gear | Matching algorithm (Uber-style) vs. browse model. Lend-to-own program for supply acquisition. Pickup confirmation closes the rental loop. |
| **Outdoorsy** | RV rental | Insurance bundled into every booking, not optional. Verification is non-negotiable before keys exchange. |

### Universal P2P requirements (every platform has these)
1. **Identity verification** — government ID, selfie match, before first transaction
2. **Two-way profiles & ratings** — both sides have reputation on the line
3. **Secure payment escrow** — funds held until transaction confirmed by both parties
4. **Insurance / damage coverage** — required, not optional, for any high-value item
5. **In-app messaging** — keep communication on-platform for dispute evidence
6. **Availability calendar** — real-time blocking, prevent double-booking
7. **Dispute resolution** — admin-mediated with evidence submission
8. **Cancellation policy** — tiered refunds based on notice period
9. **Search with location + filters** — proximity, category, date range, price
10. **Mobile-first UX** — hunters use phones in the field
11. **Notifications** — critical events must reach users via push + email
12. **Admin tooling** — listing review, user management, payout control

### Kitlo-specific differentiators
- **Bundle listing** — overlanding kit (RTT + fridge + awning + power), thermal+NV night-hunt, fly-fishing destination kit, power-station-+-overlanding. No competitor offers any of these as one-transaction bookings.
- **Condition rating system** — Mint / Field-Ready / Battle-Scarred. Honest, specific to field gear; works across overlanding, optics, fly fishing, and power.
- **Verified Member badge** — ID-verified listers build community trust in trust-insular markets (ExpeditionPortal, HuntTalk, Trout Unlimited chapters).
- **Spec-first listing cards** — overlanders evaluate on specs (RTT mount type, fridge Wh draw, awning size; thermal sensor resolution; rod weight); not marketing copy.
- **Vertical-aware listing form** — per-vertical field templates, attestations, and deposit tiers (`features/23-category-listing-rules.md`).

---

## Feature File Index
| File | Workflow | Persona(s) |
|---|---|---|
| features/personas.md | All personas defined | — |
| features/01-registration-onboarding.md | Sign up and create account | Visitor → Renter/Lister |
| features/02-lister-onboarding.md | Verify identity, connect bank | New Lister |
| features/03-create-listing.md | Add gear to the platform | Verified Lister |
| features/04-manage-listings.md | Edit, pause, archive listings | Lister |
| features/05-search-discovery.md | Find gear by location and type | Renter / Visitor |
| features/06-listing-detail.md | Evaluate a listing before booking | Renter |
| features/07-booking-request.md | Request dates and submit booking | Renter |
| features/08-payment-checkout.md | Pay, hold deposit, confirm booking | Renter |
| features/09-pre-pickup-messaging.md | Coordinate pickup details | Renter + Lister |
| features/10-pickup-inspection.md | Meet, inspect, confirm handoff | Renter + Lister |
| features/11-active-rental.md | Gear in use — extensions, support | Renter |
| features/12-return-confirmation.md | Return gear, release funds | Renter + Lister |
| features/13-ratings-reviews.md | Rate the other party post-return | Renter + Lister |
| features/14-dispute-resolution.md | File and resolve a dispute | Renter or Lister + Admin |
| features/15-payouts-earnings.md | Receive earnings, view dashboard | Lister |
| features/16-notifications.md | All platform notification events | All users |
| features/17-identity-verification.md | Verify government ID | Lister (required), Renter (high-value) |
| features/18-admin-listing-review.md | Review and approve premium listings | Admin |
| features/19-admin-dispute-management.md | Mediate disputes between users | Admin |
| features/20-admin-user-management.md | Warn, suspend, ban users | Admin |
| features/21-cancellation.md | Cancel a confirmed booking | Renter or Lister |
| features/22-bundle-listing.md | Create and book bundles (overlanding kit / thermal+NV / power+overlanding / fly fishing kit) | Lister + Renter |
| features/23-category-listing-rules.md | Per-vertical listing fields, deposits, attestations, and walkthrough rules | Lister + Admin |

---

## Open Questions (cross-cutting)
- [ ] Do we require lister approval on every booking, or default to instant book?
- [x] What is Kitlo's take rate? **Phase 1: 5% renter + 5% lister = 10% total.** Scales with rollout — see `docs/business-plan.md`.
- [ ] Minimum rental period? (suggest: 1 day minimum, 30-day maximum per booking)
- [ ] Extension policy: how long can a rental be extended, and does the deposit increase?
- [ ] International renters: US-only for Phase 1?
- [x] Does Kitlo charge a membership/subscription, or purely transaction-based? **Phase 1: purely transaction-based.** Subscription tiers explicitly out of scope per `docs/business-plan.md` §8.
- [ ] What is the grace period for late returns before a late fee kicks in?
