# r/EntrepreneurRideAlong

**Title:** Validating a P2P rental marketplace for hunting gear — niche is small but vertical, am I deluding myself on TAM?

---

Throwing this up here because this sub has been pretty good at separating "real business" from "founder daydream." I'd rather find out now.

**The concept:** Turo / ShareGrid / Outdoorsy, but for hunting equipment. Hunters list gear they own (optics, thermals, packs, blinds, e-bikes, game carts, calls, decoys, climbers, etc.) and other hunters rent it for the trip or season. **Explicitly no firearms, no bows, no ammo** — that's a regulatory nightmare across state lines and not a fight I want to pick. Optics that bolt onto a renter's own rifle are allowed; the platform never touches the weapon.

**Why I think it could work:**

- ~15M licensed hunters in the US. Not huge, but vertical and brand-loyal — these are people who buy $300 boots and $2,000 binoculars.
- High-ticket gear with low utilization. A $2,500 thermal sits in a safe ~350 days a year. A heated blind goes out 6 weekends. The "infrequent use, high cost" wedge is exactly where rental models work (Turo for second cars, Outdoorsy for RVs).
- Geography forces local commerce. Most hunting is regional, which means liquidity can be built one state at a time instead of trying to boil the ocean nationally on day one.
- Adjacent platforms exist (Sharepal, Arrive Outdoors for camping/general outdoor) but none focus on hunting specifically and none of them have hunters' trust.

**Why I might be wrong:**

- Hunters are notoriously distrustful of "tech bros disrupting hunting." Brand voice and founder credibility matter more than the product. I'm a hunter, but that only buys so much.
- Damage on outdoor gear is way worse than camera gear or cars. Mud, blood, freezing rain, ATV racks. Insurance/deposit math may not pencil. I've modeled it as a 5%/5% take rate (renter fee + lister payout fee = 10% total) plus a damage deposit held via Stripe, but the underwriting question is unsolved.
- Seasonality. Big chunks of the year are dead. Cash flow during summer would be brutal unless I expand into adjacent categories (general backcountry, fishing, etc.) — but expanding too early kills the niche positioning that I think is the whole moat.
- Trust/vetting overhead. Bidirectional reviews + ID verification are table stakes, but resolving "he says it came back broken / she says it was already broken" disputes at scale is a real ops cost I haven't fully priced.

**What I've done so far:**

- Stack picked (Angular + .NET + Postgres + Stripe Connect + Cloudinary). Boring on purpose.
- Gear catalogue scoped, weapons explicitly excluded with policy doc.
- Pricing model drafted (10% take rate at launch, scaling to ~22% at maturity per phased rollout — I don't think I can charge marketplace-mature take rates on day one with no liquidity).
- Read up on state laws around equipment leasing (boring but necessary, varies a lot by state, gear is way easier than land which I'm not touching).

**Where I'd love a punch in the gut:**

1. Is "hunters specifically" a niche or a ghetto? Should I be building "outdoor gear P2P" and just leading with hunting?
2. Anyone built a marketplace in a small-but-loyal vertical? How did you solve cold-start liquidity? I keep coming back to "seed it manually with 100 listings in one state and don't open up nationally until that one state works," but curious how others did it.
3. Damage/deposit underwriting — is this something I can do with a deposit hold + reviews, or am I going to have to actually partner with an insurer before I can grow past hobbyist scale?
4. Take rate. Is 10% laughably low for a niche marketplace or appropriate for cold-start? My read is that Turo charges 15–40% but they have liquidity I won't have for years.

Will share progress and numbers as I go if there's interest. Not selling anything, no link, just want the pressure test.
