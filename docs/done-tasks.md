# Kitlo — Completed Task Archive

> Historical record of completed work. Active/pending tasks live in `docs/tasks.md`. Active sub-task breakdown lives in `docs/sub-tasks.md`. This file is append-only — when a task in `tasks.md` flips to ✅ Done, move its row plus any sub-task detail here.

---

## Phase 0 — Foundation ✅
| # | Task | Notes |
|---|------|-------|
| 0.1 | Define tech stack | Angular, C# backend, PostgreSQL, Stripe Connect, Cloudinary — see CLAUDE.md |
| 0.2 | Brand design (8 options) | brand/homepage-1 through 8 |
| 0.3 | Lock brand — Stewardship direction | brand/brand.md, brand/style.css |

---

## Phase 1 — Research & Product Definition ✅
| # | Task | Notes |
|---|------|-------|
| 1.1 | Research top P2P rental platforms | Airbnb, Turo, Fat Llama, GeerGarage, Outdoorsy, Spinlister studied |
| 1.2 | Identify key P2P feature requirements | See P2P findings in tasks.md |
| 1.3 | Define all user personas | features/personas.md |
| 1.4 | Map all workflows per persona | 22 workflows identified |
| 1.5 | Write individual feature .md files | features/01 through features/22 |
| 1.6 | Iterate and refine all feature files | Second pass complete — edge cases, cross-links, open questions resolved |

---

## Phase 2 — Design ✅
| # | Task | Notes |
|---|------|-------|
| 2.1 | Create pages.md | 35 pages, 9 areas, ~65 API endpoints |
| 2.2 | Visual sitemap | sitemap.html — 5-column visual with 4 flow diagrams |
| 2.3 | Design component library | brand/style.css — sections 1–44, 25 new component groups |
| 2.4 | Create template.html | brand/template.html — 27 sections, all components demonstrated |
| 2.5 | Design all page layouts | brand/layouts/ — 9 HTML files covering all 35 pages from pages.md; see brand/layouts/index.html for navigator |
| 2.6 | Design mobile views | brand/layouts/mobile/ — 6 HTML files, ~30 phone-frame screens; bottom-tab nav, filter/booking sheets, single-step wizard pattern |

---

## Phase 3 — Frontend Development (in progress, completed items only)

### 3.1 — Verify Angular project setup ✅
- Tailwind v4 (`@tailwindcss/postcss` + `@import 'tailwindcss'`)
- ESLint flat config (`angular-eslint` 21.3) + `npm run lint`
- `src/environments/{environment.ts, environment.development.ts}` + `fileReplacements`
- Build / lint / dev build / tests all pass

Angular 21.2, TS 5.9 strict, Prettier configured.

### 3.2 — Port brand/style.css design tokens into Tailwind theme ✅
- `@theme` block in `src/styles.css` with brand colors, fonts, type scale (with line-height + tracking per size), radius
- Non-Tailwind tokens (`--kitlo-max-width`, `--kitlo-page-gutter`, `--kitlo-transition-*`) kept as `:root` vars
- Replaced Angular CLI boilerplate `app.html` with brand smoke-test using `bg-bone`, `text-slate`, `font-condensed`, `text-display`, `bg-olive-pale`, condition badges, etc. Build/lint/test all clean (194 kB bundle).

### 3.3 — Identify common components across pages ✅
`docs/components.md` — 60+ components inventoried across 7 categories (foundation, layout, cards, forms, data display, feedback, marketing). Each has selector, style.css mapping, inputs/outputs, notes. Build order specified for 3.4.

### 3.4 — Build shared component library ✅

47 components across 7 categories + 3 pipes + 5 domain model files. Bundle 289 kB initial / 76 kB transfer.

| # | Sub-task |
|---|----------|
| 3.4.1 | Foundation primitives: Button, Input, FormField, Avatar, Badge, StatusBadge, StatusDot, TagPill, Spinner, Skeleton |
| 3.4.2 | Pipes: MoneyPipe, DateRangePipe, ConditionLabelPipe |
| 3.4.3 | Layout & nav: Footer, TopNav, Sidebar, MobileTabBar, PageHeader, Tabs, Stepper, ProgressBar (RoleSwitcher → 3.8) |
| 3.4.4 | Cards: ListingCard, ProfileCard, BookingCard, StepCard, TrustCard, ConditionCard, StatCard, ReviewCard, ReviewSummary, QueueItem |
| 3.4.5 | Forms & inputs: SearchBar, Toggle, StarInput, ConditionRatingInput, DateRangeInput, AvailabilityCalendar, TagPillGroup, UploadZone, PhotoGrid, StripePaymentForm (stub), MapView (stub), FilterSidebar |
| 3.4.6 | Data display: PhotoGallery, SpecTable, CostTable, DataTable, Timeline, CountdownDisplay, BookingSidebar, PhotoCompare |
| 3.4.7 | Feedback: Alert, Modal, ConfirmDialog, EmptyState |
| 3.4.8 | Marketing blocks: Hero, OliveBand, DarkBand, ConditionGrid |

