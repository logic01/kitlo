# Kitlo — Page Inventory

> Every page needed to implement all 22 feature workflows. Organized by area. Each entry covers: purpose, API dependencies, components, and button/link behavior.

---

## How to read this document

- **Route** — Next.js App Router path
- **Feature refs** — which feature files drive this page
- **API endpoints** — route handlers this page calls (all under `/api/`)
- **Components** — UI building blocks needed (maps to `brand/style.css`)
- **Links/buttons** — what each interactive element does

---

## 1. Public / Marketing

---

### 1.1 Homepage
**Route:** `/`
**Features:** 05-search-discovery, 22-bundle-listing

**Purpose:** Entry point for anonymous visitors and signed-in users. Communicates the platform value proposition and funnels users into search.

**API endpoints:**
- `GET /api/listings?featured=true&limit=6` — featured listings for the listings preview grid
- `GET /api/listings/count?near=[location]` — listing count for search bar placeholder text

**Components:**
- `.nav` with Sign in / List your gear CTAs
- `.hero` with two-column layout, `.hero-search` (location + gear type inputs + submit)
- `.profile-card` × 3 — sample verified lister cards (right column of hero)
- `.olive-band` — North Star value proposition with 3 pillars
- `.condition-grid` / `.condition-card` × 3 — condition rating explainer
- `.listings-grid` / `.listing-card` × 6 — featured listings
- `.step-card` × 3 (How it works)
- `.dark-band` + `.trust-card` × 4 — trust/safety section
- `.footer`
- `.topo-texture` on hero background

**Links/buttons:**
- "Find gear" (search submit) → `/gear?location=X&type=Y`
- "List your gear" (nav + hero CTA) → `/sign-up?intent=lister` or `/lister-onboarding` if already signed in
- "Sign in" (nav) → `/sign-in`
- Each listing card → `/gear/[id]`
- "Browse all gear" (below featured listings) → `/gear`

---

### 1.2 How It Works
**Route:** `/how-it-works`
**Features:** 01, 03, 07, 08, 10, 12

**Purpose:** Explains the full rental lifecycle for new visitors who need more context before signing up.

**API endpoints:** None (static content)

**Components:**
- `.nav`
- `.hero` (simplified — headline + sub only, no search)
- `.step-card` — expanded step-by-step for both renter and lister flows
- `.condition-grid` — condition system explainer
- `.dark-band` with trust signals
- `.olive-band` — North Star
- `.footer`

**Links/buttons:**
- "Find gear" CTA → `/gear`
- "List your gear" CTA → `/sign-up?intent=lister`

---

### 1.3 Search & Discovery
**Route:** `/gear`
**Features:** 05-search-discovery

**Purpose:** Primary browse/search experience. Shows filtered listing results in grid and optionally map view. Works for unauthenticated visitors.

**API endpoints:**
- `GET /api/listings` — query params: `location`, `type`, `startDate`, `endDate`, `condition[]`, `minPrice`, `maxPrice`, `radius`, `verifiedOnly`, `minRating`, `page`, `sort`
- `GET /api/listings/count` — result count for display

**Components:**
- `.nav`
- `.search-bar` — location, gear type, date inputs + submit (sticky at top on scroll)
- Filter sidebar: `.input` (price range), checkboxes (condition, gear type), toggles (verified only, instant book), dropdown (radius, min rating)
- `.listings-grid` / `.listing-card` — results grid (3-col desktop, 1-col mobile)
- `.badge-condition`, `.badge-verified`, `.tag-type` on each card
- Map toggle button — switches to Mapbox map view
- `.empty-state` — for no results
- Pagination / load-more button
- `.footer`

**Links/buttons:**
- Each listing card → `/gear/[id]`
- "Expand radius" (in empty state) → updates radius filter
- "Get notified" (out-of-area empty state) → captures email via modal
- Map pin click → mini card popover with "View listing" → `/gear/[id]`
- Clear filters → resets all filters
- Sort dropdown → re-sorts results

---

### 1.4 Listing Detail
**Route:** `/gear/[id]`
**Features:** 06-listing-detail, 22-bundle-listing (variant)

**Purpose:** Full gear listing page — the decision-making surface for renters. Must contain all info needed to book with confidence.

**API endpoints:**
- `GET /api/listings/[id]` — full listing data
- `GET /api/listings/[id]/availability` — calendar availability
- `GET /api/reviews?listingId=[id]&page=X` — paginated reviews

**Components:**
- `.nav`
- `.photo-gallery` with hero + thumbnail strip
- `.badge-condition`, `.badge-verified`, `.tag-type`
- `.spec-table` (Roboto Mono values)
- `.condition-indicator` bar
- `.profile-card` (lister block) + `.badge-verified`
- Sticky booking sidebar: `.booking-sidebar` — date range picker, cost breakdown (Roboto Mono), "Request this gear" CTA (`.btn-primary` amber)
- `.calendar` — availability calendar (read-only for renters)
- `.review-card` list + summary stars
- `.empty-state` for zero reviews
- Gear type tag overlay on photos
- "Report listing" link (small, footer of page)
- `.footer`
- For bundles: two-column "What's in the bundle" spec cards instead of single spec table

