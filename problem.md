# Kitlo — Bug & Gap Audit

Audit of all implemented workflows. Findings are grouped by area and severity. "Severity" reflects user-visible impact: **Critical** breaks the workflow end-to-end, **High** corrupts data or silently drops user intent, **Medium** is a dead button or wrong info, **Low** is cosmetic / hardcoded copy.

Date of audit: 2026-05-01

---

## 1. Booking Workflow (renter)

### Critical

1. **`PublicListingDetail` never wires up the booking sidebar.** `frontend/src/app/features/public/pages/listing-detail/listing-detail.ts:156` renders `<app-booking-sidebar [listing]="l" />` but does not subscribe to its `(book)` output. Clicking **"Request this gear"** does nothing. The renter cannot start a booking from a listing.
2. **`booking-checkout.ts` is hardcoded.** The component reads no route param, ignores any selected listing/dates, and posts a hardcoded `listingId: 'lst-001'`, `startDate: '2026-10-15'`, `endDate: '2026-10-19'`, `totalCents: 39200` to `BookingsService.create()` (`frontend/src/app/features/dashboard/pages/booking-checkout/booking-checkout.ts:111-127`). Real bookings can never be created from this UI.
3. **`booking-request.ts` hardcodes a 4-night window** (`nights = 4`, `Wed, Oct 15 → Sun, Oct 19`) and offers no date picker (`frontend/src/app/features/dashboard/pages/booking-request/booking-request.ts:39-43,98`). User cannot pick dates. Continue button navigates to `'/booking/bk-new-${l.id}/checkout'` — a fake id the checkout page never reads anyway.
4. **No PaymentIntent is created during checkout.** `<app-stripe-payment-form>` is mounted with `[amountCents]` but `[clientSecret]` is never passed (`booking-checkout.ts:54`). Inside `StripePaymentForm.onSubmit`, the missing client secret triggers `errorMessage.set('No PaymentIntent client secret provided.')` (`stripe-payment-form.ts:106-108`). And the `(submitted)` output is not subscribed to either. Even with a real Stripe key, payment cannot be completed.
5. **"Confirm booking" button calls `BookingsService.create()` only — no payment.** `booking-checkout.ts:111-127` never calls `POST /api/payments/intent` or `/payments/confirm`. The PaymentsController endpoints are completely unreachable from the UI.

### High

6. **`BookingService.CreateAsync` race condition (backend).** `backend/Kitlo.Api/Services/BookingService.cs:54-115` checks for date conflicts in-memory then inserts a fresh `AvailabilityBlock`. With concurrent renters there is no DB-level uniqueness constraint or transaction-level locking on the date range, so two booking requests for the same dates can both succeed.
7. **Bookings tab "Upcoming" filter excludes pending requests.** `frontend/src/app/features/dashboard/pages/bookings/bookings.ts:15-20` maps `upcoming → ['confirmed']`. A renter who just submitted a request (status `pending`) sees nothing under Upcoming.
8. **`booking-confirmed.ts` is fully hardcoded.** Marcus T., 7:30 AM, Boulder REI, fake phone, fake event timeline (`frontend/src/app/features/dashboard/pages/booking-confirmed/booking-confirmed.ts:19-50`). Reads no route param, fetches no real booking.

### Medium

9. **`DashboardBookingDetail` "Message {{ counterpartyName }}" header button has no click handler** (`booking-detail.ts:40`). Same for the inline "Message" button at line 69 (the one inside the counterparty card uses `routerLink` and works).
10. **No state-transition buttons on booking detail.** Backend supports `confirm`, `pickup`, `return`, `complete` (`BookingService.TransitionAsync`) but the booking-detail UI never exposes any of them. Listers can't accept a booking; neither party can confirm pickup or return; the booking can never advance past `pending`.
11. **"Member since 2025 · ★ 4.8" hardcoded** in `booking-detail.ts:67` regardless of the actual counterparty.

---

## 2. Auth Workflow

### High

