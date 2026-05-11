# Kitlo — Marketing & Market Validation

> Version 1.0 · 2026-05-11
>
> Living doc for validating whether overlanders will rent gear from peers (demand) and whether owners will list it (supply). A two-sided rental marketplace fails on supply liquidity far more often than on demand, so this checklist weights supply-side validation heavier than it might feel natural to.

---

## 1. The validation question

Before spending another month on code, prove or disprove the three load-bearing assumptions:

1. **Demand exists.** Overlanders, destination hunters, and anglers will pay daily-rate prices to rent gear they don't own, versus (a) buying used, (b) borrowing from a friend, or (c) doing without.
2. **Supply exists.** Owners of $1k–$15k specialty gear will list it for rent on a new platform, at a 10% take rate, with a stranger taking their RTT off-site.
3. **The two sides can find each other in one metro.** Liquidity in a single launch market (Denver / SLC / Boise candidates per overlanding density) is more valuable than scattered national signups.

Everything below is in service of answering those three.

---

## 2. What's done ✅

- [x] **Founder-network conversations** — informal interviews with personal contacts who hunt and camp; collecting reactions to the concept.
- [x] **TikTok account live** — testing whether overlanding/hunting/fly-fishing content earns organic reach.
- [x] **Instagram account live** — parallel channel to TikTok, different demographic skew.
- [x] **Website hosted** — landing pages live, public.
- [x] **Default route → Early Access signup** — every visitor is funneled to the email-capture page. Current signups: **0**.
- [x] **Google Search Console configured** — site submitted for indexation; SEO baseline established.

---

## 3. Demand-side validation (renters)

Goal: prove someone will pay to rent, not just say "cool idea."

### Conversations & qualitative

- [ ] **Structured interviews — 20 target renters.** Not friends. Find them in r/overlanding, r/Hunting, r/flyfishing, ExpeditionPortal, local 4x4 / hunting Facebook groups. Use the Mom Test framing — ask about their last trip, what they had to buy or borrow, what it cost, what gear they wished they had. Don't pitch.
  - Track: did they describe a gear-acquisition pain in their own words *before* you mentioned the concept?
- [ ] **Pricing sensitivity test.** For each interviewee, ask "what would you have paid to rent [the specific item they mentioned] for that trip?" Record the number. You need a distribution, not an average.
- [ ] **Substitution map.** For each "yes I'd rent" response, ask what they'd do *instead*. If "buy used on Craigslist" or "borrow from a buddy" dominates, the wedge is narrower than it looks.

### Quantitative signals

- [ ] **Early Access conversion rate.** Visitors → signups. Current = 0/N. Need to know N. Add a counter (Plausible, GA4, or check Search Console impressions).
  - Healthy: ≥3% of organic landing visitors. Below 1% = messaging or audience problem.
- [ ] **Social engagement rate, not follower count.** TikTok/IG follower counts are vanity. Track: saves, shares, comments-asking-questions, DMs. A 20-comment video from 200 views beats a 50k-view video with zero saves.
- [ ] **Search demand baseline.** Pull search volume for: "rent rooftop tent [city]", "rent thermal scope", "RTT rental near me", "fly fishing waders rental." Use the free tier of Ahrefs / Ubersuggest, or Google Trends. Zero search volume ≠ zero demand, but it tells you whether SEO is a viable channel vs. needing paid + content.
- [ ] **Concierge MVP.** Pick one item (e.g., RTT). Personally source one in Denver. List it. Try to rent it out 3 times via the platform. Track time-to-first-booking and whether the renter would do it again.

### Decision gate — demand
Move forward if any one of these is true after 30 days:
- 5+ qualified interviews where the renter unprompted described a gear pain.
- 20+ Early Access signups from organic traffic with at least 3 replying to a follow-up email.
- Concierge MVP rents the test item ≥2x to different people.

---

## 4. Supply-side validation (listers) ⚠️

This is where 80% of marketplaces die. **Six months of work suggests this is harder than the founder-network gut check implies.** Do this *before* writing more product code.

- [ ] **20 cold-outreach conversations with gear owners.** Find them: ExpeditionPortal build threads, r/overlanding rig photos, Trout Unlimited chapter rosters, hunting forum signatures. Ask: "If I told you you could earn $40/day on your fridge or $80/day on your RTT, would you list it?" Then push: "Cool — can I send you the signup link right now while we're talking?"
  - Track: stated willingness vs. actual signup. Gap is the real activation friction.