RoleSwitcher deferred to 3.8 (depends on AuthService). Stripe/Cloudinary/Map all stubbed for Phase 5 swap.

### 3.5 — Build layout components ✅
4 layouts (`PublicLayout`, `AuthenticatedLayout`, `AdminLayout`, `MobileLayout`) in `src/app/layouts/`. Each renders `<router-outlet />`; consumed as parent routes in 3.6.
- `PublicLayout` — TopNav + Footer
- `AuthenticatedLayout` — TopNav + Sidebar (default renter items)
- `AdminLayout` — admin sidebar items
- `MobileLayout` — MobileTabBar

### 3.6 → 3.7 → 3.8 — Auth, state, routing foundation ✅

Executed in dependency order (3.8 first, then 3.7, then 3.6) since 3.6's guards depend on 3.8's AuthService.

| # | Sub-task |
|---|----------|
| A | 3.8 — Mock AuthService + dev role switcher (RoleSwitcher component) |
| B | 3.7 — Scaffold state management (signal stores in `core/state/`) |
| C | 3.6 — App routing with `authGuard`/`roleGuard`, lazy feature areas |
| D | Verify build/lint/test all clean |

**3.8** — `core/services/auth.service.ts` provides signal-backed `currentUser`/`role`/`isAuthenticated`, `login`/`signup`/`logout`, plus dev-only `switchTo(role)`. Persists to localStorage. Three seeded users (renter, lister, admin). `shared/components/role-switcher` is wired into `TopNav` and hides itself on `environment.production`.

**3.7** — Signal stores in `core/state/`: `ListingsStore`, `BookingsStore`, `MessagesStore`, `NotificationsStore`. Each exposes readonly computed signals + setter methods, with `setLoading`/`setError`/`reset`. `currentUser` lives on `AuthService` (single source of truth). New `Message`/`MessageThread`/`AppNotification` types added to `core/models`.

**3.6** — `app.routes.ts` now lazy-loads four feature areas via `loadChildren`:
- `features/public/public.routes.ts` — `/`, `/search`, `/listing/:id`, `/contact`, etc.
- `features/auth/auth.routes.ts` — `/auth/{login,signup,forgot-password,verify-email}`
- `features/dashboard/dashboard.routes.ts` — exports `DASHBOARD_ROUTES` and `BOOKING_ROUTES`
- `features/admin/admin.routes.ts` — `/admin/*` behind `roleGuard(['admin'])`

Each feature owns its own layout (`PublicLayout` / `AuthenticatedLayout` / `AdminLayout`) so the layout chunk ships with the lazy area. `authGuard` and `roleGuard(['lister','admin'])` enforced on dashboard children.

**Verification** — `npm run lint` clean (added `argsIgnorePattern: '^_'` to flat config), `npm run build` 273 kB initial / 72 kB transfer + 7 lazy chunks (auth: 461 B, public: 1.27 kB, admin: 1.74 kB, dashboard: 3.00 kB), `npm test` 2/2 pass.

### 3.9 — Create mock data fixtures ✅

`frontend/src/app/core/mock-data/` — 9 TS fixtures wrapping every domain object, realistic enough to walk every persona workflow. No store/service wiring (3.10 owns that).

| # | Sub-task |
|---|----------|
| A | Dispute + Payout types in `core/models/` |
| B | users.fixture (8 users) + listings.fixture (15 listings incl. bundle) |
| C | bookings.fixture (every status: confirmed/active/returned/completed/disputed/cancelled) + reviews.fixture |
| D | messages/notifications/disputes/payouts/admin-queues fixtures |
| E | mock-data/index.ts barrel + lint/build/test clean |

**Coverage:**
- 8 users (3 renters, 4 listers, 1 admin), with `MOCK_PROFILES` derivative for cards/profile pages
- 15 listings across thermal / NV / optics / treestand / pack / saddle, mix of mint / field-ready / battle-scarred. `lst-008` is the bundle (Pulsar XQ50 + ATN 4K Pro). Weapons (rifles, bows) are excluded by listing policy — see `gear-catalogue.md` and `features/18-admin-listing-review.md`.
- 8 bookings, one per terminal status + two confirmed-future
- 5 listing-grouped review sets + 2 renter-side reviews
- 4 message threads with full message history
- 7 notifications (every `NotificationKind` covered)
- 3 disputes (open / mediation / resolved)
- 5 payouts (paid / in-transit / scheduled) + earnings summary
- Listing review queue (4) + dispute queue (2) + verification queue (1)

Bundle unchanged (273 kB initial) because fixtures aren't imported yet — tree-shaken until 3.10 wires them through services.

### 3.10 — Build core services backed by in-memory mocks ✅

`frontend/src/app/core/services/` — 9 services + `mock-response` helper + `services/index.ts` barrel + 8-test spec. Each service owns a private mutable copy of its fixture, returns `Observable<T>` via `of(...).pipe(delay(120))`, and exposes method signatures shaped to the REST endpoints in `docs/pages.md`. Phase 5 swap is mechanical.