12. **Signup intent `'both'` is silently coerced to `Renter`.** `backend/Kitlo.Api/Services/UserService.cs:28-32` switches on `"lister" → Lister`, default → `Renter`. The signup wizard offers "Both" and sends `intent: 'both'` (`frontend/.../signup/signup.ts:198-202`) — backend treats it as renter, so users who want to lister-and-rent get a renter-only account and silently fail role-guarded routes.
13. **Signup never sends city/state/avatar.** `signup.ts:232-240` collects `firstName`, `lastName`, `location` (city, state) but the `auth.signup()` payload only sends `name/email/password/intent`. The location field is captured then discarded. New accounts have empty `city`/`state`, which breaks `getOnboardingStatus()` (which checks `!!me?.city && !!me?.state`).
14. **Forgot-password is fake.** `frontend/src/app/features/auth/pages/forgot-password/forgot-password.ts:60-64` simulates the flow with `setTimeout(250)`. There is no backend endpoint for password reset and no email sent. Users cannot recover their password.
15. **Email verification is decorative.** `auth/pages/verify-email/verify-email.ts` is a static "Check your email" page. No verification token is generated, no email sent, no endpoint exists. The `User.IdentityVerified` flag is never flipped.
16. **Refresh-token endpoint is a permanent 401.** `AuthController.Refresh` (`backend/Kitlo.Api/Controllers/AuthController.cs:39-41`) always returns 401. When the access token expires, the user is unconditionally signed out — there's no recovery path.

### Medium

17. **OAuth buttons are dead.** `auth/pages/login/login.ts:23-28` and `signup.ts:36-37` render "Continue with Google" and "Continue with Apple" buttons with no `(click)` handler. Clicking them does nothing.
18. **"Upload photo" / "Skip" buttons in signup step 2** (`signup.ts:90-91`) have no click handler. The avatar upload flow is unreachable.
19. **`authGuard` only checks `currentUser` signal**, not access-token validity (`frontend/src/app/core/guards/auth.guard.ts:9`). On token expiry the user keeps navigating into `/dashboard` until the first 401 from a backend call. UX is acceptable but a stale-localStorage user can navigate to authenticated pages.
20. **`AuthService.switchTo()` and `SEED_USERS`** (`auth.service.ts:10-23,101-109`) bypass real auth in dev. The role-switcher is gated by `environment.production`, but the seeded users have IDs like `'u-renter-1'` that don't exist in the DB — any backend call after switching produces 404/401 cascade.
21. **`Restricted` user status not enforced on login.** `UserService.LoginAsync:57` blocks only `Suspended/Banned`. A "restricted" user can log in identically to an active one — there's no UI surfacing for the restriction either.

---

## 3. Listing Workflow (lister)

### Critical

22. **"My listings" returns nothing.** `ListingsService.getMine()` (`frontend/src/app/core/services/listings.service.ts:203-211`) explicitly returns `[]` because the backend has no `?listerId=` filter. The dashboard "My listings" page works around this by filtering `search()` results by `listerName` string match (`dashboard/pages/listings/listings.ts:74-77`) — fragile if two listers share a name, and breaks the dashboard's `getMine` callers entirely.
23. **Bundle creation does not actually mark the listing as a bundle.** `bundle-create.ts:142-143` calls `listings.update(draft.id, { isBundle: true, bundleListingIds: [...] })`, but `ListingsService.update()` (`listings.service.ts:229-239`) doesn't include `isBundle` or `bundleListingIds` in the PUT body, and `UpdateListingRequest` (`backend/Kitlo.Api/Models/Dtos.cs:90-97`) doesn't accept either field. The bundle is silently saved as a regular listing.
24. **Listing-create cannot succeed because no photos are uploaded.** `listing-create.ts:105` mounts `<app-upload-zone />` with no `(filesAdded)` handler. The publish flow (`listing-create.ts:251-314`) creates a draft, sets price, then calls `publish()` — but backend requires ≥3 photos (`ListingService.PublishAsync:133-134`). Publish always fails with "At least 3 photos required to publish."
25. **Listing-create never collects a description.** It posts `description: ''` (`listings.service.ts:221`) and never patches it later. Published listings are blank.

### High

26. **Listing-create's photo step has no model.** `<app-upload-zone />` emits `(filesAdded)` but no consumer; same in `listing-edit.ts:71`. The file picker accepts files and silently drops them.
27. **"Pricing" daily-rate validator threshold mismatch.** The validator is configured `kitloValidators.dailyRate({ minCents: 100 })` → `minDollars = 1` (`forms/validators.ts:29`). Form input is in dollars and the user must enter at least `$1.00`. Combined with `Validators.required`, the initial form value `0` actually fails `min` *and* `required`, so the form is invalid by default — but it's also not surfaced as an error until touched.
28. **`AdminService.ListingQueue` is permanently empty.** Backend filters by `Status == ListingStatus.PendingReview` (`AdminService.cs:25-29`) but no flow ever sets a listing to `PendingReview`. `ListingService.PublishAsync:140` jumps from `Draft → Published` directly. The high-value-review queue is unreachable.
29. **Listing card "rowStatus" is fake.** `dashboard/pages/listings/listings.ts:80-83` invents `rowStatus`, `bookingsCount`, and `monthlyEarningsCents` from the row index. The lister sees fabricated data on every listing.
30. **`AdminListingDetail.reject()` and `requestChanges()` hardcode their reasons** (`'Does not meet listing standards'`, `['photos', 'description']`). No UI for the admin to enter a real reason (`features/admin/pages/listing-detail/listing-detail.ts:163-181`).
31. **Listing-create publish flow is brittle.** Three sequential API calls (`create → update → publish`); if the middle one fails, a draft listing is orphaned with no rate/policy and no UI recovery (`listing-create.ts:284-308`).

### Medium

32. **`AvailabilityCalendar` page uses mock data.** `dashboard/pages/availability-calendar/availability-calendar.ts:10-39` reads from `MOCK_LISTINGS` instead of the real listing. The "Save" button (line 22) has no click handler. No connection to backend `AvailabilityBlock`.
33. **Listing-edit "Pause listing" button has no click handler** (`listing-edit.ts:74`). Backend has no pause endpoint anyway.
34. **`AdminListingDetail` shows "14 prior listings" hardcoded** (`listing-detail.ts:99`) regardless of the lister.

---

## 4. Payment / Stripe / Payouts

### Critical

35. **Payouts are never created.** `PayoutService.CreatePayoutAsync` exists but is never called. `BookingService.TransitionAsync` to `Returned` or `Completed` does not enqueue a payout. The Earnings page and admin Payouts table are always empty in real use. (`Grep` for `CreatePayoutAsync` shows zero call sites outside the service itself.)
36. **`StripeService` is entirely scaffold.** Documented as such, but the consequence is that no real money moves. `CreatePaymentIntentAsync` writes fake `pi_test_*` ids; `ConfirmAsync` flips status to Captured/Authorized without contacting Stripe; `RefundAsync` only updates the DB row; `HandleWebhookAsync` is a no-op (no signature verification). Phase 5.2/5.4 says "Partial" — but downstream code (cancel preview, dispute resolution) assumes payments and refunds work.

### High

37. **`StripeService.RefundAsync` has no authorization.** `PaymentsController.Refund` (`backend/Kitlo.Api/Controllers/PaymentsController.cs:28-33`) is `[Authorize]` only — any authenticated user can refund any payment by id. There's also no validation that `amountCents` is positive (`StripeService.cs:90-101`).
38. **`StripeService.RefundAsync` will overcount on partial refunds.** Line 95: `RefundedCents = Math.min(AmountCents, RefundedCents + refund)`. If the caller passes the full amount twice, the second call silently caps at the original — but the response gives no signal that nothing happened. Combined with no auth, this is a footgun.
39. **Setup-onboarding "Continue to Stripe →" button is dead.** `setup-onboarding.ts:114-116` has no click handler. Users cannot reach `StripeConnectController.Onboarding`. The "Verify ID" step is also pure UI; no Stripe Identity call.
40. **`bank-account.ts` is entirely static.** "Chase ending in 4421" hardcoded; "Update via Stripe" / "Disconnect" buttons have no click handlers. There's no way to manage the connected bank.
41. **`AdminPayouts` page calls a lister-scoped endpoint.** `PayoutsController` requires the Lister policy and filters by `User.RequireUserId()` (`PayoutsController.cs:11,20,24`). The admin sees only their own payouts (likely none). No admin-wide payouts endpoint exists.
42. **Cancel-preview is computed client-side from policy + dates** (`bookings.service.ts:182-205`) but ignores the actual booking's cancellation policy (it derives policy from "hours until start"). The label on `booking-cancel.ts` reflects the synthesized policy, not what the user agreed to at booking time.

