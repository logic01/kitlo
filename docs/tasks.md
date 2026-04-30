# Kitlo — Task Tracker

> Restart instructions: Open this file, check the status column, pick up at the first non-completed item. All feature docs live in `/features`. Brand assets in `/brand`. Docs in `/docs`.

Last updated: 2026-04-29

---

## Phase 0 — Foundation
| # | Task | Status | Notes |
|---|------|--------|-------|
| 0.1 | Define tech stack | ✅ Done | Angular, C# backend, PostgreSQL, Stripe Connect, Cloudinary — see CLAUDE.md |
| 0.2 | Brand design (8 options) | ✅ Done | brand/homepage-1 through 8 |
| 0.3 | Lock brand — Stewardship direction | ✅ Done | brand/brand.md, brand/style.css |

---

## Phase 1 — Research & Product Definition
| # | Task | Status | Notes |
|---|------|--------|-------|
| 1.1 | Research top P2P rental platforms | ✅ Done | Airbnb, Turo, Fat Llama, GeerGarage, Outdoorsy, Spinlister studied |
| 1.2 | Identify key P2P feature requirements | ✅ Done | See P2P findings below |
| 1.3 | Define all user personas | ✅ Done | features/personas.md |
| 1.4 | Map all workflows per persona | ✅ Done | 22 workflows identified |
| 1.5 | Write individual feature .md files | ✅ Done | features/01 through features/22 |
| 1.6 | Iterate and refine all feature files | ✅ Done | Second pass complete — edge cases, cross-links, open questions resolved |

---

## Phase 2 — Design (Next)
| # | Task | Status | Notes |
|---|------|--------|-------|
| 2.1 | Create a pages.md doc that lists every page that needs to be built. The purpose of the page, any API endpoints it will rely on, any component that will need styling and any other usefull detail about the page, such as what each link/button will do. Use the feature files to determine what pages are needed, | ✅ Done | pages.md — 35 pages, 9 areas, ~65 API endpoints |
| 2.2 | Create a visual sitemap so we can understand how all the pages are connected in the workflow | ✅ Done | sitemap.html — 5-column visual with 4 flow diagrams |
| 2.3 | Design component library (shadcn + style.css). Use the pages.md to find similar components and create the proper styles for them in style.css, it should follow our brand and use example.html styling as the base.| ✅ Done | brand/style.css — sections 1–44, 25 new component groups |
| 2.4 | Create a template.html that uses the style.css and shows all the compnents so I can verify the look/feel.  | ✅ Done | brand/template.html — 27 sections, all components demonstrated |
| 2.5 | Design all page layouts (wireframes or HTML) and place them into a ./wireframe folder. | ✅ Done | brand/layouts/ — 9 HTML files covering all 35 pages from pages.md (continued the 01-public.html pattern already in place); see brand/layouts/index.html for navigator |
| 2.6 | Design mobile views | ✅ Done | brand/layouts/mobile/ — 6 HTML files, ~30 phone-frame screens; bottom-tab nav, filter/booking sheets, single-step wizard pattern |

## Phase 3 — Frontend Development (Next)

> **Goal of Phase 3**: a runnable Angular site that walks through every persona's full workflow using in-memory mock data — no backend, no Stripe, no Cloudinary, no real WebSocket. Real integrations move to Phase 5.

### Foundation
| # | Task | Status | Notes |
|---|------|--------|-------|
| 3.1 | Verify Angular project setup |  ✅ Done | Angular 21.2, TS 5.9 strict, Tailwind v4 via @tailwindcss/postcss, ESLint flat config (angular-eslint 21.3), Prettier, environments/ wired with fileReplacements. Build/lint/test all clean. |
| 3.2 | Port brand/style.css design tokens into Tailwind theme |  ✅ Done | Tokens from docs/layouts/style.css §1 mapped into Tailwind v4 `@theme` block in src/styles.css (colors, fonts, type scale w/ line-height + tracking, radius). Non-Tailwind tokens (max-width, page-gutter, transitions) kept as `:root` vars. Smoke-tested in app.html with brand utilities. |
| 3.3 | Identify common components across pages |  ✅ Done | docs/components.md — 60+ components across 7 categories with selector, style.css mapping, inputs/outputs, build order. |
| 3.4 | Build shared component library |  ✅ Done | 47 components in frontend/src/app/shared (foundation, layout & nav, cards, forms, data display, feedback, marketing) + 3 pipes + 5 domain model files. RoleSwitcher deferred to 3.8 (depends on AuthService). Stripe/Cloudinary/Map all stubbed for Phase 5 swap. |
| 3.5 | Build layout components |  ✅ Done | src/app/layouts — PublicLayout (TopNav + Footer), AuthenticatedLayout (TopNav + Sidebar w/ default renter items), AdminLayout (admin sidebar items), MobileLayout (MobileTabBar). All render `<router-outlet />` and consume from `app/shared`. |

### Routing, State, and Mock Auth
| # | Task | Status | Notes |
|---|------|--------|-------|
| 3.6 | Set up routing with auth + role guards |  ⬜ Pending | frontend/src/app/app.routes.ts — lazy-loaded feature areas: public/, auth/, dashboard/, lister/, admin/. AuthGuard + RoleGuard read from mock AuthService (localStorage flag for current user + role). Real JWT validation deferred to Phase 5. |
| 3.7 | Scaffold state management |  ⬜ Pending | Pick signals (preferred for Angular 18+) or NgRx and stand up stores for: currentUser, listings, bookings, messages, notifications. Even with mock data, pages should consume from stores so the Phase 5 swap-out is mechanical. |
| 3.8 | Mock AuthService with role switcher |  ⬜ Pending | frontend/src/app/core/services/auth.service.ts — login/logout/signup write a fake user + role to localStorage, no JWT. Add a dev-only role switcher (Renter / Lister / Admin / Logged-out) so workflows can be walked through without re-signup. This is the single source of truth for auth — pages must not stub their own. |

### Mock Data Layer
| # | Task | Status | Notes |
|---|------|--------|-------|
| 3.9 | Create mock data fixtures |  ⬜ Pending | frontend/src/app/core/mock-data — JSON or TS fixtures for users, listings (incl. bundles), bookings (every state), messages, reviews, disputes, payouts, notifications, admin queues. Realistic enough to walk every workflow. |
| 3.10 | Build core services backed by in-memory mocks |  ⬜ Pending | frontend/src/app/core/services — ListingsService, BookingsService, UsersService, MessagesService, ReviewsService, DisputesService, PayoutsService, NotificationsService, AdminService. Method signatures and return types match the planned backend API contract from pages.md so Phase 5 only swaps the implementation. |
| 3.11 | Translate brand/layouts/*.html wireframes into Angular templates |  ⬜ Pending | Convert brand/layouts/01-public.html through 09-static-legal.html (and brand/layouts/mobile/) into Angular component templates. The wireframes are the visual ground truth — pages in 3.12–3.16 build on top of these. |

### Page Shells with Mocks
| # | Task | Status | Notes |
|---|------|--------|-------|
| 3.12 | Public page shells |  ⬜ Pending | /home, /search, /listing/:id, /contact, /about. Consume ListingsService (mock). Search filters work against in-memory data. |
| 3.13 | Auth flow page shells |  ⬜ Pending | /auth/login, /auth/signup, /auth/forgot-password, /auth/verify-email. Forms validate; submission goes through mock AuthService from 3.8. |
| 3.14 | Renter dashboard page shells |  ⬜ Pending | /dashboard/bookings, /dashboard/messages, /dashboard/profile, /dashboard/reviews, /dashboard/notifications, /booking/:id (request → checkout → active → return → review). Stub StripePaymentForm at checkout. |
| 3.15 | Lister dashboard page shells |  ⬜ Pending | /dashboard/listings, /dashboard/listings/new (incl. bundle), /dashboard/earnings, /dashboard/setup-onboarding, /dashboard/bank-account. Stub PhotoUpload (Cloudinary) and Stripe Connect onboarding redirect. |
| 3.16 | Admin dashboard page shells |  ⬜ Pending | /admin/listings (review queue), /admin/disputes, /admin/users, /admin/payouts. All actions mutate in-memory mock data. |

### Cross-cutting UX
| # | Task | Status | Notes |
|---|------|--------|-------|
| 3.17 | Global error handling + toast service |  ⬜ Pending | ErrorInterceptor, global ErrorHandler, ToastService for action feedback (success/error/info). 404 + 500 pages. |
| 3.18 | Loading states + skeleton patterns |  ⬜ Pending | Skeleton component variants for ListingCard, ProfileHeader, table rows. Shared loading directive or signal pattern. |
| 3.19 | Form validators + error display patterns |  ⬜ Pending | Reactive forms, custom validators (ZIP, daily rate, photo count, date range). Standardized field-error display. |
| 3.20 | URL query-string sync for search filters |  ⬜ Pending | /search filters (location, category, price, dates) reflect to URL params so results are shareable and browser back/forward works. |

### Verification & Testing
| # | Task | Status | Notes |
|---|------|--------|-------|
| 3.21 | Unit tests for components & services |  ⬜ Pending | frontend/src — Tests for shared components, mock services, guards, validators. Target 80%+ coverage on shared + core. `npm test`. |
| 3.22 | E2E tests for critical workflows |  ⬜ Pending | frontend/e2e — Cypress or Playwright. Cover: signup → verify → create listing, search → book → checkout → return → review, dispute filing, admin review queue. Runs entirely against mocks. |
| 3.23 | Lint & type checking |  ⬜ Pending | `npm run lint` (ESLint) clean, strict TypeScript with no errors, Prettier formatted. |
| 3.24 | Build production bundle |  ⬜ Pending | `npm run build` — no errors, no console warnings, performance budget set in angular.json. |
| 3.25 | Manual workflow walkthrough (THE Phase 3 acceptance gate) |  ⬜ Pending | Run `npm start`. Using the dev role switcher, walk every workflow in features/01–22 end-to-end against mocks. Verify desktop + mobile (devtools). Document any gaps before declaring Phase 3 done. |
| 3.26 | Accessibility audit |  ⬜ Pending | axe + Lighthouse on key pages. ARIA labels, keyboard nav, color contrast. Fix high-priority issues. |

---

## Phase 4 — Backend Development & Database

### Database Setup
| # | Task | Status | Notes |
|---|------|--------|-------|
| 4.1 | Scaffold C# .NET project |  ⬜ Pending | backend/ — ASP.NET Core 8+ Web API, Entity Framework Core, PostgreSQL provider, project structure (Controllers/, Services/, Models/, Data/). |
| 4.2 | Create Entity Framework Core models |  ⬜ Pending | backend/Kitlo.Core — User, Listing+Photos+Specs, Bundle, AvailabilityBlock, Booking + BookingEvent (state machine), Payment, Payout, MessageThread+Message, Review (blind two-way), Dispute, Notification + Preferences, AdminAction audit log, Report. All money in cents. |
| 4.3 | Configure PostgreSQL & migrations |  ⬜ Pending | backend/Kitlo.Data — DbContext, connection string via appsettings.json, initial migration. Run `dotnet ef database update` to create schema. |
| 4.4 | Seed initial data |  ⬜ Pending | Sample users, listings, categories for testing. Can be disabled in production. |

### Authentication & Authorization
| # | Task | Status | Notes |
|---|------|--------|-------|
| 4.5 | JWT authentication service |  ⬜ Pending | backend/Kitlo.Api/Services/AuthService — Generate JWT tokens, validate signatures, refresh token flow. Configuration via appsettings.json. |
| 4.6 | Auth middleware & route protection |  ⬜ Pending | backend/Kitlo.Api/Middleware — JWT validation middleware, role-based authorization (User/Lister/Admin), [Authorize] attributes on controllers. |
| 4.7 | Auth API endpoints |  ⬜ Pending | POST /api/auth/login, POST /api/auth/signup, POST /api/auth/refresh, POST /api/auth/logout. Password hashing with bcrypt or ASP.NET Identity. |

### Core API Services
| # | Task | Status | Notes |
|---|------|--------|-------|
| 4.8 | Listings API (CRUD) |  ⬜ Pending | GET /api/listings (search/filter), POST /api/listings (create), GET /api/listings/{id}, PUT /api/listings/{id}, DELETE /api/listings/{id}, POST /api/listings/{id}/photos, GET /api/listings/{id}/availability. |
| 4.9 | Users API |  ⬜ Pending | GET /api/users/me, PUT /api/users/{id}, GET /api/users/{id}/profile, GET /api/users/{id}/ratings. |
| 4.10 | Bookings API |  ⬜ Pending | GET /api/bookings, POST /api/bookings (create), GET /api/bookings/{id}, PUT /api/bookings/{id}/status (confirm, cancel, return), GET /api/bookings/{id}/timeline. |
| 4.11 | Search & discovery API |  ⬜ Pending | GET /api/listings?location=&category=&priceMin=&priceMax=&availability=. Full-text search, geolocation filtering. |

### Payment & Stripe Integration
| # | Task | Status | Notes |
|---|------|--------|-------|
| 4.12 | Stripe Connect setup |  ⬜ Pending | backend/Kitlo.Api/Services/StripeService — Account onboarding links, identity verification URLs, payment intents. Configuration via Stripe keys. |
| 4.13 | Payment flow endpoints |  ⬜ Pending | POST /api/payments/intent, POST /api/payments/confirm, POST /api/payments/refund. Two-PI pattern (charge + manual-capture). |
| 4.14 | Stripe webhook receiver |  ⬜ Pending | POST /api/webhooks/stripe — Handle identity.verification.session.completed, account.updated, payment_intent events, transfer events, dispute events. |
| 4.15 | Payouts logic |  ⬜ Pending | backend/Kitlo.Api/Services/PayoutService — Calculate earnings minus platform fee, release funds to lister bank account, track payout history. |

### Additional Features
| # | Task | Status | Notes |
|---|------|--------|-------|
| 4.16 | Messaging API |  ⬜ Pending | POST /api/messages, GET /api/messages/threads, GET /api/messages/threads/{threadId}. Real-time updates via WebSocket or polling. |
| 4.17 | Reviews & ratings API |  ⬜ Pending | POST /api/reviews, GET /api/reviews?userId=, GET /api/listings/{id}/reviews. Blind two-way reviews (each party rates, not visible until both done). |
| 4.18 | Dispute resolution API |  ⬜ Pending | POST /api/disputes, GET /api/disputes/{id}, PUT /api/disputes/{id}/resolution. Evidence upload, admin approval. |
| 4.19 | Notifications API |  ⬜ Pending | GET /api/notifications, PUT /api/notifications/{id}/read, DELETE /api/notifications/{id}. Background job for email/push delivery. |
| 4.20 | Admin API |  ⬜ Pending | GET /api/admin/listings (review queue), GET /api/admin/disputes, GET /api/admin/users, PUT /api/admin/users/{id}/status (suspend/ban), GET /api/admin/payouts. |

---

## Phase 5 — Integration (Frontend ↔ Backend & Third-Party)

> Phase 3 ships with mocks and stubs so the site is walkable without a backend. Phase 5 replaces those one-by-one once Phase 4 is live.

| # | Task | Status | Notes |
|---|------|--------|-------|
| 5.1 | HTTP client + JWT interceptor |  ⬜ Pending | frontend/src/app/core/http — real API client, JWT injection, refresh-token flow, error mapping to ToastService. |
| 5.2 | Swap mock services for live API calls |  ⬜ Pending | Replace in-memory implementations in core/services with HTTP-backed ones. Service signatures already match — should be mechanical. Remove core/mock-data. |
| 5.3 | Real AuthService + guards |  ⬜ Pending | Replace mock AuthService from 3.8 with real JWT login, signup, refresh. Remove dev role switcher (or gate behind env flag). |
| 5.4 | Stripe Elements integration |  ⬜ Pending | Replace StripePaymentForm stub from 3.4 with Stripe Elements (card collection, PaymentIntent confirm). Stripe Connect onboarding redirect for listers. |
| 5.5 | Cloudinary upload integration |  ⬜ Pending | Replace PhotoUpload stub with real Cloudinary uploader (signed uploads). Wire to listing photos and avatars. Add responsive srcset helpers. |
| 5.6 | Real-time messaging client |  ⬜ Pending | Replace polled mock chat with WebSocket/SignalR client against backend (4.16). Online presence, typing indicators if scoped. |
| 5.7 | Map / location component |  ⬜ Pending | Replace MapView stub with Mapbox or Leaflet. Pickup-location display on listing detail, map view on search. ZIP/proximity filtering against backend. |
| 5.8 | E2E tests against real backend |  ⬜ Pending | Re-run Cypress/Playwright suite from 3.22 with backend running. Add happy-path Stripe test mode and Cloudinary test bucket. |
| 5.9 | Production deployment |  ⬜ Pending | Backend container deploy, frontend host (Vercel/Netlify/self-hosted — TBD), domain, env-var injection, smoke tests. |

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
- **Bundle listing** — thermal + NV in one booking. No competitor offers this.
- **Condition rating system** — Mint / Field-Ready / Battle-Scarred. Honest, specific to field gear.
- **Verified Hunter badge** — ID-verified listers build community trust in a trust-insular market.
- **Spec-first listing cards** — hunters evaluate on specs (resolution, detection range, magnification), not marketing copy.

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
| features/22-bundle-listing.md | Create and book thermal+NV bundle | Lister + Renter |

---

## Open Questions (cross-cutting)
- [ ] Do we require lister approval on every booking, or default to instant book?
- [ ] What is Kitlo's take rate? (industry range: 5–20% from renter, 10–20% from lister)
- [ ] Minimum rental period? (suggest: 1 day minimum, 30-day maximum per booking)
- [ ] Extension policy: how long can a rental be extended, and does the deposit increase?
- [ ] International renters: US-only for Phase 1?
- [ ] Does Kitlo charge a membership/subscription, or purely transaction-based?
- [ ] What is the grace period for late returns before a late fee kicks in?
