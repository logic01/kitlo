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

## 3. Phase 0 — paid supply-side validation campaigns

Before committing engineering and capital to the Phase 1 multi-metro rollout (`docs/business-plan.md` §6), Kitlo runs **two parallel paid-ad campaigns**, one per anchor vertical. The two verticals have different supply communities and different beachhead geographies — validating them together avoids over-fitting the platform to either.

**Why supply, not demand?** Demand ("overlanders want to rent gear" / "hunters want to rent gear") is plausible by default and can be validated through forums (ExpeditionPortal, r/overlanding, HuntTalk, Predator Masters, Texas Hunting Forum) and shop visits at zero cost. Supply ("overlanders will lend their $4,000 RTT to a stranger" / "hunters will lend their $3,000 thermal to a stranger") is the actual business risk. The $100 per market buys signal on the harder question.

### Phase 0a — Denver overlanding validation

**Test bed:** Denver / Boulder, CO. Highest concentration of ExpeditionPortal-active overlanders per capita; gateway to high-elevation routes; affluent transplants who own RTTs, 12V fridges, and dual-battery setups that sit idle 60% of the year.

| Field | Value |
|---|---|
| Budget | $100 over 10 days ($10/day) |
| Geo | Denver + Boulder + 30 mi radius |
| Demographic | Men + women 28–50 |
| Interest stack (AND) | ExpeditionPortal OR Overland Bound OR ARB OR iKamper OR Dometic OR Goose Gear + (Toyota 4Runner OR Tacoma OR Lexus GX OR Jeep Wrangler OR Land Cruiser) |
| Objective | Leads (instant form) — supply-side waitlist |
| Creative | Truck + RTT photo at trailhead. Headline: "Your iKamper sits in the garage 8 months a year." Subhead: "List it on Kitlo. Keep 95%. Denver overlanders launching first." CTA: "Get early access." |

### Phase 0b — Bozeman hunting optics validation

**Test bed:** Bozeman, MT. Already wired in the existing codebase.

| Field | Value |
|---|---|
| Budget | $100 over 10 days ($10/day) |
| Geo | Bozeman + 30 mi radius |
| Demographic | Men 28–55 |
| Interest stack (AND) | MeatEater + (Sitka OR Kuiu OR First Lite OR Stone Glacier OR Vortex Optics OR Pulsar) + OnX Hunt |
| Objective | Leads (instant form) — supply-side waitlist |
| Creative | Real tailgate/truck-bed photo of a thermal monocular. Headline: "Your $3,000 thermal sits in a closet 11 months a year." Subhead: "List it on Kitlo. Keep 95%. Bozeman hunters launching first." CTA: "Get early access." |

### Decision criteria (per market)

| Outcome (10-day window) | Signal | Action |
|---|---|---|
| ≥ 10 email signups | Lister-side intent confirmed | Scale to $500 spend; begin onboarding waitlist into closed beta. |
| 3–9 signups | Ambiguous | Rerun with renter-side framing; if still weak, revisit creative, not thesis. |
| 0–2 signups | Targeting/creative likely broken | Diagnose; do not kill thesis on $100 of data. |

### Parallel zero-cost validation (run alongside the ad tests)

- **Overlanding:** posts in ExpeditionPortal Vendor section (with permission), r/overlanding, r/CherokeeXJ, r/4Runner, Overland Bound forum asking "would you list/rent your kit?"
- **Hunting optics:** posts in HuntTalk, Predator Masters, Texas Hunting Forum, RokSlide, ArcheryTalk.
- **In person:** 3 visits each to overlanding outfitters (Adventure Wagons, RoamRig, local 4WD shops) and hunting/archery shops in the respective beachheads. RMEF/DU/ExpeditionPortal Big Thing event attendance where the timing fits.

### What Phase 0 informs