**Links/buttons:**
- "Request this gear" → `/gear/[id]/book` (authenticated) or `/sign-in?redirect=/gear/[id]/book`
- "Sign in to book" (unauthenticated) → `/sign-in?redirect=/gear/[id]`
- Lister name/avatar → `/users/[listerId]`
- "View individual listing" (bundle) → `/gear/[individualId]`
- "Report this listing" → opens report modal (`POST /api/listings/[id]/report`)
- "Load more reviews" → paginated `GET /api/reviews`
- Date picker → recalculates cost breakdown inline

---

## 2. Auth

---

### 2.1 Sign In
**Route:** `/sign-in`
**Features:** 01-registration-onboarding

**Purpose:** Authenticate an existing user. Handled by Clerk's hosted UI embedded via `<SignIn />` component.

**API endpoints:** Clerk-managed (no custom API)

**Components:**
- `.nav` (minimal — logo only)
- Clerk `<SignIn />` component styled to match Kitlo brand
- `.btn` Google / Apple OAuth options above fold
- Email/password form below
- `.form-error` for validation messages

**Links/buttons:**
- "Create an account" → `/sign-up`
- "Forgot password" → Clerk-managed reset flow
- On success → redirect to `?redirect` param or `/dashboard`

---

### 2.2 Sign Up
**Route:** `/sign-up`
**Features:** 01-registration-onboarding

**Purpose:** New user registration — Clerk handles credentials, then custom onboarding steps (profile + intent) follow inline.

**API endpoints:**
- `POST /api/users/profile` — save first name, last name, location after Clerk auth
- `PATCH /api/users/intent` — save renter/lister/both intent

**Components:**
- `.nav` (minimal)
- Clerk `<SignUp />` (step 1+2 — credentials + email verify)
- `.stepper` (3 steps: Account → Profile → Intent)
- `.form-group` + `.input` + `.input-label` — first name, last name, city/state
- `.avatar-lg` — profile photo uploader
- Intent selection cards: large tap-target cards (Rent gear / List gear / Both)
- `.btn-primary` progress CTAs

**Links/buttons:**
- "Sign in instead" → `/sign-in`
- "Skip" (profile photo) → proceeds without photo
- Intent selection → "I want to rent" → `/dashboard`, "I want to list" → `/lister-onboarding`, "Both" → `/lister-onboarding`
- "Why do we need this?" tooltip on location field

---

## 3. Lister Onboarding

---

### 3.1 Lister Onboarding
**Route:** `/lister-onboarding`
**Features:** 02-lister-onboarding, 17-identity-verification

**Purpose:** One-time multi-step gate before a lister can publish any listing. Covers: intro, ID verification (Stripe Identity), payout account (Stripe Connect), and lister agreement.

**API endpoints:**
- `GET /api/users/onboarding-status` — check what steps are completed
- `POST /api/users/lister-agreement` — record agreement timestamp + IP
- `GET /api/stripe/connect/onboard` — initiate Stripe Connect OAuth (redirect)
- `GET /api/stripe/identity/session` — create Stripe Identity session

**Components:**
- `.nav` (minimal)
- `.stepper` (4 steps: Intro → ID Verify → Payout → Agreement)
- Intro step: `.step-card` layout, three requirement items
- ID step: Stripe Identity SDK embed, `.progress-indicator` during verification, success/failure states
- Payout step: Stripe Connect hosted UI, "Kitlo uses Stripe" trust note
- Agreement step: scrollable agreement text, checkbox `.form-group`, take rate displayed plainly
- `.btn-primary` "Continue" / "Complete"
- `.btn-ghost` "I'll do this later" (on final step only)

**Links/buttons:**
- "Let's get started" → step 2
- "Continue" each step → next step
- "I'll do this later" (from step 5 completion) → `/dashboard` with banner
- On completion → `/dashboard/listings/new`

---

## 4. Booking Flow

---

### 4.1 Booking Request
**Route:** `/gear/[id]/book`
**Features:** 07-booking-request

**Purpose:** Pre-payment summary. Shows full cost breakdown, optional message to lister, pickup details. No payment taken on this page.

**API endpoints:**
- `GET /api/listings/[id]` — listing data + lister info
- `GET /api/listings/[id]/availability` — re-validate dates still open

**Components:**
- `.nav` (minimal — logo + "Back to listing" link)
- Gear summary block: thumbnail, name, `.badge-condition`, lister name + rating
- Date block: pickup/return dates, day count
- Cost breakdown: `.spec-table` variant with Roboto Mono pricing rows
- Deposit hold block (visually distinct light surface)
- "Why is there a deposit?" expandable tooltip
- "What does the Protection Plan cover?" expandable tooltip
- Optional message to lister: `.form-group` + `<textarea>`
- Pickup details note
- `.btn-primary` "Continue to payment" (amber)
- `.btn-ghost` "Back" (left-aligned)

**Links/buttons:**
- "Continue to payment" → `/gear/[id]/checkout`
- "Back" → `/gear/[id]` with dates preserved
- Date edit → inline recalculation

---

### 4.2 Payment Checkout
**Route:** `/gear/[id]/checkout`
**Features:** 08-payment-checkout

**Purpose:** Collect card payment via Stripe Elements. Show exact charge amount on button. Confirm booking immediately on success.

**API endpoints:**
- `POST /api/payments/checkout` — creates Stripe PaymentIntent + deposit authorization
- `GET /api/payments/[bookingId]/status` — poll for confirmation

**Components:**
- `.nav` (logo only)
- Order summary (repeated from booking request)
- Stripe Elements: card input styled to Kitlo brand (bone white bg, slate border, DM Sans)
- Saved card selector (returning renters) — `.listing-card` variant for saved cards
- Deposit hold summary block
- `.btn-primary` — "Confirm booking — charge $XXX.XX" (exact amount in button text)
- Loading spinner during processing

**Links/buttons:**
- "Back" → `/gear/[id]/book`
- On success → `/gear/[id]/booking-confirmed`
- On failure → inline error, retry with same or different card

---

### 4.3 Booking Confirmed
**Route:** `/gear/[id]/booking-confirmed`
**Features:** 08-payment-checkout

**Purpose:** Post-payment confirmation screen. Shows booking reference, pickup details (full address revealed), and next-step actions.

**API endpoints:**
- `GET /api/bookings/[id]` — confirmed booking with full address + lister phone

**Components:**
- `.nav` (minimal)
- Confirmation header: booking reference in Roboto Mono (e.g., `KTL-2026-00847`), green success indicator
- Gear + dates block
- Lister contact block (name + phone, now revealed)
- Full pickup address (now revealed)
- "Add to calendar" button (generates .ics)
- `.btn-primary` "Message [Lister Name]"
- `.btn-secondary` "View my booking"

**Links/buttons:**
- "Message [Lister Name]" → `/dashboard/messages/[threadId]`
- "View my booking" → `/dashboard/bookings/[id]`
- "Add to calendar" → downloads .ics file

---

## 5. Dashboard — Shared

---

### 5.1 Dashboard Home
**Route:** `/dashboard`
**Features:** 11-active-rental (if active), 12-return-confirmation (if due)

**Purpose:** Hub for authenticated users. Shows active/upcoming bookings for renters, active bookings for listers, and quick nav to all dashboard areas.

**API endpoints:**
- `GET /api/bookings?status=active,confirmed&limit=5` — upcoming + active bookings
- `GET /api/notifications?unread=true&limit=3` — recent unread notifications

**Components:**
- `.sidebar` with `.sidebar-nav` items
- `.page-header` — "Welcome back, [Name]"
- `.stat-card` row — active bookings count, pending messages, next payout (if lister)
- `.booking-card` × N — active/upcoming bookings
- `.alert` banner if return is due today
- `.empty-state` if no activity

**Links/buttons:**
- Each booking card → `/dashboard/bookings/[id]`
- "Find gear" → `/gear`
- "Create listing" (if lister) → `/dashboard/listings/new`
- "View all bookings" → `/dashboard/bookings`
- "View messages" → `/dashboard/messages`

---

### 5.2 Bookings List
**Route:** `/dashboard/bookings`
**Features:** 07, 08, 11, 12, 21

**Purpose:** All bookings the user is involved in — as renter and as lister. Filterable by role and status.

**API endpoints:**
- `GET /api/bookings` — query params: `role=renter|lister`, `status`, `page`

**Components:**
- `.sidebar`
- `.page-header` with tabs (`.tabs`): "As renter" / "As lister"
- `.booking-card` list — gear photo, name, dates, status badge, other-party name
- `.status-badge` variants: Confirmed, Active, Returned, Disputed, Cancelled, Completed
- Filter by status (dropdown)
- `.empty-state` per tab

**Links/buttons:**
- Each booking card → `/dashboard/bookings/[id]`

---

### 5.3 Booking Detail
**Route:** `/dashboard/bookings/[id]`
**Features:** 10-pickup-inspection, 11-active-rental, 12-return-confirmation, 14-dispute-resolution, 21-cancellation

**Purpose:** The operational center of a booking. Shows current status, pickup/return actions, messaging, extension, cancellation. State-driven — different actions shown based on booking status.

**API endpoints:**
- `GET /api/bookings/[id]` — full booking with state
- `POST /api/bookings/[id]/confirm-pickup` — renter confirms pickup
- `POST /api/bookings/[id]/flag-condition` — renter flags condition issue
- `POST /api/bookings/[id]/confirm-handoff` — lister confirms handoff
- `POST /api/bookings/[id]/confirm-return` — renter confirms return
- `POST /api/bookings/[id]/flag-damage` — lister flags damage on return
- `POST /api/bookings/[id]/request-extension` — renter requests extension
- `POST /api/bookings/[id]/cancel` — cancel booking
- `GET /api/messages/[threadId]` — load message thread

**Components:**
- `.sidebar`
- `.page-header` + `.status-badge` (large, prominent)
- Gear + dates summary block
- Return countdown (`.countdown-display`, large Roboto Mono timer)
- Context-sensitive action area:
  - *Confirmed (pre-pickup):* "Message lister", "Cancel booking"
  - *Pickup day (renter):* Inspection checklist + "Confirm pickup" (`.btn-secondary`) + "Flag condition issue" (`.btn-outline` amber)
  - *Pickup day (lister):* "Confirm I've handed over the gear"
  - *Active:* "Message [name]", "Request extension", "Return early"
  - *Return day:* "Confirm I've returned the gear" (renter) / "Confirm return — gear in good condition" + "Gear returned with damage" (lister)
  - *Disputed:* Dispute status timeline, "View dispute details"
  - *Completed:* "Leave a review" (if not yet submitted)
- `.timeline` — booking event history
- `.alert` banner (return today, dispute open, etc.)
- `.dispute-panel` (when in Disputed state) — amounts at stake, status, party statements
- "Cancel booking" link (below fold, intentional friction)