| # | Sub-task |
|---|----------|
| A | ListingsService, UsersService, ReviewsService |
| B | BookingsService (state machine + timeline mutations) |
| C | MessagesService, NotificationsService, DisputesService, PayoutsService |
| D | AdminService + `services/index.ts` barrel + sanity unit test |
| E | `npm run lint`, `npm test`, `npm run build` all clean |

**Coverage:**
- `ListingsService` — search (filters: gearType/condition/price/verified/minRating/location, sort, paginate), count, getById, getAvailability (synthetic ranges), getMine, create draft, update, archive, addPhotos, publish, getMarketRates (avg/p25/p75 from sample)
- `UsersService` — getMe, getProfile, getPublicProfile, updateProfile, saveIntent, uploadProfilePhoto, get/update notification preferences, getOnboardingStatus, recordListerAgreement
- `ReviewsService` — getByListing (paginated), getByUser, submit (writes to listing or user pool)
- `BookingsService` — list (role/status filters), getById, getTimeline, create (request → confirmed with timeline), confirmPickup → active, flagCondition, confirmHandoff, confirmReturn → returned, flagDamage → disputed, requestExtension, cancel → cancelled, cancelPreview (refund tier from hours-until-start), requestMutualCancel
- `MessagesService` — listThreads, getThread, sendMessage (updates last preview/at), markThreadRead, uploadAttachment
- `NotificationsService` — list (unread/kind/limit), unreadCount, markRead, markAllRead, dismiss
- `DisputesService` — list (status/booking filters), getById, file (open status), addEvidence (auto-bumps to `evidence` status), resolve
- `PayoutsService` — getSummary, getHistory (paginated), getByListing (grouped), exportCsv (CSV string)
- `AdminService` — getStats (queue counts + SLA breaches), listing/dispute/verification queue queries, approve/reject/requestChanges/escalateListing, ruleDispute, messageDisputeParty, reopenDispute, searchUsers, getUserRecord, warn/restrict/suspend/banUser, reinstate

**Verification:** 10/10 vitest pass · ESLint clean · `npm run build` 273 kB initial / 72 kB transfer (unchanged — services tree-shaken until 3.12+ pages import them).

### 3.11 — Translate wireframes into Angular templates ✅

35+ standalone Angular components under `frontend/src/app/features/<area>/pages/<page>/` covering every page in `docs/layouts/`. Wizards condensed (signup, lister onboarding, create-listing, dispute resolution) into single Stepper-driven components. Routes wired through `public.routes.ts`, `auth.routes.ts`, `dashboard.routes.ts`, and `admin.routes.ts`. Mock data inline via `core/mock-data` — service wiring lands in 3.12–3.16.

| # | Sub-task |
|---|----------|
| A | Public pages: 1.1 Home, 1.2 How it works, 1.3 Search, 1.4 Listing detail, 9.1–9.3 Legal |
| B | Auth + onboarding: 2.1 Sign in, 2.2 Sign up wizard, 3.1 Lister onboarding wizard |
| C | Booking flow: 4.1 Request, 4.2 Checkout, 4.3 Confirmed |
| D | Renter dashboard: 5.1–5.8, 7.1 Review |
| E | Lister dashboard: 6.1–6.6 |
| F | Admin: 8.1–8.7 |
| G | Wire routes, lint/test/build clean |

**Coverage by feature area:**
- **Public** (`features/public/pages/`): home, how-it-works, search, listing-detail, contact, about, list-your-gear, legal (terms/privacy/lister-agreement via shared component + route data)
- **Auth** (`features/auth/pages/`): login, signup wizard (3 steps), forgot-password, verify-email
- **Renter dashboard** (`features/dashboard/pages/`): home, bookings, booking-detail, booking-cancel, booking-request, booking-checkout, booking-confirmed, messages-inbox, messages-thread, profile, public-profile, reviews, leave-review, notifications
- **Lister dashboard** (`features/dashboard/pages/`): listings, listing-create wizard (4 steps), listing-edit, availability-calendar, bundle-create, earnings, bank-account, setup-onboarding wizard (4 steps)
- **Admin** (`features/admin/pages/`): home, listings (queue), listing-detail, disputes, dispute-detail, users, user-detail, payouts

**Verification:** ESLint clean · 10/10 vitest pass · `npm run build` 368 kB initial / 93 kB transfer. Lazy chunks: dashboard 67.8 kB, admin 20.9 kB, public 29.1 kB, auth 12.3 kB. Each feature area is route-lazy-loaded.

### 3.13 — Auth flow page shells ✅

Login, signup wizard, forgot-password, verify-email pass submissions through `AuthService` + `UsersService`.

| # | Sub-task |
|---|----------|
| A | Login: `submitting`/`error` signals; routes to `/dashboard` on success, surfaces alert on failure |
| B | Signup: persists intent via `UsersService.saveIntent`, routes renters → `/search` and listers → `/dashboard/setup-onboarding` |
| C | Forgot-password: submitting state with simulated send + success alert |
| D | Verify-email: static success state |

### 3.14 — Renter dashboard page shells ✅

All renter pages route through the mock services from 3.10. Booking flow (request → checkout → active → cancel → review) sends create/transition/cancel/preview/submit calls through `BookingsService` + `ReviewsService`.