- [ ] **Map existing listings in target metros.** Hygglo, FriendWithA, ShareGrid, GearTrade, KitLender (legacy). Count: how many overlanding items are currently rentable in Denver / SLC / Boise / Phoenix? If the count is zero, that's either virgin territory or a graveyard — figure out which by asking the platforms' founders or reading their post-mortems.
- [ ] **Storage / liability objection inventory.** Every conversation, ask: "What's the thing that would make you say no?" Common: damage to the gear, storing it, meeting strangers, scheduling friction. Catalog these — they're product requirements, not objections to argue away.
- [ ] **Identify the 10 "anchor listers" for one metro.** Real names, real gear, real ZIP codes. People who've verbally committed. Without these, launching in that metro is premature regardless of how much demand surfaces.
- [ ] **Trout Unlimited / club partnership outreach.** Phase 2 vertical, but the relationship lead time is long. Email 3 chapter presidents now with a one-paragraph pitch and ask for a call.

### Decision gate — supply
Don't open a metro for public launch until you have:
- ≥10 anchor listers verbally committed (signed lister agreement counts double).
- ≥30 catalogued items across the overlanding anchor categories (RTT, fridge, awning, recovery, power).
- ≥3 listers who own more than one listable item (the "fleet" listers drive 60%+ of GMV in mature marketplaces).

---

## 5. Channel validation

Which acquisition channels actually move the needle.

- [ ] **TikTok — 30-day test.** Post daily. Measure: avg view count, save rate, follower → website CTR (use a UTM link in bio). Cut the format if save rate < 0.5% after 30 posts.
- [ ] **Instagram — 30-day test.** Same metrics, different format (Reels + carousels). Compare CAC-equivalent: which platform's hour-of-effort yields more website visits?
- [ ] **Reddit — manual seeding.** Posts already drafted in `docs/reddit/`. Post one per week per subreddit (any more = ban risk). Track upvote ratio, comment engagement, and DMs received. Reddit drives quality, not volume.
- [ ] **SEO — 90-day baseline.** Search Console is live; now measure. Impressions and average position by week for target queries. Don't expect ranking before month 4. If impressions are flat at month 2, the content isn't targeted enough.
- [ ] **Founder-led content.** A weekly long-form post (Substack / blog) about a real overlanding trip + the gear used. Long-tail SEO compounds; also doubles as supply-side outreach material.
- [ ] **Paid channel — single $200 test.** Meta or Google, one metro, one ad, pointed at Early Access. Goal isn't to acquire users — it's to measure CPL so you know what organic is worth.

---

## 6. Pricing & unit economics validation

- [ ] **Daily-rate benchmarks.** What does Hygglo / FriendWithA / Outdoorsy charge for comparable items? Pull 10 real listings per anchor category.
- [ ] **Utilization expectations.** Ask listers: "How many days a year do you expect to rent this out?" Compare against your business plan assumptions in `docs/business-plan.md`. A 2x gap between assumption and lister expectation kills the model.
- [ ] **Renter willingness-to-pay.** From section 3 interviews. Compare against your daily-rate × days math + 5% renter fee. If the gap is wide, the take rate has no room.
- [ ] **Damage incident rate (research, not data).** What % of bookings result in damage claims on Outdoorsy, Turo, ShareGrid? This is your insurance pricing input. Public Outdoorsy 10-K mentions this — read it.

---

## 7. Decision criteria — kill / pivot / scale

Set these now so you don't move the goalposts later.

| Signal at Day 90 | Action |
|---|---|
| 0–5 anchor listers, 0–10 Early Access signups | **Kill the current GTM.** The concept may still be valid — the channel mix isn't working. Rebuild from scratch or pause. |
| 5–10 anchor listers, 25+ Early Access signups, ≥1 organic story | **Pivot tactically.** Narrow to the single highest-signal vertical + metro. Stop building features; start running the concierge MVP. |
| ≥10 anchor listers, ≥3 confirmed renters via concierge MVP, repeat usage from any of them | **Scale into the metro.** Open public registration in that one ZIP cluster. Don't add metros until first-metro GMV crosses $5k/month. |

---

## 8. Calendar — next 30 days

A checklist is wishful thinking without dates. Fill these in.

- [ ] Week 1: 5 cold-outreach lister conversations + 5 demand interviews.
- [ ] Week 2: Same again. Catalog objections. Update Early Access copy if conversion is still 0.
- [ ] Week 3: Concierge MVP — list one real item in Denver (or chosen metro), post about it.
- [ ] Week 4: Review every metric in sections 3–6. Write a one-page memo: keep, pivot, or kill. Commit it to this doc as `Validation memo — 2026-06-XX`.

---

## 9. Validation memos

Append a dated memo at each decision gate so future-you can see the actual evidence, not the post-hoc story.

<!-- 2026-06-XX — Day 30 memo: [paste here] -->
<!-- 2026-08-XX — Day 90 memo: [paste here] -->