**Links/buttons:**
- "Message [name]" → `/dashboard/messages/[threadId]`
- "Request extension" → date picker modal → `POST /api/bookings/[id]/request-extension`
- "Return early" → date picker modal
- "Cancel booking" → `/dashboard/bookings/[id]/cancel`
- "Leave a review" → `/dashboard/bookings/[id]/review`
- Lister name → `/users/[listerId]`

---

### 5.4 Booking Cancellation
**Route:** `/dashboard/bookings/[id]/cancel`
**Features:** 21-cancellation

**Purpose:** Cancellation confirmation with exact refund amount shown before committing. Includes mutual cancellation request flow.

**API endpoints:**
- `GET /api/bookings/[id]/cancel-preview` — calculates refund based on current timing
- `POST /api/bookings/[id]/cancel` — executes cancellation
- `POST /api/bookings/[id]/request-mutual-cancel` — initiates mutual cancellation

**Components:**
- `.page-header` — "Cancel booking"
- Booking summary block
- Refund calculation block (`.spec-table` variant) showing what's refunded and what's kept
- Cancellation policy reminder
- "Request mutual cancellation instead" option
- `.btn-primary` "Confirm cancellation" (red variant)
- `.btn-ghost` "Keep my booking" (back)
- Lister reason dropdown (lister-initiated only) + free text

**Links/buttons:**
- "Confirm cancellation" → `POST /api/bookings/[id]/cancel` → `/dashboard/bookings`
- "Keep my booking" → `/dashboard/bookings/[id]`
- "Request mutual cancellation" → `POST /api/bookings/[id]/request-mutual-cancel`

---

### 5.5 Messages Inbox
**Route:** `/dashboard/messages`
**Features:** 09-pre-pickup-messaging

**Purpose:** All message threads. Sorted by most recent activity. Unread count shown per thread.

**API endpoints:**
- `GET /api/messages` — list threads with last message preview + unread count

**Components:**
- `.sidebar`
- `.page-header` — "Messages"
- Thread list: `.message-thread-item` per booking — gear thumbnail, other party name, last message preview, unread count badge, timestamp
- `.empty-state` if no threads

**Links/buttons:**
- Each thread item → `/dashboard/messages/[threadId]`

---

### 5.6 Message Thread
**Route:** `/dashboard/messages/[threadId]`
**Features:** 09-pre-pickup-messaging

**Purpose:** Full conversation between renter and lister for a specific booking. Real-time chat interface.

**API endpoints:**
- `GET /api/messages/[threadId]` — message history
- `POST /api/messages/[threadId]` — send message
- `POST /api/messages/[threadId]/attachment` — upload photo attachment

**Components:**
- `.sidebar` (collapsible on mobile)
- Thread header: other party name + avatar + booking reference link
- `.message-thread` — scrollable chat area
- `.message-bubble` (`.msg-self` right-aligned, `.msg-other` left-aligned)
- `.message-system` — centered system messages (booking confirmed, etc.)
- Photo attachment preview
- Message input: `.input` + photo icon + send button
- "Report message" option (contextual, per message)
- Booking reference link at top

**Links/buttons:**
- Booking reference → `/dashboard/bookings/[id]`
- Photo attach icon → file picker → `POST .../attachment`
- Send button → `POST /api/messages/[threadId]`
- "Report message" → flags message for admin review

---

### 5.7 Profile & Settings
**Route:** `/dashboard/profile`
**Features:** 01-registration-onboarding, 16-notifications

**Purpose:** User's own profile — name, photo, location, notification preferences. Shows verification status.

**API endpoints:**
- `GET /api/users/me` — current user profile
- `PATCH /api/users/profile` — update profile fields
- `PATCH /api/notifications/preferences` — update notification preferences
- `POST /api/users/profile-photo` — upload new photo (Cloudinary)

**Components:**
- `.sidebar`
- `.page-header` — "Profile & Settings"
- `.tabs`: Profile / Notifications / Security
- Profile tab: `.avatar-lg`, `.form-group` fields (name, location, bio), `.btn-primary` Save
- `.badge-verified` (if verified) or "Verify your identity" prompt
- Notifications tab: toggle rows per channel (push / email) per event category
- `.toggle` component per setting
- Security tab: change email (Clerk), delete account

**Links/buttons:**
- "Verify your identity" (if unverified) → `/lister-onboarding` or `/dashboard/verify`
- "Save" → `PATCH /api/users/profile`
- "Upload photo" → opens file picker → Cloudinary upload
- Toggle changes → `PATCH /api/notifications/preferences` (auto-save)

---

### 5.8 Public User Profile
**Route:** `/users/[id]`
**Features:** 06-listing-detail, 13-ratings-reviews

**Purpose:** Read-only profile for any lister — shows their listings, reviews they've received as a lister.

**API endpoints:**
- `GET /api/users/[id]/profile` — name, avatar, location, stats, verification status
- `GET /api/listings?listerId=[id]&status=active` — their active listings
- `GET /api/reviews?aboutUserId=[id]&role=lister` — reviews of them as lister

**Components:**
- `.nav`
- `.profile-card` (large variant) — avatar, name, verified badge, stats (rating, rentals, member since)
- `.listings-grid` / `.listing-card` — their active listings
- `.review-card` list — reviews they've received
- `.footer`

**Links/buttons:**
- Each listing card → `/gear/[id]`
- "Back" → browser back

---

## 6. Dashboard — Lister

---

### 6.1 My Listings
**Route:** `/dashboard/listings`
**Features:** 04-manage-listings

**Purpose:** Lister's listing management hub. List/table view of all their listings with status, quick actions.

**API endpoints:**
- `GET /api/listings/mine` — all the lister's listings
- `PATCH /api/listings/[id]` — toggle active/paused (inline)
- `DELETE /api/listings/[id]` — archive listing

**Components:**
- `.sidebar`
- `.page-header` — "My Listings" + "Add listing" button + "Create bundle" button
- `.tabs`: All / Active / Paused / Pending / Archived
- `.data-table` — columns: Gear name, Type, Condition, Status, Daily rate, Bookings, Rating, Earnings
- `.status-badge` per listing
- `.badge-condition` per row
- Row actions: Toggle (pause/activate), Edit, Calendar, View, Archive
- `.toggle` component for active/paused inline switch
- `.empty-state` for new listers
- "Pause all" button (Power Lister, shown when 5+ listings)
- Density toggle (table vs. card view)

**Links/buttons:**
- "Add listing" → `/dashboard/listings/new`
- "Create bundle" → `/dashboard/listings/bundle/new`
- "Edit" (per row) → `/dashboard/listings/[id]/edit`
- "Calendar" (per row) → `/dashboard/listings/[id]/calendar`
- "View" (per row) → `/gear/[id]`
- "Archive" → confirmation modal → `DELETE /api/listings/[id]`
- Toggle active/paused → `PATCH /api/listings/[id]` (instant, no confirmation)

---

### 6.2 Create Listing
**Route:** `/dashboard/listings/new`
**Features:** 03-create-listing, 22-bundle-listing

**Purpose:** 10-step wizard for creating a new gear listing. Each step is a distinct screen on mobile; single long form with section anchors on desktop.

**API endpoints:**
- `POST /api/listings` — create draft (called on step 1 to get a listing ID)
- `PATCH /api/listings/[id]` — save each step's data (called on step advance)
- `POST /api/listings/[id]/photos` — upload photos (Cloudinary)
- `POST /api/listings/[id]/publish` — final publish action
- `GET /api/listings/market-rates?category=thermal` — pricing reference data

**Components:**
- `.stepper` — "Step X of 10" progress bar
- "Draft saved" indicator (`.text-mono` in header)
- Step 1 — Category: large radio cards (Thermal / NV / Bundle / Camp & Support)
- Step 2 — Gear identity: `.form-group` inputs with autocomplete (Make, Model, Year, MSRP, Serial)
- Step 3 — Specs: category-specific `.form-group` fields (Roboto Mono for numeric specs)
- Step 4 — Condition: `.condition-grid` radio cards with tooltips
- Step 5 — Photos: `.upload-zone` drag-and-drop, photo reorder grid
- Step 6 — Pricing: `.input` daily rate + pricing reference panel (collapsible)
- Step 7 — Deposit: auto-suggested deposit with lister adjustment slider
- Step 8 — Availability: `.calendar` interactive (click/drag to block dates)
- Step 9 — Location: ZIP + full address toggle + neutral location toggle
- Step 10 — Review & Publish: full listing preview (listing-card + listing-detail formats)
- `.btn-primary` "Continue" / "Publish listing"
- `.btn-ghost` "Back"
- `.form-error` for validation

**Links/buttons:**
- "Continue" each step → next step + `PATCH /api/listings/[id]`
- "Back" → previous step (data preserved)
- Photo upload → file picker / drag → `POST /api/listings/[id]/photos`
- "Publish listing" → `POST /api/listings/[id]/publish` → `/dashboard/listings` with success banner
- "Save draft and exit" → `/dashboard/listings`

---

### 6.3 Edit Listing
**Route:** `/dashboard/listings/[id]/edit`
**Features:** 04-manage-listings

**Purpose:** Same layout as Create Listing but pre-filled. Locked fields shown with explanation when listing is actively booked.

**API endpoints:**
- `GET /api/listings/[id]` — current listing data
- `PATCH /api/listings/[id]` — save changes

**Components:** Same as Create Listing (6.2) but:
- Locked fields shown as read-only with `.alert-info` banner: "Locked during active booking — editable after [date]"
- `.btn-primary` "Save changes" instead of "Publish"

**Links/buttons:**
- "Save changes" → `PATCH /api/listings/[id]` → `/dashboard/listings`
- "Cancel" → `/dashboard/listings`
- "View public listing" → `/gear/[id]`

---

### 6.4 Availability Calendar
**Route:** `/dashboard/listings/[id]/calendar`
**Features:** 04-manage-listings, 03-create-listing (step 8)

**Purpose:** Full-screen interactive calendar for managing availability for a single listing.

**API endpoints:**
- `GET /api/listings/[id]/availability` — get current blocked/booked dates
- `PATCH /api/listings/[id]/availability` — save blocked date ranges

**Components:**
- `.sidebar`
- `.page-header` — gear name + "Back to listings"
- `.calendar` full-width — color legend: White (available), Gray (blocked by lister), Green (confirmed booking), Yellow (pending)
- "Block selected dates" `.btn-secondary`
- "Unblock" on selected blocked dates
- "Add recurring block" (dropdown: day of week + duration)
- "Bulk block all listings" option (Power Lister)
- Date range drag-select

**Links/buttons:**
- "Save" → `PATCH /api/listings/[id]/availability`
- "Back to listings" → `/dashboard/listings`
- Click a booked date → `/dashboard/bookings/[id]`

---

### 6.5 Create Bundle
**Route:** `/dashboard/listings/bundle/new`
**Features:** 22-bundle-listing

**Purpose:** 5-step wizard to create a bundle from existing listings.

**API endpoints:**
- `GET /api/listings/mine?bundleEligible=true` — listings eligible for bundling
- `POST /api/bundles` — create bundle
- `POST /api/bundles/[id]/photos` — upload bundle hero photo

**Components:**
- `.stepper` (5 steps: Select listings → Bundle identity → Pricing → Availability preview → Publish)
- Step 1: Checklist of eligible listings with compatibility suggestions
- Step 2: Bundle name (`.input`), description (`.form-group` textarea)
- Step 3: Individual price breakdown + bundle price input + savings display
- Step 4: Combined availability calendar (read-only preview)
- Step 5: Bundle preview + publish
- `.upload-zone` for bundle hero photo

**Links/buttons:**
- "Continue" → next step
- "Back" → previous step
- "Publish bundle" → `POST /api/bundles` → `/dashboard/listings`
- "Cancel" → `/dashboard/listings`

---

### 6.6 Earnings Dashboard
**Route:** `/dashboard/earnings`
**Features:** 15-payouts-earnings

**Purpose:** Lister's financial overview — total earnings, next payout, payout history, per-listing performance.

**API endpoints:**
- `GET /api/earnings/summary` — overview: total, pending, next payout, YTD
- `GET /api/earnings/history?page=X` — paginated payout history
- `GET /api/earnings/by-listing` — per-listing breakdown (Power Lister)
- `GET /api/earnings/export` — CSV download

**Components:**
- `.sidebar`
- `.page-header` — "Earnings"
- `.stat-card` row: Total earned, Pending, Next payout (date + amount), YTD
- `.data-table` — payout history (Booking ref, Gear, Dates, Gross, Deductions, Net, Status)
- Expandable row: full fee breakdown
- Per-listing performance table (shown when 3+ listings)
- "Export CSV" button
- "Why was I charged a protection plan fee?" tooltip
- Tax notice: 1099-K threshold note

**Links/buttons:**
- Each payout row → `/dashboard/bookings/[id]` (the booking it corresponds to)
- "Export CSV" → `GET /api/earnings/export`
- Expand row → inline fee breakdown panel

---

## 7. Reviews

---

### 7.1 Leave a Review
**Route:** `/dashboard/bookings/[id]/review`
**Features:** 13-ratings-reviews

**Purpose:** Post-return review submission. Different form shown based on role (renter vs. lister). Blind — review not revealed until both parties submit or window closes.

**API endpoints:**
- `GET /api/bookings/[id]` — booking context (gear name, other party)
- `POST /api/reviews` — submit review

**Components:**
- `.page-header` — "Review your rental"
- Booking summary (gear + dates + other party)
- **Renter form:** Part 1 (gear): star input, condition accuracy (Yes/Somewhat/No), textarea, gear-specific tags (`.tag` pills). Part 2 (lister): star input, textarea, lister tags.
- **Lister form:** star input, textarea, renter tags
- Star input: large tap-friendly `.star-input` component
- Tag pills: `.tag-pill` tap-to-select, `.tag-pill.selected` = filled
- Character counter below textarea
- `.btn-primary` "Submit review"
- "Why can't I see the review yet?" info tooltip

**Links/buttons:**
- "Submit review" → `POST /api/reviews` → `/dashboard/bookings/[id]` with confirmation banner
- "Skip" (close review window) → `/dashboard/bookings`

---

## 8. Admin

---

### 8.1 Admin Dashboard
**Route:** `/admin`
**Features:** 18, 19, 20

**Purpose:** Admin overview — queue counts, recent flags, SLA breach alerts.

**API endpoints:**
- `GET /api/admin/stats` — queue counts, SLA breach count

**Components:**
- `.sidebar` (admin nav: Review Queue, Disputes, Users, Reports)
- `.page-header` — "Admin Dashboard"
- `.stat-card` row: Listings pending review, Disputes open, SLA breaches, Flagged users
- Queue summary cards with "View queue" links
- SLA breach list (`.alert-danger` items)

**Links/buttons:**
- "View listing queue" → `/admin/listings`
- "View disputes" → `/admin/disputes`
- "Manage users" → `/admin/users`

---

### 8.2 Admin — Listing Review Queue
**Route:** `/admin/listings`
**Features:** 18-admin-listing-review

**Purpose:** Queue of listings pending admin review. Sorted by SLA deadline.

**API endpoints:**
- `GET /api/admin/listings/queue` — query params: `reason=high-value|flagged`, `page`

**Components:**
- `.sidebar` (admin)
- `.page-header` — "Listing Review Queue"
- `.tabs`: All / High-Value / Flagged
- `.queue-item` per listing: gear name, MSRP, lister name + account age + verification status, submitted timestamp, queue reason badge, `.sla-countdown`
- `.status-badge` for queue reason
- Sort controls

**Links/buttons:**
- Each queue item → `/admin/listings/[id]`

---

### 8.3 Admin — Listing Review
**Route:** `/admin/listings/[id]`
**Features:** 18-admin-listing-review

**Purpose:** Full listing review. Split-screen: listing preview on left, admin action panel on right.

