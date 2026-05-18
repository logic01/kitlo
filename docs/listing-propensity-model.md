# Listing Propensity Model

How likely is a given owner to list a given piece of gear on Kitlo? This document defines the scoring formula, the variables that feed it, and the logistic form we will switch to once we have observed listing conversions.

The model is utility-based: an owner lists when the expected economic gain outweighs the perceived cost (risk + emotional attachment + friction). The scoring formula below is the prior we use before we have data; the logistic form replaces hand-picked weights with learned ones.

---

## 1. Conceptual formula (utility form)

```
ListingPropensity = NetExpectedUtility / (PerceivedCost + ε)

NetExpectedUtility = ExpectedAnnualRevenue × Horizon - OpportunityCost
PerceivedCost      = ExpectedDamageCost + EmotionalCost + FrictionCost
```

An owner lists when `ListingPropensity ≥ θ`, a personal threshold that is lower for cash-strapped owners and higher for premium-brand loyalists.

---

## 2. Scoring formula (0–100, usable today without data)

```
        (R · I · Y)
LPS = ───────────────────── × 100
       1 + K + L + F + V
```

| Symbol | Meaning | How to estimate | Range |
|---|---|---|---|
| **R** | Rental yield ratio | `rent_per_day / replacement_cost` | typical 0.005–0.05 |
| **I** | Idle fraction | `(365 − owner_use_days) / 365` | 0–1 |
| **Y** | Annual booking potential | expected rental days/year ÷ 30 (cap at ~3) | 0–3 |
| **K** | Perceived risk | damage_prob × repair_severity + irreplaceability | 0–2 |
| **L** | "Love" / emotional attachment | sentimental + customized + signature item | 0–2 |
| **F** | Friction | listing effort + handoff + clean/inspect time per booking | 0–1 |
| **V** | Overvaluation gap | `max(0, owner_valuation/market_price − 1)` | 0–1+ |

The numerator captures upside (yield × time available × demand). The denominator captures drag.

### Variable detail

**R — Rental yield ratio.** A $3,500 RTT at $85/day → R = 0.024. We expect Kitlo's bookable gear to live in the 0.01–0.05 band. Below 0.01 (e.g. a $1,200 pizza oven at $10/day) the rental ratio rarely clears owner expectations. This is the same ratio the gear catalogue uses to foreclose the standalone pizza-oven / smoker vertical in Phase 3.

**I — Idle fraction.** Owner self-reports own-use days per year; we compute idle = 1 − use/365. Most overlanding gear sits idle >90% of the year (the foundational insight behind the marketplace).

**Y — Annual booking potential.** Driven by category demand and seasonality. Overlanding RTTs in Colorado peak May–September; ice augers peak December–February. Cap at ~3 to avoid overstating year-round demand for seasonal gear.

**K — Perceived risk.** Combines three things:
- Damage probability (fly rods break; recovery boards don't).
- Repair severity ($800 to fix a thermal lens; $20 to replace a tent stake).
- Irreplaceability (discontinued models, custom builds, sentimental gear).

Night-vision and thermal optics carry an extra K bump from ITAR / US-Person friction — see `docs/gear-catalogue.md`.

**L — Love.** The hidden killer for fly-fishing and signature optics. A single survey question ("would you let a stranger fish your favorite rod?") will probably outperform any numeric proxy. Customized gear (cerakoted rifles' optics setups, hand-tuned rods) sits high here.

**F — Friction.** First-time listers face F ≈ 0.8 (writing the listing, taking photos, figuring out pickup). Fifth-time listers face F ≈ 0.2. F decays with owner experience and should be modeled as time-varying.

**V — Overvaluation gap.** Captured at listing time: ask the owner what they'd sell it for, compare to Kitlo's median market price. Big V predicts ghost listings (priced too high, never rents, owner abandons).

---

## 3. Logistic form (once we have list / no-list data)

```
logit P(list) = β₀
              + β₁ · log(annual_revenue / replacement_cost)
              + β₂ · idle_fraction
              + β₃ · log(category_demand)
              − β₄ · risk_score
              − β₅ · love_score
              − β₆ · friction_score
              − β₇ · overvaluation
              + β_v · vertical_dummy        (overlanding, optics, fly, ice, …)
              + β_u · owner_traits          (income, prior-lister, urbanicity)
```

Fit with logistic regression on observed listing conversions. Use the scoring formula as the regularization prior so the model is well-behaved with sparse early data.

---

## 4. Worked examples

Rough numbers, illustrative — to be refined once we have category benchmarks.

| Gear | R | I | Y | K | L | F | V | **LPS** |
|---|---|---|---|---|---|---|---|---|
| **Rooftop tent** ($3.5k, $85/day, used 20 nights/yr) | 0.024 | 0.95 | 1.5 | 0.6 | 0.4 | 0.3 | 0.1 | **1.4** |
| **Thermal monocular** ($4k, $90/day, used 15 nights) | 0.022 | 0.96 | 1.2 | 1.1 | 0.5 | 0.2 | 0.2 | **1.0** |
| **12V fridge** ($900, $25/day, used 25 days) | 0.028 | 0.93 | 1.4 | 0.4 | 0.2 | 0.2 | 0.0 | **2.0** |
| **Fly rod combo** ($800, $30/day, used 30 days) | 0.038 | 0.92 | 1.0 | 0.5 | 1.2 | 0.3 | 0.2 | **1.1** |
| **Ice auger (gas)** ($600, $40/day, used 8 days) | 0.067 | 0.98 | 0.6 | 0.5 | 0.2 | 0.4 | 0.1 | **1.8** |
| **Pizza oven** ($1.2k, $35/day, used 6 days) | 0.029 | 0.98 | 0.3 | 0.7 | 0.6 | 0.5 | 0.3 | **0.3** |

Reads cleanly:

- **Fridges and ice augers** are easy listers — high idle, low love, low friction.
- **Fly rods** drag on emotional attachment. The R is excellent but L tanks the score.
- **Pizza ovens** drag on low demand (Y) and friction — matches the Phase 3 "provisional, marginal" call in `CLAUDE.md` and the catalogue.
- **Thermal monoculars** are mid-pack — strong R but K and ITAR/identity friction hold them back. Suggests we should subsidize the friction for night-optics specifically (white-glove onboarding, pre-built bundle templates).

---

## 5. How we use this

1. **Listing form UX.** Ask the variables we cannot derive (owner_use_days, owner_valuation, "would you let a stranger use this?") inline during listing creation. Compute LPS server-side.
2. **Prospect targeting.** Score prospective listers based on gear they post about in r/overlanding, r/icefishing, etc. High-LPS gear + cash-motivated owner = top of the outreach list.
3. **Vertical prioritization.** Aggregate median LPS by vertical. If fly-fishing's median LPS falls below overlanding's by 2x, that's evidence the layered-vertical thesis needs adjustment (e.g. lean into rentals where L is low — waders, boots — over rods).
4. **Pricing nudges.** If V > 0.3 at listing time, surface a "listings priced within 15% of market book 4x more often" nudge before submit.
5. **Listing health.** Re-score active listings monthly. Listings whose LPS drops (owner started using it more, demand softened) get flagged for owner check-in before they go dormant.

---

## 6. Calibration notes

- **R alone is misleading.** A $4k scope at $90/day has the same R as a $400 stove at $9/day, but the scope's K dominates. Always multiply through.
- **L is the hidden killer for fly fishing.** Build the survey to capture it qualitatively, not just numerically.
- **F drops with experience.** Treat as time-varying once an owner has 2+ listings.
- **V** is the cheapest signal to collect and one of the most predictive of dead listings. Capture it from day one.

---

## 7. Open questions

- Threshold θ varies by owner income; do we model that explicitly, or let the logistic regression's owner_traits term absorb it?
- Does L decay with use frequency? An owner who rents out their rod twice without incident may relax — model as Bayesian update on L after each completed booking.
- How do bundles aggregate? `LPS(bundle) ≠ Σ LPS(items)`. Provisional: take the min LPS of any required item (the bundle is bottlenecked by the most reluctant component).
