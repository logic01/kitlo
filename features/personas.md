# Kitlo — User Personas

Every feature decision should be checked against these personas. If a design doesn't serve at least one of them clearly, question whether it's needed.

---

## P1 — The First-Time Renter

**Name:** Marcus, 34, San Antonio TX  
**Occupation:** Electrician. Hunts whitetail and hog on weekends.  
**Context:** Has a 3-day hog hunt booked on a Hill Country lease. Wants to try thermal for the first time before spending $3,000 on his own scope. Found Kitlo through a HuntTalk thread.

**Goals**
- Find a thermal scope available near him for specific dates
- Understand whether the gear is legit (not broken or misrepresented)
- Know his money is safe if something goes wrong
- Pick up and return with minimal friction

**Pain points**
- Doesn't know if he can trust a stranger with his card details
- Worried the gear won't match the listing description
- Doesn't want to read a wall of legal text before booking

**Behavior**
- Will browse a few listings and compare specs before committing
- Will read every review before booking
- Checks the Verified Hunter badge and lister rating first
- Likely on mobile throughout

**What Kitlo must nail for Marcus**
- Trust signals visible without digging (badge, rating, escrow explanation)
- Gear specs clear and honest (condition rating, spec table)
- Booking flow under 3 minutes
- Pickup/return instructions simple enough that he doesn't need to call anyone

---

## P2 — The Repeat Renter

**Name:** Derek, 41, Minneapolis MN  
**Occupation:** Project manager. Hunts deer, predator, and waterfowl across MN/WI/ND.  
**Context:** Has rented gear on Kitlo 6 times. Has a preferred lister he books every season. Knows the platform well, just wants efficiency.

**Goals**
- Re-book his preferred lister for the same gear each season
- Browse new listings when his usual lister is unavailable
- Track active bookings without digging

**Pain points**
- Having to re-enter the same search criteria every time
- Can't quickly re-book a previous lister without searching from scratch
- Notification overload for things he doesn't care about

**Behavior**
- Goes straight to "My Bookings" or searches immediately
- Doesn't read How It Works — already knows
- Leaves reviews consistently; reads others' reviews carefully

**What Kitlo must nail for Derek**
- Saved searches or quick re-book from booking history
- Clean dashboard showing active and upcoming bookings
- Notification preferences (opt out of non-critical)

---

## P3 — The New Lister

**Name:** Garrett, 47, San Antonio TX  
**Occupation:** Retired military, now ranch manager. Owns a Pulsar Thermion 2 XP50 and a PVS-14. Uses them 15 nights a year.  
**Context:** Saw a HuntTalk post about Kitlo. Gear sits in the safe 350 days a year. Wants to cover the cost of ownership and maybe pay for next season's lease.

**Goals**
- List his gear without a complicated setup process
- Trust that renters won't abuse his equipment
- Get paid quickly and without hassle
- Know what happens if something goes wrong

**Pain points**
- Worried his $4,000 scope comes back damaged
- Doesn't want to deal with flaky renters
- Not comfortable with technology — needs clear instructions