**API endpoints:**
- `GET /api/admin/listings/[id]` — full listing data + lister account history
- `POST /api/admin/listings/[id]/approve` — approve
- `POST /api/admin/listings/[id]/reject` — reject with reason
- `POST /api/admin/listings/[id]/request-changes` — request changes with reasons
- `POST /api/admin/listings/[id]/escalate` — escalate to senior admin

**Components:**
- `.page-header` + "Back to queue"
- Split layout: listing preview (left 60%) / admin panel (right 40%)
- Photo lightbox with zoom + swipe
- Full spec table + condition rating display
- Lister sidebar card: account age, verification, listings count, dispute history, review scores
- Admin action buttons: Approve (`.btn-olive`), Request Changes (`.btn-secondary`), Reject (`.btn-outline`), Escalate
- "Request changes" form: structured reason dropdown + free text
- "Reject" form: rejection reason dropdown
- Admin notes field (internal only)
- All actions require confirmation modal

**Links/buttons:**
- "Back to queue" → `/admin/listings`
- Lister name → `/admin/users/[listerId]`
- "Approve" → `POST .../approve` → back to queue with success
- "Request changes" → form → `POST .../request-changes`
- "Reject" → form → `POST .../reject`
- "Escalate" → `POST .../escalate`

---

### 8.4 Admin — Dispute Queue
**Route:** `/admin/disputes`
**Features:** 19-admin-dispute-management

**Purpose:** All open disputes sorted by priority and SLA.

**API endpoints:**
- `GET /api/admin/disputes?status=open` — dispute queue

**Components:**
- `.sidebar` (admin)
- `.page-header` — "Disputes"
- `.queue-item` per dispute: booking ref, dispute type badge, gear name + MSRP, amounts at stake (deposit + payout), both party names, filed timestamp, renter response status, `.sla-countdown`
- Priority sort: Late return → Damage → Pre-rental

**Links/buttons:**
- Each queue item → `/admin/disputes/[id]`

---

### 8.5 Admin — Dispute Detail
**Route:** `/admin/disputes/[id]`
**Features:** 19-admin-dispute-management

**Purpose:** Full dispute review and ruling. Photo comparison, message thread, booking timeline, ruling form.

**API endpoints:**
- `GET /api/admin/disputes/[id]` — full dispute data with photos, messages, timeline
- `POST /api/admin/disputes/[id]/rule` — submit ruling
- `POST /api/admin/disputes/[id]/message-party` — send support message
- `POST /api/admin/disputes/[id]/reopen` — reopen within 7-day window

**Components:**
- `.page-header` + dispute type badge + SLA countdown
- Split layout: Evidence (left 60%) / Actions (right 40%)
- Photo comparison: `.photo-compare` side-by-side (pickup left, return right), labeled + timestamped
- Listing photos (baseline) below comparison
- `.message-thread` (read-only, full booking history, searchable)
- `.timeline` — booking state transitions
- Renter + lister statement cards
- Amounts at stake summary
- Admin notes field (internal)
- Ruling form wizard: ruling type → amounts → explanation → preview → confirm
- "Message renter" / "Message lister" buttons
- Financial preview panel before submit

**Links/buttons:**
- "Back to disputes" → `/admin/disputes`
- Both party names → `/admin/users/[id]`
- "Submit ruling" → `POST .../rule` → ruling preview modal → confirm → back to queue

---

### 8.6 Admin — User Management
**Route:** `/admin/users`
**Features:** 20-admin-user-management

**Purpose:** User search. Find a user by email, name, booking reference, or phone.

**API endpoints:**
- `GET /api/admin/users?search=X` — user search

**Components:**
- `.sidebar` (admin)
- `.page-header` — "Users"
- `.search-bar` — email / name / booking ref / phone
- Search results: `.data-table` — name, email, role, verification, account age, open disputes, last activity
- Red flag indicators per row

**Links/buttons:**
- Each result row → `/admin/users/[id]`

---

### 8.7 Admin — User Record
**Route:** `/admin/users/[id]`
**Features:** 20-admin-user-management

**Purpose:** Full user record — account overview, red flags panel, booking/dispute/review history, admin actions.

**API endpoints:**
- `GET /api/admin/users/[id]` — full user record
- `POST /api/admin/users/[id]/warn` — issue warning
- `POST /api/admin/users/[id]/restrict` — apply restriction
- `POST /api/admin/users/[id]/suspend` — suspend
- `POST /api/admin/users/[id]/ban` — permanent ban (senior admin only)
- `POST /api/admin/users/[id]/reinstate` — lift restriction/suspension

**Components:**
- `.page-header` — "[User Name]" + account status badge
- Red flags panel (`.alert-warning`) with tooltips per flag
- Account overview: verification, role, dates, Stripe status
- Booking history table (as renter + as lister)
- Review history (avg rating, listing of reviews)
- Dispute history (filed by, filed against, outcomes)
- Warning log
- Admin action buttons (color-coded severity): Warning (amber) / Restrict (orange) / Suspend (red) / Ban (dark red)
- Destructive actions require typing user name to confirm
- Audit log tab: full admin action history

**Links/buttons:**
- "Issue warning" → modal form → `POST .../warn`
- "Restrict account" → modal (type + duration) → `POST .../restrict`
- "Suspend" → modal (requires typed name) → `POST .../suspend`
- "Permanent ban" → modal (senior admin confirm) → `POST .../ban`
- "Reinstate" → confirmation → `POST .../reinstate`
- Booking references → `/admin/disputes/[id]` or `/dashboard/bookings/[id]`
- "Back to search" → `/admin/users`