- Go / no-go on the Phase 1 plan in `docs/business-plan.md` §6 ($100k profit at 3 active metros).
- Determines whether overlanding or optics is the stronger primary vertical to lead Phase 1 launch comms with.
- Overlanding result determines the second overlanding metro (candidates: Seattle/Bellingham, Phoenix, Salt Lake City).
- Optics result determines the second optics metro (candidates: San Antonio/Austin, Minneapolis).

Phase 0 outcomes feed into the §5 (Q1 organic outreach) and §6 (Q3 concierge supply) workstreams below — both of which depend on knowing which metro pair survived Phase 0 ad testing before they scale.

---

## 4. Demand-side validation (renters)

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

## 5. Supply-side validation — Q1 organic outreach ⚠️

This is where 80% of marketplaces die. The supply problem is **not homogeneous**: per the LPS × RDS 2×2 in `docs/rental-demand-model.md` §6, some SKUs (Q1 wedge) attract listings cheaply through community channels, while others (Q3) require a separate concierge workstream (covered in §6 below). This section handles the Q1 organic outreach. **Do this *before* writing more product code.**

### The Q1 wedge — five SKUs to prioritize

Cold supply outreach should be **SKU-prioritized**, not generic. The five SKUs below have both high listing propensity (LPS > 1.0) and high renter demand (RDS > 70 — see `docs/rental-demand-model.md` §6 Q1). Owners are receptive; bookings will follow.

| Q1 SKU | LPS | RDS | Where the owners live | First-message hook |
|---|---|---|---|---|
| **Softshell rooftop tent** | 1.56 | 141 | ExpeditionPortal build threads, r/overlanding rig posts, Overland Bound chapters, Tepui / ARB Esperance / Smittybilt owner FB groups | "Your Esperance sits idle 9 months a year — list it on Kitlo, keep 95%." |
| **Hardshell rooftop tent** | 1.07 | 130 | Same as softshell + iKamper / Roofnest / Alu-Cab owner FB groups | Same hook; emphasize Kitlo's vehicle-fit attestation at handoff so owners feel protected. |
| **Handheld thermal monocular** | 1.69 | 80 | HuntTalk thermal threads, Predator Masters (the verbatim P2P thermal rental thesis is there), Texas Hunting Forum, RokSlide. Avoid r/Hunting — too generic. | "Your Axion / Bering / RIX Storm sits in a closet 11 months a year — list it. We handle ID + ITAR." |
| **NV monocular** | 1.24 | 70 | Same hunting forums + Pulsar / Sionyx / NVD owner groups. ITAR US-Person attestation required. | Same hook; emphasize identity-tier protection from day one. |
| **Large LFP power station (bundled)** | 1.19 | 101 | ExpeditionPortal "power" subforum, Jackery / Goal Zero / EcoFlow / Bluetti owner FB groups, vanlife subreddits | "Your EcoFlow Delta Pro sits idle — bundle it with your overlanding kit and earn $50/day on top of the RTT booking." |

### Outreach checklist (SKU-prioritized)

- [ ] **5 cold-outreach conversations per Q1 SKU = 25 total.** Find owners by SKU community, not generic "overlanders" or "hunters". Track stated willingness vs. actual signup per SKU — the gap is the real activation friction and may differ by SKU.
- [ ] **Map existing listings in target metros, by SKU.** Hygglo, FriendWithA, ShareGrid, GearTrade. Count specifically: how many softshell RTTs are listed in Denver? How many handheld thermal monoculars in Bozeman? Zero per SKU is either virgin territory or a graveyard — verify which.
- [ ] **Storage / liability objection inventory.** Every conversation, ask: "What's the thing that would make you say no?" Catalog by SKU — softshell RTT owners worry about vehicle-fit mismatches; thermal owners worry about lens damage; power-station owners worry about thermal events. These are product requirements, not objections to argue away.
- [ ] **Identify Q1 anchor listers, by SKU coverage.** Target list — across the three Phase 1 metros, by SKU. The metro doesn't "open" until all five Q1 SKUs have ≥3 active listings each.
- [ ] **Fleet-lister identification.** Owners who hold 3+ Q1 SKUs (RTT + power station + awning + fridge typical bundle stack). Fleet listers drive 60%+ of GMV in mature marketplaces and are the primary acquisition target for "Weekend overland" bundle listings.

### Decision gate — Q1 supply

Don't open a metro for public launch until **all** of these are true:

- ≥3 listings per Q1 SKU active in the metro (15 listings minimum across the wedge).
- ≥10 anchor listers verbally committed across the wedge — signed lister agreement counts double.
- ≥3 fleet listers (owners with 3+ active listings each, packaged as Weekend overland or Hunting optics bundles).
- Combined Q1 + Q3 (from §6) clears the metro's open threshold per `docs/geographic-liquidity-model.md` §4.

The old "≥30 catalogued items across the overlanding anchor categories" framing under-specified the bundle composition: a metro with 30 RTTs and zero fridges fails the search experience for any renter who searches "overland kit." SKU coverage replaces aggregate count.

---

## 6. Supply-side validation — Q3 Concierge Supply Playbook

Per `docs/rental-demand-model.md` §6 Q3 and `docs/business-plan.md` §5 "Concierge Supply Acquisition workstream", a distinct class of SKUs sits in the **Q3 quadrant**: low listing propensity (LPS), high rental demand (RDS). NVGs, thermal rifle scopes, premium fly rods, clip-on optics, sat communicators, XL power stations.

**Why this is a different workstream than §5:**

Cold outreach to an RTT owner gets a 15–25% response rate at near-zero CAC — the value prop is self-evident. Cold outreach to a PVS-14 owner gets a 1–3% response rate even with a strong pitch, because the owner is attached to the gear, ITAR-conscious, and unaccustomed to lending. Bridging the gap is not a question of more impressions — it's a question of removing concrete friction: damage anxiety (custom protection), identity worry (white-glove ID-tier insurance), handling concern (Kitlo-mediated pickup), and trust (founder-personal onboarding).

**The four-channel playbook:**

| Channel | Targets | Phase 1 budget | Success metric |
|---|---|---|---|
| **Manufacturer / dealer seeding** | Sionyx, Steiner, ATN, Pulsar, RIX, AGM (optics); Garmin, Starlink (sat-comm); Sage, Hatch, Galvan (fly rods, Phase 2); EcoFlow, Bluetti (XL power) | ~$0–2k cash; 30–40 founder hours | 1–3 partnership conversations open; ≥1 closed with ≥5 seeded units |
| **Guide / outfitter partnerships** | TX hog hunting guides; MT hunting outfitters; Trout Unlimited chapter-affiliated guides (Phase 2 prep); Overland Expo outfitters | ~$0–500 per partnership | 3–5 outfitters with ≥1 listing each |
| **Lister incentive program** | Individual high-end owners identified via HuntTalk thermal threads, Predator Masters NV threads, ExpeditionPortal premium-rig threads | ~$200/seeded listing × 15–20 units = $3–4k | 15–20 seeded Q3 listings live across Bozeman + San Antonio |
| **Founder direct outreach** | Same individual-owner channels; founder calls / DMs only after a community-context warm intro | Founder time (~60 hours over 6 months) | 5–10 founder-onboarded listings |

**Concrete Phase 1 targets (per `docs/geographic-liquidity-model.md` and `docs/business-plan.md` §6):**

- **Bozeman:** 7–8 seeded NV / scope listings (PVS-14s, thermal rifle scopes, clip-on thermals / NV)
- **San Antonio / Austin:** 7–8 seeded NV / scope listings (Phase 0b outcome dependent)
- **Cross-metro (shippable):** 2–3 sat-communicator listings (single nationwide pool)
- **Total Phase 1: ~15–20 Q3 seeded units**

**Operational checklist:**

- [ ] **Build a brand outreach target list.** Sionyx, Steiner, ATN, Pulsar, RIX, AGM, Garmin, Starlink. Email each with a one-paragraph TBYB-partnership pitch.
- [ ] **Build a guide-outfitter target list.** TX hog guides: 10 names. MT hunting outfitters: 5 names. Reference: HuntTalk outfitter threads + Texas Hunting Forum guide directory.
- [ ] **Design the lister incentive package.** Document the offer (first-month protection waived, white-glove photo, identity-tier insurance from day one, dedicated founder onboarding call). One-pager that can be sent to a prospective lister.
- [ ] **Identify 30 individual Q3 owners across both metros.** Real names from forum signatures, rig threads, Predator Masters bundle threads. Real outreach targets.
- [ ] **Track seeded units by source.** Maintain a Phase 1 ledger: which Q3 listings came from manufacturer seeding vs. outfitter partnership vs. individual incentive vs. founder direct. This tells you which channel scales for Phase 2 metro adds.

### Decision gate — Q3 supply

Don't open a metro for night-optics public marketing until:

- ≥7 Q3 seeded listings active per anchor optics metro (Bozeman, San Antonio).
- At least one closed manufacturer or guide-outfitter partnership in the metro (resilience: if one Q3 lister churns, the partnership pipeline is still warm).
- The thermal-detect + NV-engage **bundle** product has at least 3 listable bundle pairs in the metro (a thermal handheld + an NV scope from the same lister, or a manufacturer-seeded pair).

The Q3 floor is the bundle product's existence. Without Q3 NV supply, Kitlo's night-optics offering reverts to thermal-standalone — and that puts the platform head-to-head against UNV and Feral Texas with no structural advantage.

---

## 7. Channel validation

Which acquisition channels actually move the needle. **Treat channels as SKU-specific, not platform-generic** — the right channel for an RTT owner is different from the right channel for an NV scope owner, and lumping them produces dilute campaigns that don't convert either.

### SKU → channel mapping

This is the actual supply-side acquisition surface, mapped to where each Q1 / Q3 SKU's owners actually congregate.

| SKU | Primary channel | Secondary channel | Why this channel |
|---|---|---|---|
| **Softshell / hardshell RTT** | ExpeditionPortal build threads + Overland Bound chapters | r/overlanding rig posts, Instagram #overlanding | RTT owners self-identify on ExpeditionPortal more than any other community. r/overlanding is mostly aspirational viewers. |
| **12V fridge** | ExpeditionPortal galley subforum | r/overlanding, Dometic / ARB / Iceco owner FB groups | Same community; different subforum. Fridge owners cluster around galley discussions. |
| **Awning / camp kitchen / dual-battery** | ExpeditionPortal vehicle-build threads | Vehicle-specific subreddits (r/4Runner, r/Tacoma, r/CherokeeXJ, r/Wrangler) | Owners post these inside whole-rig build threads, not as standalone items. |
| **Handheld thermal monocular** | HuntTalk thermal threads + Predator Masters | Texas Hunting Forum, RokSlide | Predator Masters has the verbatim P2P thermal rental thesis posted by a member — warm community. |
| **NV monocular** | Same hunting forums + Pulsar / Sionyx / NVD owner groups | Reddit r/NightVision (smaller, specialist) | ITAR-aware; need US-Person attestation at signup. r/Hunting is too generic. |
| **NV goggles / scopes / clip-on thermals** (Q3) | Sniper's Hide ("Thermal Rental Suggestions" thread is a sourced demand signal) + Predator Masters | Manufacturer co-marketing | Q3 SKUs require the §6 concierge playbook — these channels are augmented, not replaced, by founder direct outreach. |
| **Large LFP power station** | ExpeditionPortal power subforum + vanlife subreddits (r/vandwellers, r/vanlife) | Owner FB groups (Jackery, Goal Zero, EcoFlow, Bluetti, Anker Solix) | Bundled with overlanding listings — riding overlanding's channels has marginal CAC near zero. |
| **Premium fly rod / waders / wading boots** (Phase 2 layered) | Trout Unlimited chapter network (300+ chapters) | r/flyfishing, Fly Fishing Forum, local fly shops in non-destination towns | CastBack/TU partnership (2025) is the precedent; chapter-by-chapter sponsorship is the channel. |
| **Sat communicator** (Q3, nationwide pool) | Manufacturer partnership (Garmin, Starlink) | ExpeditionPortal Communications subforum + remote-work overlanding groups | Plan-transfer friction means founder-onboarded direct outreach + retailer partnership outperforms community cold outreach. |

**Implication:** The TikTok / Instagram / Reddit / SEO channels in the renter-side list below are **renter-side** acquisition channels (and brand surface area), not the supply-side acquisition channels above. The supply channels in this table operate independently and on different timeline — a 30-day TikTok test informs renter-side CAC; supply density is built through the channels above over 3–9 months.

### Renter-side (consumer) channels — 30-day tests

- [ ] **TikTok — 30-day test.** Post daily. Measure: avg view count, save rate, follower → website CTR (use a UTM link in bio). Cut the format if save rate < 0.5% after 30 posts.
- [ ] **Instagram — 30-day test.** Same metrics, different format (Reels + carousels). Compare CAC-equivalent: which platform's hour-of-effort yields more website visits?
- [ ] **Reddit — manual seeding.** Posts already drafted in `docs/reddit/`. Post one per week per subreddit (any more = ban risk). Track upvote ratio, comment engagement, and DMs received. Reddit drives quality, not volume.
- [ ] **SEO — 90-day baseline.** Search Console is live; now measure. Impressions and average position by week for target queries. Don't expect ranking before month 4. If impressions are flat at month 2, the content isn't targeted enough.
- [ ] **Founder-led content.** A weekly long-form post (Substack / blog) about a real overlanding trip + the gear used. Long-tail SEO compounds; also doubles as supply-side outreach material.
- [ ] **Paid channel — single $200 test.** Meta or Google, one metro, one ad, pointed at Early Access. Goal isn't to acquire users — it's to measure CPL so you know what organic is worth.

---

## 8. Pricing & unit economics validation

- [ ] **Daily-rate benchmarks.** What does Hygglo / FriendWithA / Outdoorsy charge for comparable items? Pull 10 real listings per anchor category.
- [ ] **Utilization expectations.** Ask listers: "How many days a year do you expect to rent this out?" Compare against your business plan assumptions in `docs/business-plan.md`. A 2x gap between assumption and lister expectation kills the model.
- [ ] **Renter willingness-to-pay.** From section 3 interviews. Compare against your daily-rate × days math + 5% renter fee. If the gap is wide, the take rate has no room.
- [ ] **Damage incident rate (research, not data).** What % of bookings result in damage claims on Outdoorsy, Turo, ShareGrid? This is your insurance pricing input. Public Outdoorsy 10-K mentions this — read it.

---

## 9. Decision criteria — kill / pivot / scale

Set these now so you don't move the goalposts later. Thresholds reference **Q1 wedge SKU coverage** and **bundle-attached listing counts** rather than generic listing counts, per the bundle-required policy in `docs/gear-catalogue.md` §"Bundle-Required SKUs (Q2 Ghost Listings)" and the LPS × RDS findings in `docs/rental-demand-model.md` §6.

| Signal at Day 90 | Action |
|---|---|
| Fewer than 2 Q1 wedge SKUs with ≥3 listings; 0–10 Early Access signups; no fleet listers identified | **Kill the current GTM.** The concept may still be valid — the channel mix isn't working. Rebuild from scratch or pause. |
| 3–4 Q1 wedge SKUs with ≥3 listings; 25+ Early Access signups; ≥1 organic story; 1–2 fleet listers identified | **Pivot tactically.** Narrow to the single highest-signal vertical + metro. Stop building features; start running the concierge MVP on the strongest Q1 SKU in the strongest metro. |
| All 5 Q1 wedge SKUs with ≥3 listings; ≥3 fleet listers each owning 3+ Q1 SKUs; ≥3 confirmed renters via concierge MVP with repeat usage from any; **at least one packaged Weekend overland bundle live**; ≥7 Q3 seeded listings live (Bozeman or San Antonio) | **Scale into the metro.** Open public registration in that one ZIP cluster. Don't add metros until first-metro GMV crosses $5k/month. |

**Why "bundle-attached" matters:** A metro with 30 standalone listings spread across 30 different SKUs is not a working marketplace — it's a graveyard search experience. A metro with 15 listings organized as 3 fleet listers each providing a 5-component Weekend overland bundle plus 7 Q3 seeded units is a working marketplace. The count is the same; the structure is different. Bundle attachment is the marketplace's structural unit, not individual listings.

---

## 10. Calendar — next 30 days

A checklist is wishful thinking without dates. The 30-day plan prioritizes **Q1 wedge SKU outreach in Weeks 1–2** (where response rates are high and CAC is near-zero) and **starts the Q3 concierge workstream in Weeks 3–4** (where lead times are long and need a parallel start).

**Week 1 — Q1 wedge SKU outreach round 1**
- [ ] 3 cold-outreach conversations targeting RTT owners (softshell or hardshell) on ExpeditionPortal build threads. Use the SKU-specific hook from §5.
- [ ] 3 cold-outreach conversations targeting handheld thermal monocular owners on HuntTalk / Predator Masters.
- [ ] 3 demand interviews with destination overlanders / hunters (Mom-Test framing per §4).
- [ ] Map existing competitive listings in Denver (RTTs) and Bozeman (thermal). Per-SKU count.

**Week 2 — Q1 wedge SKU outreach round 2**
- [ ] 3 cold-outreach conversations targeting NV monocular owners on hunting forums + Pulsar / Sionyx / NVD owner groups.
- [ ] 3 cold-outreach conversations targeting power station owners (bundle-fit). Use the "earn $50/day on top of your overlanding kit booking" hook.
- [ ] 3 cold-outreach conversations targeting 12V fridge owners on ExpeditionPortal galley subforum.
- [ ] Catalog Week 1 + Week 2 objections by SKU — these become product requirements, not arguments.
- [ ] Identify candidate fleet listers (owners with 3+ Q1 SKUs) from the 20+ conversations so far.

**Week 3 — Q3 concierge workstream kickoff + concierge MVP**
- [ ] Build the brand outreach target list (Sionyx, Steiner, ATN, Pulsar, RIX, AGM, Garmin, Starlink). Email each with the one-paragraph TBYB-partnership pitch.
- [ ] Build the guide/outfitter target list. 10 TX hog guides + 5 MT hunting outfitters.
- [ ] Concierge MVP — list one real Q1 SKU in Denver or Bozeman. Personally source or borrow. Document the listing process from the lister side; identify product friction.

**Week 4 — Q3 concierge first round + 30-day memo**
- [ ] 5 founder-direct outreach conversations with individual Q3 owners (NVG / thermal scope) identified from Predator Masters / Sniper's Hide / HuntTalk threads. Use the lister incentive package designed in §6.
- [ ] Review every metric in sections 3–6 by SKU. Don't aggregate.
- [ ] Write a one-page memo: keep, pivot, or kill. Reference the Day-90 decision criteria in §9 — Q1 wedge SKU coverage, fleet-lister identification, Q3 concierge progress.
- [ ] Commit memo to this doc as `Validation memo — 2026-06-XX`.

---

## 11. Validation memos

Append a dated memo at each decision gate so future-you can see the actual evidence, not the post-hoc story.

<!-- 2026-06-XX — Day 30 memo: [paste here] -->
<!-- 2026-08-XX — Day 90 memo: [paste here] -->