### Medium

43. **Earnings page assumes backend payouts** which never exist (see #35), so all four StatCards always read $0. No empty-state messaging.

---

## 5. Disputes

### High

44. **Dispute reason `Other` round-trip is wrong.** `DisputeReason.Other = 99` in the backend (`Kitlo.Core/Enums/Enums.cs:125`), but the frontend's `REASONS = [..., 'other']` puts `other` at index 4 (`disputes.service.ts:65`). Filing with reason `other` posts `4`, which `System.Text.Json` deserializes into `(DisputeReason)4` (an *invalid* enum value). The DB stores `4`. On re-read, frontend `REASONS[4]` returns `'other'` by coincidence — but any other code that switches on `DisputeReason.Other` (= 99) will mis-classify these rows.
45. **`DisputeService.GetAsync` has no authorization check.** `backend/Kitlo.Api/Services/DisputeService.cs:42-50` returns any dispute by id to any authenticated caller. A renter can read someone else's dispute by guessing the GUID.
46. **`DisputeService.AddEvidenceAsync` does not verify the actor is a party.** `DisputeService.cs:52-71` accepts evidence from any authenticated user. Anyone with a dispute id can pollute the evidence trail.
47. **Frontend `DisputesService.list({ status: [...] })` only sends the first status** (`disputes.service.ts:115-116`) — and the endpoint requires admin policy anyway, so any non-admin caller (e.g. a future "view my disputes" page) gets 403.
48. **`AdminDisputeDetail` hardcodes the counterparty** (`features/admin/pages/dispute-detail/dispute-detail.ts:91-97`). The dispute DTO doesn't carry the booking's both-party info, so the admin sees "Counterparty" with no name.
49. **`AdminDisputeDetail` "Message parties" button is dead** (line 32). `AdminService.messageDisputeParty()` is also a stub returning `of(undefined)` (`admin.service.ts:173-175`).
50. **`AdminService.reopenDispute()` is a stub** returning `of({} as Dispute)` (`admin.service.ts:177-179`). No backend endpoint exists.
51. **`DisputeService.ResolveAsync` always sets booking status to `Cancelled` or `Completed`.** A `Split` resolution maps to `Cancelled`, but if the rental has already happened (active/returned), forcing `Cancelled` is wrong — funds should partially release, not unwind the rental. (`DisputeService.cs:88-93`)

---

## 6. Reviews

### High

52. **`DashboardReviews` "Received" tab uses mock data.** `features/dashboard/pages/reviews/reviews.ts:39-43` iterates `MOCK_REVIEWS_BY_LISTING` to fetch reviews — a real lister sees reviews for hardcoded listing IDs from mocks.
53. **`DashboardReviews` "Given" tab calls the wrong endpoint.** `getByUser(userId)` returns reviews where `RevieweeId == userId` (i.e. reviews *received*). To show reviews the user *gave*, the backend would need a `?reviewerId=` filter (which doesn't exist).
54. **`DashboardLeaveReview` fabricates `listingId`.** `leave-review.ts:129` computes `listingId = 'lst-' + bookingId`. Backend ignores it (uses `booking.ListingId`), but it's misleading and would break if the field were ever consumed.
55. **Blind-review reveal has no expiry job.** `ReviewService.SubmitAsync` sets `VisibleAt = now + 14 days` for the first reviewer (`backend/Kitlo.Api/Services/ReviewService.cs:61`). If the counterparty never reviews, the review still won't surface in `GetByListingAsync` until the wallclock catches up — but there's no background process; the queries do honor `VisibleAt <= now`, so this works passively. **Update**: actually fine since the queries filter by `VisibleAt <= now`. Lower severity.
56. **`UpdateAggregatesAsync` doesn't update user-level aggregate.** `ReviewService.cs:119-135` only updates the *listing's* `RatingAverage/RatingCount`. The user's rating is recomputed live by `GetRatingAggregateAsync` — fine, but the public profile DTO will show 0/0 if a user has reviews on listings that have since been archived (since the listing-level rating drives some UIs).

---

## 7. Messaging

### Critical

57. **There is no way to start a thread.** `MessageService.StartThreadAsync` exists but is not exposed in `MessagesController`. After a booking is made, no thread is auto-created. The "Message {lister}" buttons that are actually wired (e.g. profile pages) have no handlers anyway. Renters and listers cannot communicate.

### High

58. **SignalR client is dead code.** `MessagesHubClient` (`frontend/src/app/core/realtime/messages-hub.client.ts`) is only imported by itself — `Grep` finds zero callers. `messages-thread.ts:113` calls `sendMessage()` and updates the local list, but the other party doesn't see the message until they refetch. Real-time delivery doesn't actually happen.
59. **`MessageService.ListThreadsAsync` doesn't include messages**, so `ToDto`'s unread-count (`MessageService.cs:104`) always reads from an empty `t.Messages` collection and returns 0. Inbox always shows zero unread.
60. **Sending message has no length cap.** `SendMessageRequest.Body` is unconstrained; backend trims and truncates the preview to 280 chars but stores the full body. A 10MB string would persist.
61. **`MessagesService.uploadAttachment()` returns a placeholder** unconditionally (`messages.service.ts:88-90`). Attachment UI doesn't exist anyway.
62. **Thread fetch via list-and-find** (`messages-thread.ts:79-83`) — every thread page load fetches *all* threads to find one. O(n) per navigation.

---

## 8. Notifications

### Critical

63. **`NotificationService.EnqueueAsync` is never called.** No domain event (booking confirmed, payout released, dispute filed, etc.) creates a notification. `Grep` confirms zero call sites outside the service itself. The notifications page is permanently empty for real users.

### Medium

64. **Notification preference toggles overwrite each other.** Frontend has 3 email toggles + 2 push toggles + 1 SMS (`UsersService.NotificationPreferences`). Backend has 3 channel flags (`emailEnabled`, `pushEnabled`, `smsEnabled`). The collapser (`users.service.ts:117-124`) sets `emailEnabled = any(emailBookingUpdates, emailMessages, emailMarketing)`. Toggling off "marketing" while keeping bookings on writes `emailEnabled=true` — then on next page load all three toggles read as `true` again. Toggling off "marketing" appears to fail.
65. **Notification `link` may be null but `[routerLink]` binding doesn't guard** (`notifications/notifications.ts:26`). If link is null/empty, Angular's RouterLink stays inert and clicking does nothing visible; mostly harmless but the row still has `(click)="markRead()"` so the read flag updates, leaving the user stuck on the page wondering why nothing happened.

---

## 9. Admin

### High

66. **`AdminService.getUserRecord()` returns a placeholder, not the real user.** `frontend/src/app/core/services/admin.service.ts:203-209` does a fake `forkJoin` of `/users/me` and then *ignores* the result, returning a stub with empty `name`/`email`. The admin user-detail page therefore shows blanks for the user's identity. There's no `GET /api/admin/users/{id}` on the backend.
67. **Admin "warn" doesn't actually warn.** `AdminService.cs:84` (`case "warn"`) only writes the AdminAction log; the user's `Status` is not updated and there's no `UserStatus.Warned`. There's also no warning counter on the user record. The frontend `UserAdminRecord.warnings` is hardcoded `0`.
68. **`AdminService.searchUsers` returns `status: 'active'` for everyone** (`admin.service.ts:195`). The backend `UserDto` doesn't expose `Status`, so the admin can't see who's suspended/banned/restricted from the users list.
69. **`AdminController` has no DELETE/disable for listings**, no flag to push a listing into `PendingReview`, no per-user activity feed. The admin user-detail "Activity (latest 10)" list is hardcoded mock data (`features/admin/pages/user-detail/user-detail.ts:134-138`).
70. **Admin user-detail action reasons are hardcoded**: "Inappropriate behavior", "Repeated violations", "Severe violation" (`user-detail.ts:140-152`). No UI for the admin to enter the reason.
71. **`escalateListing`, `reopenDispute`, `messageDisputeParty`, `getVerificationQueue` are all stubs** in `admin.service.ts:136-139, 173-184`. The corresponding admin actions silently succeed.
72. **`AdminHome` has hardcoded SLA banners** linking to `/admin/disputes/dp-001` (`features/admin/pages/home/home.ts:18-25`). That id doesn't exist in the backend; clicking the link 404s.
73. **`AdminHome` "Active rentals: 142" / "$48K in escrow" hardcoded** (`home.ts:32`). No backend metric.

---

## 10. Public Pages

### Medium

74. **Listing detail "View profile" link uses lister NAME as id.** `routerLink="/users/{{ l.listerName }}"` (`features/public/pages/listing-detail/listing-detail.ts:116`). The public routes don't define `/users/:id` — only `/dashboard/users/:id` (auth-only). Public viewers always 404.
75. **Public listing detail "Report this listing" is a `href="#"`** (`listing-detail.ts:150`). Anchor with no destination.
76. **Public listing detail's `<app-availability-calendar mode="select-range" />` is shown but doesn't drive the booking.** No `[(selectedRange)]` binding; the BookingSidebar's range model is independent (and the sidebar's button is dead anyway — see #1).
77. **Search "Map view" button is dead** (`features/public/pages/search/search.ts:63`). The `MapView` component exists but is never imported by any feature page.
78. **Search "Load more" button is dead** (`search.ts:110`). Pagination not wired.
79. **`PublicContact` form silently resets on submit.** `features/public/pages/contact/contact.ts:54-57` calls `this.form.reset()` and that's it. There's no contact endpoint backend-side and no toast confirmation. Users get the impression the form failed.
80. **List-your-gear stats are hardcoded** ("$2,840", "12% take rate", "3 days") (`features/public/pages/list-your-gear/list-your-gear.ts:27-29`).

---

## 11. Profile / Account

### High

81. **Profile "Bio" field is captured but never saved.** `features/dashboard/pages/profile/profile.ts:46,107,127` includes a `bio` form control; `UpdateUserRequest` has no `bio` field. Submit succeeds but the bio is dropped.
82. **"Change password" / "Export my data" / "Delete account" buttons all dead** (`profile.ts:83-85`).
83. **"Change photo" button dead** (`profile.ts:28`). `UsersService.uploadProfilePhoto()` returns a placehold.co URL unconditionally (`users.service.ts:190-193`).
84. **Profile location parsing is fragile.** Splitting on `,` and trimming (`profile.ts:127`) breaks if a user has e.g. "St. Louis, MO" — though this works in the simple case, no normalization.

---

## 12. Backend / Cross-cutting

### High

85. **No HTTPS redirection.** `Program.cs` doesn't call `UseHttpsRedirection`. Production deploys leak tokens over HTTP.
86. **CORS hardcoded to `localhost:4200`.** `Program.cs:84` only allows the dev origin; production frontend would be CORS-blocked.
87. **No rate limiting.** Login, signup, refresh, dispute filing — no `AddRateLimiter`. Brute-forcing accounts is uncapped.
88. **No request body size cap.** `SendMessageRequest` and `SubmitReviewRequest` (text fields) have no `MaxLength`. A 100MB JSON post is accepted into memory.
89. **JWT settings come from `appsettings.json`.** Plaintext key in source-controllable config; should come from env vars or a secrets store. Verify `appsettings.json` doesn't ship a real key.
90. **`User.RequireUserId()` throws `UnauthorizedAccessException`** (mapped to 401), but `[Authorize]` should already gate this — the only path to throw is misconfigured policies. Acceptable, but the message "Authenticated principal has no user id." reaches the client, which leaks implementation detail.
91. **`KitloPolicies.Lister` allows admin too** (`Program.cs:62`). That's the documented behaviour, but means admins can post listings under their own admin account — possibly desired, but it implicitly elevates admin actions to lister capabilities (e.g., `PayoutsController` accepts admins, see #41).

### Medium

92. **`CancellationPolicy` from `Listing.CreateDraftAsync` ignores frontend value.** `listings.service.ts:223` always sends `cancellationPolicy: 1` (moderate) on create — the user's selection from the create form is only applied in the subsequent `update` call. If the form succeeds creating the draft but fails the update, the listing is moderate-policy regardless.
93. **`ListingService.AddPhotoAsync` ordinal race.** `Ordinal = listing.Photos.Count` (`ListingService.cs:169`); two concurrent uploads can produce duplicate ordinals.
94. **`ListingsService.addPhotos` runs uploads in parallel via `Promise.all`** (`frontend/.../listings.service.ts:253-261`), which interacts with #93 to potentially produce duplicate `Ordinal` values.

### Low

95. **Seed data only writes 2 listings** with no payments/bookings/reviews — the search page works but admin queues, messages, and reviews look empty in dev.

---

## 12. Data integrity / consistency between FE and BE

### High

96. **`UpdateListingRequest` lacks `IsBundle` and `BundleListingIds`.** Frontend bundle-create relies on these (see #23). The DTO needs to add both fields.
97. **`AdminStatsDto` doesn't include `slaBreachCount`.** Frontend `getStats()` maps it to `0` always (`admin.service.ts:108-110`). The "SLA breach" counter on AdminHome is informationless.
98. **Frontend `cancellationPolicy` is sent as integer index (`POLICIES.indexOf(...)`).** Works because `CancellationPolicy` enum names match index order — but coupling string→int via array order is fragile across both halves of the codebase.
99. **`BookingsService.cancelPreview` synthesizes a policy from time-until-start** (`bookings.service.ts:188`) instead of reading the booking's policy. The "Refund preview" shown on cancel may not match the lister-specified policy.

---

## 13. Process / state machine gaps

100. **Booking cannot transition `pending → confirmed` from the UI.** The BookingService supports a `confirm` action (`BookingService.cs:125-131`), but no FE page calls it. Listers can't approve booking requests.
101. **No FE for `pickup` / `return` / `complete` actions either.** All three exist in the backend transition switch but no button anywhere triggers them.
102. **No automatic booking lifecycle.** No timer turns `confirmed → active` at start time, no job marks `returned → completed`. Bookings get stuck.
103. **No payout creation trigger.** Even if a booking reached `Returned`, no event fires `PayoutService.CreatePayoutAsync`.
104. **Webhook handler is no-op** (`StripeService.HandleWebhookAsync`). Real Stripe events would never advance booking/payment state.

---

## Summary by area (Critical + High counts)

| Area | Critical | High |
|---|---|---|
| Booking workflow | 5 | 3 |
| Auth | 0 | 5 |
| Listings | 4 | 6 |
| Payments / Stripe / Payouts | 2 | 7 |
| Disputes | 0 | 8 |
| Reviews | 0 | 4 |
| Messaging | 1 | 5 |
| Notifications | 1 | 0 |
| Admin | 0 | 8 |
| Public | 0 | 0 |
| Profile | 0 | 4 |
| Backend cross-cutting | 0 | 7 |
| Data contracts | 0 | 4 |

**Headline:** end-to-end the workflows are not exercisable. Booking can't be initiated (#1), can't be paid (#4-5), can't be confirmed by the lister (#100), can't generate payouts (#35), can't generate notifications (#63), and can't generate messages (#57). The dashboard pages render, but they read mock data (#29, #52, #66, #72-73), and most action buttons are decorative (#9, #17-18, #33, #39-40, #49, #75-78, #82-83). The two backend gaps with the broadest blast radius are the missing notification and payout call sites — wiring those in is a precondition for any of the lister/renter dashboards being meaningful.