---

## 9. Static / Legal

---

### 9.1 Terms of Service
**Route:** `/terms`
**Components:** `.nav`, `.section` prose, `.footer`

### 9.2 Privacy Policy
**Route:** `/privacy`
**Components:** `.nav`, `.section` prose, `.footer`

### 9.3 Lister Agreement
**Route:** `/lister-agreement`
**Purpose:** Public version of the lister agreement (also shown inline during onboarding).
**Components:** `.nav`, `.section` prose, `.footer`

---

## Page Count Summary

| Area | Pages |
|---|---|
| Public / Marketing | 4 |
| Auth | 2 |
| Lister Onboarding | 1 |
| Booking Flow | 3 |
| Dashboard — Shared | 8 |
| Dashboard — Lister | 6 |
| Reviews | 1 |
| Admin | 7 |
| Static / Legal | 3 |
| **Total** | **35** |

---

## API Endpoint Reference

| Endpoint | Method | Description |
|---|---|---|
| `/api/listings` | GET | Search listings |
| `/api/listings` | POST | Create listing |
| `/api/listings/[id]` | GET | Get listing |
| `/api/listings/[id]` | PATCH | Update listing |
| `/api/listings/[id]` | DELETE | Archive listing |
| `/api/listings/[id]/publish` | POST | Publish listing |
| `/api/listings/[id]/photos` | POST | Upload photos |
| `/api/listings/[id]/availability` | GET/PATCH | Availability calendar |
| `/api/listings/[id]/report` | POST | Report listing |
| `/api/listings/mine` | GET | Lister's own listings |
| `/api/listings/market-rates` | GET | Pricing reference |
| `/api/bundles` | POST | Create bundle |
| `/api/bundles/[id]` | PATCH/DELETE | Manage bundle |
| `/api/bookings` | GET | List user bookings |
| `/api/bookings/[id]` | GET | Get booking |
| `/api/bookings/[id]/cancel` | POST | Cancel booking |
| `/api/bookings/[id]/confirm-pickup` | POST | Renter confirms pickup |
| `/api/bookings/[id]/flag-condition` | POST | Renter flags condition |
| `/api/bookings/[id]/confirm-handoff` | POST | Lister confirms handoff |
| `/api/bookings/[id]/confirm-return` | POST | Renter confirms return |
| `/api/bookings/[id]/flag-damage` | POST | Lister flags damage |
| `/api/bookings/[id]/request-extension` | POST | Request extension |
| `/api/bookings/[id]/cancel-preview` | GET | Refund preview |
| `/api/bookings/[id]/request-mutual-cancel` | POST | Mutual cancel request |
| `/api/payments/checkout` | POST | Process payment |
| `/api/payments/[id]/status` | GET | Payment status |
| `/api/messages` | GET | List threads |
| `/api/messages/[threadId]` | GET/POST | Thread messages |
| `/api/messages/[threadId]/attachment` | POST | Photo attachment |
| `/api/reviews` | POST | Submit review |
| `/api/reviews` | GET | Get reviews (by listingId or userId) |
| `/api/users/me` | GET | Current user |
| `/api/users/profile` | PATCH | Update profile |
| `/api/users/intent` | PATCH | Set role intent |
| `/api/users/onboarding-status` | GET | Onboarding progress |
| `/api/users/lister-agreement` | POST | Record agreement |
| `/api/users/[id]/profile` | GET | Public user profile |
| `/api/earnings/summary` | GET | Earnings overview |
| `/api/earnings/history` | GET | Payout history |
| `/api/earnings/by-listing` | GET | Per-listing earnings |
| `/api/earnings/export` | GET | CSV export |
| `/api/notifications/preferences` | PATCH | Update notification prefs |
| `/api/stripe/connect/onboard` | GET | Stripe Connect redirect |
| `/api/stripe/identity/session` | GET | Stripe Identity session |
| `/api/admin/stats` | GET | Queue counts |
| `/api/admin/listings/queue` | GET | Review queue |
| `/api/admin/listings/[id]` | GET | Listing for review |
| `/api/admin/listings/[id]/approve` | POST | Approve listing |
| `/api/admin/listings/[id]/reject` | POST | Reject listing |
| `/api/admin/listings/[id]/request-changes` | POST | Request changes |
| `/api/admin/listings/[id]/escalate` | POST | Escalate |
| `/api/admin/disputes` | GET | Dispute queue |
| `/api/admin/disputes/[id]` | GET | Dispute detail |
| `/api/admin/disputes/[id]/rule` | POST | Submit ruling |
| `/api/admin/disputes/[id]/message-party` | POST | Message a party |
| `/api/admin/users` | GET | User search |
| `/api/admin/users/[id]` | GET | User record |
| `/api/admin/users/[id]/warn` | POST | Issue warning |
| `/api/admin/users/[id]/restrict` | POST | Restrict account |
| `/api/admin/users/[id]/suspend` | POST | Suspend account |
| `/api/admin/users/[id]/ban` | POST | Permanent ban |
| `/api/admin/users/[id]/reinstate` | POST | Reinstate account |
| `/api/webhooks/stripe` | POST | Stripe webhook handler |
| `/api/webhooks/clerk` | POST | Clerk webhook handler |