| # | Sub-task |
|---|----------|
| A | `bookings` list via `BookingsService.list` (page → tab filter); spinner during load |
| B | `booking-detail` switches `getById` + `getTimeline` per `:id`, with `not found` fallback |
| C | `booking-cancel` previews refund via `cancelPreview`, confirms via `cancel` |
| D | `booking-checkout` calls `BookingsService.create` and routes to confirmed |
| E | `leave-review` posts via `ReviewsService.submit`, links submission to current user |
| F | `messages-inbox` lists via `MessagesService.listThreads`; `messages-thread` reads/sends via `getThread` + `sendMessage` + `markThreadRead` |
| G | `profile` patches via `UsersService.updateProfile`; toggles persist via `updateNotificationPreferences` |
| H | `reviews` reads received via `getByListing` (forkJoin), given via `getByUser` |
| I | `notifications` reads via `NotificationsService.list`, marks read on click + bulk |

### 3.15 — Lister dashboard page shells ✅

Listings, bundle, earnings and onboarding all routed through `ListingsService` / `PayoutsService` / `UsersService`. Listing-create flips draft→update→publish in sequence; listing-edit hydrates the form via effect on listing signal.

| # | Sub-task |
|---|----------|
| A | `listings` list via `search({pageSize:50})` filtered by lister name + tab |
| B | `listing-create` calls `create()` → `update(rate/deposit/policy)` → `publish()` |
| C | `listing-edit` hydrates from `getById`, saves via `update`, archives via `archive` |
| D | `bundle-create` selects from current user's listings, posts bundle via `create()` + `update({isBundle, bundleListingIds})` |
| E | `earnings` reads `summary` + history via `PayoutsService`; CSV export downloads via blob |
| F | `setup-onboarding` calls `recordListerAgreement` on finish |

### 3.16 — Admin dashboard page shells ✅

Admin queues + detail pages call `AdminService` for approve/reject/rule/warn/restrict/suspend/reinstate; payouts surfaces aggregate stats from `PayoutsService.getHistory`.

| # | Sub-task |
|---|----------|
| A | `home` loads listing + dispute + verification queues from `AdminService` |
| B | `listings` queue + `listing-detail` (approve/reject/requestChanges) |
| C | `disputes` queue + `dispute-detail` (rule with selected resolution + note) |
| D | `users` debounced-search via `searchUsers`; `user-detail` warn/restrict/suspend/reinstate with status override |
| E | `payouts` aggregates pending/in-transit/paid stats from history items |

**Verification (3.13–3.16):** ESLint clean · 10/10 vitest pass · `npm run build` 374.11 kB initial / 94.78 kB transfer.

---

## Phase 5 — Integration ✅ (with Stripe / Cloudinary / deploy gates)

Frontend now talks to the real .NET backend over HTTP + SignalR. Mock services swapped one-for-one for HTTP-backed implementations with identical public signatures so consumer pages didn't need to change.

| Area | Implementation |
|---|---|
| **Auth** (5.1, 5.3) | `core/auth/token-storage.ts` — signal-backed access/refresh storage in localStorage. `core/http/auth.interceptor.ts` injects `Authorization: Bearer <token>` only on same-origin / API URLs. Real `AuthService` calls `/api/auth/login` + `/signup`, persists tokens, exposes `currentUser` signal unchanged. Login + signup pages now subscribe to the async response. Role-switcher kept for dev (env-gated). |
| **HTTP services** (5.2) | All 9 services rewritten: `ListingsService`, `UsersService`, `BookingsService`, `MessagesService`, `NotificationsService`, `ReviewsService`, `DisputesService`, `PayoutsService`, `AdminService`. Each maps backend integer enums (`gearType: 0`) to frontend string discriminators (`'thermal'`). Old `mock-response.ts` + `services.spec.ts` deleted; new `listings.service.spec.ts` uses `HttpTestingController`. |
| **Realtime messaging** (5.6) | Backend `Hubs/MessagesHub.cs` (`[Authorize]`, `JoinThread/LeaveThread` group methods). `RealtimeMessageService` wraps `MessageService.SendAsync` and fans out via `IHubContext`. JWT bearer pulls from `?access_token=` query for `/hubs/*` (WS handshake can't carry `Authorization`). Frontend `core/realtime/messages-hub.client.ts` (`@microsoft/signalr`) keeps a single auto-reconnecting connection; exposes `messages$` Observable. |
| **Map** (5.7) | `MapView` rewritten to Leaflet + OpenStreetMap tiles (no API key). Marker icons sourced from unpkg CDN. Leaflet CSS imported globally; `allowedCommonJsDependencies: ["leaflet"]` registered in `angular.json`. Initial-bundle warning budget bumped 500 kB → 650 kB to accommodate Leaflet. |
| **Stripe** ⚠️ Partial (5.4) | `@stripe/stripe-js` installed. `StripePaymentForm` mounts a real Card Element when `environment.stripePublicKey` is set, calls `confirmCardPayment(client_secret, …)` against the secret returned by `POST /api/payments/intent`. Shows "key missing" hint when no key is configured. |
| **Cloudinary** ⚠️ Partial (5.5) | `core/media/cloudinary.service.ts` POSTs to `https://api.cloudinary.com/v1_1/{cloud}/image/upload` with the configured upload preset. Returns a placehold.co URL when `cloudinaryCloudName` is empty. Signed-upload flow (production) requires a backend `POST /api/uploads/sign` endpoint. |
| **JWT key length** | Bumped `appsettings.json:Jwt:Key` from 29 chars → 76 chars. HS256 requires ≥256 bits and the original placeholder threw `IDX10720` at runtime. |
| **Deployment** ⚠️ Partial (5.9) | `Kitlo.Api/Dockerfile` (multi-stage SDK 10 → ASP.NET runtime, exposes 8080). `backend/docker-compose.yml` gains an `api` service behind `--profile full` that depends on a healthy Postgres. Cloud deploy (DNS, secret management, frontend host) is infrastructure work outside this codebase. |

**Verification:**
- `dotnet build Kitlo.slnx` 0 warnings / 0 errors
- `npm run lint` clean · `npm run build` 565 kB initial / 142 kB transfer
- 52 / 52 vitest unit tests pass · 15 / 15 Playwright E2E pass
- End-to-end smoke against Dockerized Postgres: `POST /api/auth/signup` (200) → `POST /api/auth/login` (returns real 497-char JWT) → `GET /api/users/me` (returns the persisted user) → `GET /api/listings` (returns real seeded listings)

---

## Phase 4 — Backend Development & Database (in progress, completed items only)

### 4.2–4.20 — Backend implementation ✅ (with two ⚠️ Partial gates)

Full ASP.NET Core 10 backend implemented in one pass: 13 entity files, DbContext with all relationships + indexes, JWT + bcrypt auth, 11 controllers covering 60+ endpoints across listings/users/bookings/messages/reviews/disputes/notifications/payouts/admin/payments. Build clean (0 warnings); `/openapi/v1.json` returns 200; `/api/users/me` returns 401 without auth (auth pipeline working).

**Domain layer (`Kitlo.Core`)**

| File | Entities |
|---|---|
| `Enums/Enums.cs` | UserRole, UserStatus, GearType, Condition, ListingStatus, CancellationPolicy, AvailabilityReason, BookingStatus, BookingEventKind, PaymentStatus, PaymentKind, PayoutStatus, DisputeStatus, DisputeReason, DisputeResolution, DisputeEvidenceKind, ReviewKind, ReviewAccuracy, NotificationKind, AdminActionKind, ReportTargetType |
| `Models/User.cs` | User (BCrypt password hash, role, status, identity-verified, Stripe account id) |
| `Models/Listing.cs` | Listing, ListingPhoto, ListingSpec, BundleItem (composite-key join), AvailabilityBlock |
| `Models/Booking.cs` | Booking, BookingEvent (state-machine audit) |
| `Models/Payment.cs` | Payment (Stripe intent id, two-PI kinds: Rental/Deposit/Extension/DamageCharge) |
| `Models/Payout.cs` | Payout (gross/fee/net split, Stripe transfer id) |
| `Models/Message.cs` | MessageThread, ThreadParticipant (composite key + LastReadAt), Message |
| `Models/Review.cs` | Review (blind two-way: VisibleAt either set immediately when counterpart submits OR scheduled +14 days) |
| `Models/Dispute.cs` | Dispute, DisputeEvidence |
| `Models/Notification.cs` | Notification, NotificationPreferences (channel toggles + opt-out bitmask) |
| `Models/AdminAction.cs` | Audit log of all admin moderation decisions |
| `Models/Report.cs` | User-submitted reports (abuse, listing concerns) |

**Data layer (`Kitlo.Data`)**

| File | Notes |
|---|---|
| `KitloDbContext.cs` | All DbSets, relationships, composite keys, indexes (`User.Email` unique, `Listing.GearType+Status`, `Listing.PickupZip`, `Booking.RenterId/ListerId/ListingId/Status`, `Payment.StripePaymentIntentId`, `Review` unique per booking+kind, etc.), cascade rules |
| `Migrations/20260501205342_InitialCreate.cs` | Initial migration generated via `dotnet ef migrations add` (dotnet-ef installed globally) |
| `Seed/SeedData.cs` | Idempotent dev seed: 3 demo users (renter/lister/admin) + 2 published listings (Pulsar Thermion thermal, ATN X-Sight NV) with photos and specs |

**API layer (`Kitlo.Api`)**

| Area | Files |
|------|-------|
| Auth | `Auth/JwtSettings.cs`, `Auth/PasswordHasher.cs` (BCrypt.Net-Next, work factor 11), `Auth/TokenService.cs` (HS256 access tokens + URL-safe random refresh tokens). Policies `KitloPolicies.Admin` and `KitloPolicies.Lister` |
| Common | `Common/PagedResult.cs`, `Common/CurrentUser.cs` (claims helpers), `Common/DomainException.cs` (status-code-mapped exceptions) |
| Middleware | `Middleware/ErrorHandlingMiddleware.cs` (DomainException → JSON error response with proper status code) |
| DTOs | `Models/Dtos.cs` — request/response records aligned with frontend `core/services` signatures |
| Services | `UserService`, `ListingService`, `BookingService` (state machine with transitions: confirm/pickup/return/complete/cancel + auto AvailabilityBlock release), `MessageService`, `ReviewService` (blind reveal + listing rating aggregate update), `DisputeService` (auto-transitions Booking.Status), `NotificationService` (paged + bulk mark-read), `PayoutService` (CSV export), `AdminService`, `StripeService` (scaffold-only — see ⚠️ below) |
| Controllers | `AuthController`, `UsersController`, `ListingsController`, `BookingsController`, `MessagesController`, `ReviewsController` (+ `ListingReviewsController`), `DisputesController`, `NotificationsController`, `PayoutsController`, `AdminController`, `PaymentsController` (+ `WebhooksController`, `StripeConnectController`) |
| Wiring | `Program.cs`: connection string, JWT bearer + policies, services registered, CORS for `localhost:4200`, ErrorHandlingMiddleware, `MigrateAsync` + dev seed on startup (skippable via `SkipDatabase=true`) |

**⚠️ Partial gates**

- **4.3** — DbContext + initial migration scaffolded, but `dotnet ef database update` requires a running Postgres. Schema applies automatically on first boot via `db.Database.MigrateAsync()`.
- **4.12 / 4.13 / 4.14** — `StripeService` writes the right Booking/Payment state-machine rows and exposes endpoints, but live Stripe.NET SDK calls + webhook signature verification are deferred to Phase 5 once test/live keys are provisioned. `IsLive` flag distinguishes scaffold-vs-live mode. Set `Stripe:SecretKey` in `appsettings.json` to enable.

**Verification:** `dotnet build Kitlo.slnx` clean (0 warnings, 0 errors). `dotnet run --project Kitlo.Api` boots on :5268; `GET /openapi/v1.json` → 200; `GET /api/users/me` → 401 (auth pipeline live); `GET /api/listings` → 500 in this session (no Postgres available).

---

### 4.1 — Scaffold C# .NET project ✅

Three-project ASP.NET Core 10 solution standing up — pure scaffolding for future Phase 4 tasks (EF models 4.2, JWT 4.5, controllers 4.7+) to build on.

| File / change | Notes |
|---|---|
| `backend/Kitlo.slnx` | New .NET 10 XML solution format. References all three projects. |
| `backend/Kitlo.Api/` | `webapi` template, net10.0, controllers + built-in OpenAPI. WeatherForecast sample stripped. Folder skeleton: `Controllers/`, `Services/`, `Models/`, `Middleware/` (each with `.gitkeep`). |
| `backend/Kitlo.Core/` | `classlib`, net10.0. Empty — domain POCOs land here in 4.2. |
| `backend/Kitlo.Data/` | `classlib`, net10.0. Packages: `Microsoft.EntityFrameworkCore` + `Npgsql.EntityFrameworkCore.PostgreSQL`. DbContext lands here in 4.2/4.3. |
| Project refs | `Kitlo.Api` → `Kitlo.Core` + `Kitlo.Data`; `Kitlo.Data` → `Kitlo.Core`. |
| `appsettings.json` | `ConnectionStrings:Default` (local Postgres) + `Jwt` (Issuer/Audience/Key) placeholders. |
| `Kitlo.Api` packages | `Microsoft.EntityFrameworkCore.Design` for `dotnet ef migrations`. |
| `backend/.gitignore` | `bin/`, `obj/`, IDE noise, `appsettings.Production.json`. |

**Verification:** `dotnet build` 0 warnings / 0 errors. `dotnet run --project Kitlo.Api` boots on port 5268; `GET /openapi/v1.json` → 200.

---

### 3.20 — URL query-string sync for search filters ✅

`/search` is now shareable / back-button-friendly. State hydrates from `ActivatedRoute.queryParamMap` once on init, then a single `effect()` writes the canonical URL on every change. Defaults omitted from the URL so it stays clean (`/search` for the empty default, no spurious `?recommended=`-style noise).

Params: `q`, `location`, `conditions`, `gearTypes`, `minPrice`, `maxPrice`, `verifiedOnly`, `radius`, `sort`.

**Verification:** ESLint + build clean. E2E spec checks `verifiedOnly=true` lands in URL after toggling the filter.

---

### 3.21 — Unit tests for components & services ✅

| File | Coverage |
|------|----------|
| `app.spec.ts` (existing) | 2 tests — App boots, renders router-outlet |
| `core/services/services.spec.ts` (existing) | 8 tests — Listings/Bookings/Messages/Notifications/Payouts behaviour |
| `core/services/toast.service.spec.ts` | 8 tests — show/dismiss/clear/dedupe/auto-dismiss/per-tone duration/empty-message guard |
| `core/loading/loadable.spec.ts` | 3 tests — initial loading state, ready emission, error capture |
| `core/forms/validators.spec.ts` | 15 tests — zip / dailyRate (min/max/invalid) / photoCount (FormArray-aware) / dateRange (order/min/max) |
| `core/forms/error-messages.spec.ts` | 7 tests — null/empty/built-ins/Kitlo keys/overrides/first-key resolution |
| `core/error/error-interceptor.spec.ts` | 6 tests — status 0/401/403/5xx/JSON-message extraction/rethrow |
| `core/error/global-error-handler.spec.ts` | 2 tests — Error vs unknown throwables |
| `shared/components/form-field/form-field.spec.ts` | 5 tests — gates display on touched/dirty, switches between rule messages, manual override |

**58 / 58 passing** under vitest.

---

### 3.22 — E2E tests for critical workflows ✅ (scaffolded)

Playwright wired (`@playwright/test` 1.59) with `playwright.config.ts` pointing at the local dev server (auto-started, port 4200).

| Spec | Coverage |
|------|----------|
| `e2e/public-browse.spec.ts` | Home renders hero + featured listings; search reflects filters into URL; listing-detail loads via deep link |
| `e2e/auth-flow.spec.ts` | Login surfaces field validation on invalid email; signup wizard renders the account step; forgot-password loads |
| `e2e/error-pages.spec.ts` | 404, 500, forbidden pages render correctly |
| `e2e/a11y.spec.ts` | Automated AXE audit on 6 key pages (see 3.26) |

**15 / 15 passing.** Booking → checkout → return → review and dispute / admin review-queue flows are *not* covered yet — those need persona-aware fixtures and live walkthrough. Tracked in 3.25.

Run with `npm run e2e` (or `npm run e2e:ui` for the UI runner). First-time setup: `npx playwright install chromium`.

---

### 3.23 — Lint & type checking ✅

`npm run lint` clean. ESLint flat config in `eslint.config.js` includes `@angular-eslint` strict rules + `template-accessibility`. Added an ignore block for `dist/`, `e2e/`, `playwright.config.ts`, `playwright-report/`. TypeScript strict mode is on; build compiles with zero errors.

---

### 3.24 — Build production bundle ✅

`npm run build` produces:

```
Initial total            404.86 kB raw / 102.47 kB transfer
Lazy chunks:
  dashboard-routes        77.16 kB
  public-routes           33.47 kB
  admin-routes            27.20 kB
  auth-routes             15.41 kB
```

Under the 500 kB warning budget in `angular.json`. Zero warnings, zero errors. Source maps disabled in production.

---

### 3.25 — Manual workflow walkthrough ⚠️ Partial

What's verified automatically:
- `npm start` boots clean (no console errors / warnings)
- All key routes (home, search, login, signup, dashboard, admin, server-error, 404) return 200
- 15 E2E (incl. AXE a11y) pass against the dev server
- 58 unit tests pass
- Lint + build clean

What's still owed (human-in-browser):
- Walk every workflow in `features/01–22` end-to-end through the dev role switcher
- Verify mobile breakpoints via devtools
- Document any UI gaps before declaring Phase 3 closed

This task is the gate before Phase 4 (backend) — it cannot be completed by automation alone.

---

### 3.26 — Accessibility audit ✅

`@axe-core/playwright` runs against home, search, login, signup, 500, 404 (`e2e/a11y.spec.ts`) with `wcag2a` + `wcag2aa` + `wcag21aa` tags. **0 critical or serious violations across all 6 pages.**

Fixes applied during audit:

| Issue | Fix |
|-------|-----|
| Primary button `text-white` on `bg-amber` (2.22:1) | Switched to `text-ink` (~4.6:1 against `#f2994a`, ~5.4:1 against `#d4781e` hover) |
| `--color-muted` `#7a8087` failed AA on bone (3.92:1) | Darkened to `#5e6469` (~5.5:1) |
| `--color-faint` failed | Darkened to `#6f757b` (~4.7:1) |
| `--color-on-dark-faint` (0.55 alpha) failed AA on charcoal & olive | Bumped to 0.80 alpha (~5.9:1) |
| `--color-on-dark-muted` (0.7 alpha) borderline | Bumped to 0.85 alpha |
| Search sort `<select>` had no accessible name | Added `aria-label="Sort results"` |
| Role-switcher `<label>` wrapping `<select>` not detected by axe | Restructured to `<label for="...">` + `<select id="...">` |
| ToastContainer used `aria-label` on a roleless div | Added `role="region"` |
| Toggle had `role="switch"` on `<span>` containing checkbox → nested-interactive | Moved `role="switch"` to the input itself |
| Step-card decorative 64px numerals (#d8d8d0 on #eeede6, 1.22:1) | Marked `aria-hidden` and bumped color to `text-faint` |

Manual Lighthouse run + keyboard-nav sweep across all forms still owed if the team wants belt-and-braces beyond automated AXE.

---

### 3.19 — Form validators + error display patterns ✅

Centralized Kitlo-specific validation rules and made field errors visible. Previously, forms tracked validity but users got no feedback beyond a disabled submit button.

| # | Sub-task |
|---|----------|
| A | `core/forms/validators.ts` — `kitloValidators.zip` (5-digit US), `dailyRate({ minCents, maxCents })`, `photoCount(min)` (FormArray-aware), `dateRange({ startKey, endKey, minDays?, maxDays? })` group validator |
| B | `core/forms/error-messages.ts` — `DEFAULT_ERROR_MESSAGES` covering built-ins (required, email, minlength, maxlength, min, max, pattern) + Kitlo keys; `firstErrorMessage(errors, overrides?)` resolver |
| C | `FormField` extended with `[control]` input — subscribes to control's `statusChanges` + `valueChanges` via `effect()` and shows first error from the message map only after `touched \|\| dirty`. Added `[errorMessages]` overrides input. Wired `aria-describedby` to error/hint elements; error gets `role="alert"` |
| D | Applied to `AuthLogin`, `AuthSignup` (account + profile steps), `DashboardListingCreate` (basics uses `kitloValidators.zip`, pricing uses `kitloValidators.dailyRate({ minCents: 100 })`). Submit buttons no longer rely on `[disabled]="form.invalid"` — they call `markAllAsTouched()` so errors surface on click |

**Verification:** ESLint clean · `npm run build` 404.68 kB initial / 102.47 kB transfer.

---

### 3.18 — Loading states + skeleton patterns ✅

Replaced centered spinners with content-shaped skeletons that match real-card footprints, so pages don't reflow when data arrives. Standardized the loading-signal pattern.

| # | Sub-task |
|---|----------|
| A | Card skeleton components — `ListingCardSkeleton`, `ProfileCardSkeleton`, `BookingCardSkeleton`, `TableRowSkeleton` mirror their real-card dimensions. Each has `aria-hidden="true"` on shimmer blocks; container parents get `aria-busy="true"` |
| B | `loadable<T>(source$)` helper (`core/loading/loadable.ts`) returns `{ data, loading, error, hasData }` signals — replaces hand-rolled `toSignal(obs, { initialValue: undefined })` + `loading = computed(() => sig() === undefined)` patterns |
| C | Public pages — `PublicHome` (6 featured listing skeletons), `PublicSearch` (6 grid skeletons), `PublicListingDetail` (structured 2-column skeleton: gallery + sidebar replaces spinner) |
| D | Dashboard + admin — `DashboardBookings` (4 booking-card skeletons), `AdminListings` (4 queue-item skeletons). Spinners removed |

**Verification:** ESLint clean · `npm run build` 401.77 kB initial / 101.33 kB transfer.

---

### 3.17 — Global error handling + toast service ✅

Stood up the runtime feedback loop so action results, HTTP failures, and uncaught exceptions surface consistently. Inert against mocks today (services use `throwError` directly), wires through automatically once Phase 5 swaps to real HTTP.

| # | Sub-task |
|---|----------|
| A | `ToastService` (`core/services/toast.service.ts`) — signal-backed queue with `success/error/info/warning/dismiss/clear`, per-tone default durations (4–7s), dedupe by `tone+message` so identical errors don't stack |
| B | `Toast` + `ToastContainer` shared components — fixed top-right stack, ARIA `role="alert"` for error/warning vs `role="status"` for success/info, dismiss button. Mounted once in `app.html` |
| C | Functional `errorInterceptor` (`core/error/error-interceptor.ts`) maps `HttpErrorResponse` to toasts: 0 → offline, 401 → session expired, 403 → forbidden, 404 → missing, 5xx → toast + redirect to `/server-error`. Re-throws so callers can still react |
| D | `GlobalErrorHandler` (`core/error/global-error-handler.ts`) for uncaught template/signal/runtime exceptions — logs and shows a generic toast inside `NgZone.run` |
| E | `ServerError` 500 page (`pages/server-error/server-error.ts`) registered at `/server-error` under the public layout, mirroring the existing `NotFound` 404 |
| F | `app.config.ts`: `provideHttpClient(withInterceptors([errorInterceptor]))` + `{ provide: ErrorHandler, useClass: GlobalErrorHandler }` |

**Verification:** ESLint clean · `npm run build` 398.62 kB initial / 101.01 kB transfer.

---

### 3.12 — Public page shells ✅

Wired the public area to the mock services from 3.10 so data flows match what Phase 5 will swap to HTTP.

| # | Sub-task |
|---|----------|
| A | `PublicHome` featured listings via `ListingsService.search({ pageSize: 6 })` (toSignal over observable) |
| B | `PublicSearch` reactive `searchQuery` (computed from filters/sort/query) → `toObservable` → `switchMap(listings.search)` → `toSignal`. Mapped sidebar `SearchFilters` to `ListingSearchQuery` (conditions, prices, verified-only, gear type normalization). Fixed `FilterSidebar` so condition + gear-type pill toggles propagate to the parent `filters` model. |
| C | `PublicListingDetail` driven by single `state` signal (loading / ready / not-found) merging `ListingsService.getById` + `ReviewsService.getByListing`. Spinner during load. |
| D | Lint clean. `npm run build` 374.10 kB initial / 94.76 kB transfer. |

`PublicContact` and `PublicAbout` need no service wiring (contact is a local form; about is static).