**Behavior**
- Will need pricing guidance (doesn't know market rates)
- Will read the insurance/damage coverage section carefully before publishing
- Will be selective about accepting renters — wants to see their profile
- Will message the renter before pickup to establish trust

**What Kitlo must nail for Garrett**
- Pricing suggestions during listing creation
- Clear explanation of damage coverage and deposit system
- Renter profile visible before accepting a booking request
- Simple payout process, fast deposit to his bank

---

## P4 — The Power Lister

**Name:** Brad, 52, Austin TX  
**Occupation:** Hunting guide and outfitter. Owns 8 pieces of high-end thermal and NV gear.  
**Context:** Treats Kitlo as a revenue stream. Lists all his off-season inventory. Manages bookings actively. Thinks of himself as a small business.

**Goals**
- Manage multiple listings efficiently from one dashboard
- See earnings per listing and total monthly income
- Block calendar dates when gear is in use on his own hunts
- Build a strong reputation to attract repeat renters

**Pain points**
- Managing 8 listings individually is tedious
- Needs calendar visibility across all listings at once
- Wants bulk availability updates (e.g., block 10 days for an elk trip)

**Behavior**
- Logs in daily to check booking requests
- Responds to renters within the hour
- Has a perfect rating — protects it carefully
- Will switch platforms if Kitlo's take rate increases

**What Kitlo must nail for Brad**
- Multi-listing dashboard with unified calendar
- Bulk availability blocking
- Earnings breakdown per listing
- Fast-response tooling (approve/decline in 2 taps)

---

## P5 — The Dual User

**Name:** Cody, 38, Waco TX  
**Occupation:** Wildlife biologist. Lists his Pulsar Axion monocular when not in use. Rents NV goggles for backcountry trips he doesn't have the budget to outfit.

**Goals**
- Switch fluidly between "lister" and "renter" mode
- Keep lister earnings and renter spending clearly separated
- Not be confused by which role he's in at any given moment

**Pain points**
- Confusing UI when both lister and renter dashboards are merged
- Doesn't want to accidentally decline a renter booking while browsing gear to rent

**What Kitlo must nail for Cody**
- Clear role-switching in the app (tab or toggle between "My Listings" and "My Bookings")
- Separate notification streams for each role
- Unified earnings + spend summary

---

## P6 — The First-Time Visitor (Unauthenticated)

**Name:** Anyone who lands on kitlo.com without an account  
**Context:** Arrived from a HuntTalk link, a YouTube mention, or a Google search for "rent thermal scope Texas."

**Goals**
- Understand what Kitlo is in under 10 seconds
- See whether gear is available in their area before creating an account
- Decide if it's worth signing up

**Pain points**
- Platform requires sign-up before showing any listings (kills conversion)
- No proof that real gear exists on the platform

**What Kitlo must nail**
- Allow unauthenticated search and listing browsing
- Show real listings and real listers on the homepage
- Gate only booking and messaging behind sign-in
- Clear trust signals above the fold (escrow, coverage, verified)

---

## P7 — The Kitlo Admin

**Name:** Internal team member managing the platform  
**Context:** Reviews new listings, mediates disputes, manages bad actors, monitors platform health.

**Goals**
- Review and approve/reject listings efficiently
- Resolve disputes within the 24h SLA
- Identify and remove bad actors before they harm the community
- Monitor GMV, utilization, and ratings health

**Pain points**
- Dispute evidence scattered across messages, photos, and booking records
- No unified view of a user's full history when making a ban decision
- High-value listings require careful review but admin capacity is limited

**What Kitlo must nail for Admin**
- Unified dispute view: booking, messages, photos, both accounts
- One-click approve/reject on listing review with templated feedback
- User history panel: all bookings, disputes, reviews, flags
- Dashboard metrics: GMV, active bookings, dispute rate, avg payout time

---

## Persona × Workflow Matrix

| Workflow | Marcus (P1) | Derek (P2) | Garrett (P3) | Brad (P4) | Cody (P5) | Visitor (P6) | Admin (P7) |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| Registration | ✅ | — | ✅ | ✅ | ✅ | ✅ | — |
| Lister onboarding | — | — | ✅ | ✅ | ✅ | — | — |
| Create listing | — | — | ✅ | ✅ | ✅ | — | — |
| Manage listings | — | — | ✅ | ✅ | ✅ | — | — |
| Search & discovery | ✅ | ✅ | — | — | ✅ | ✅ | — |
| Listing detail | ✅ | ✅ | — | — | ✅ | ✅ | — |
| Booking request | ✅ | ✅ | — | — | ✅ | — | — |
| Payment checkout | ✅ | ✅ | — | — | ✅ | — | — |
| Pre-pickup messaging | ✅ | ✅ | ✅ | ✅ | ✅ | — | — |
| Pickup inspection | ✅ | ✅ | ✅ | ✅ | ✅ | — | — |
| Active rental | ✅ | ✅ | — | — | ✅ | — | — |
| Return confirmation | ✅ | ✅ | ✅ | ✅ | ✅ | — | — |
| Ratings & reviews | ✅ | ✅ | ✅ | ✅ | ✅ | — | — |
| Dispute resolution | ✅ | ✅ | ✅ | ✅ | ✅ | — | ✅ |
| Payouts & earnings | — | — | ✅ | ✅ | ✅ | — | — |
| Notifications | ✅ | ✅ | ✅ | ✅ | ✅ | — | ✅ |
| Identity verification | ✅ | — | ✅ | ✅ | ✅ | — | ✅ |
| Admin: listing review | — | — | — | — | — | — | ✅ |
| Admin: dispute mgmt | — | — | — | — | — | — | ✅ |
| Admin: user mgmt | — | — | — | — | — | — | ✅ |
| Cancellation | ✅ | ✅ | ✅ | ✅ | ✅ | — | — |
| Bundle listing | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | — |
