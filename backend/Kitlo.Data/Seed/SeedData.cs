using Kitlo.Core.Enums;
using Kitlo.Core.Models;
using Microsoft.EntityFrameworkCore;

namespace Kitlo.Data.Seed;

/// <summary>
/// Idempotent dev seed. Call from <c>Program.cs</c> when <c>app.Environment.IsDevelopment()</c>
/// is true. Production seeding (categories, etc.) lives in dedicated migrations.
///
/// To pick up a refreshed seed mix on an existing dev DB, drop the volume:
/// <c>docker compose down -v &amp;&amp; docker compose up -d</c>.
/// </summary>
public static class SeedData
{
    public static async Task ApplyAsync(KitloDbContext db, Func<string, string> hashPassword, CancellationToken ct = default)
    {
        if (await db.Users.AnyAsync(ct)) return; // already seeded

        // Hash "password" at seed time so the hash can't drift out of sync with the verifier.
        var demoHash = hashPassword("password");

        var renter = new User
        {
            Email = "sam@example.com",
            PasswordHash = demoHash,
            Name = "Sam Hunter",
            City = "Aurora",
            State = "CO",
            Role = UserRole.Renter,
            EmailVerified = true,
            JoinedAt = DateTimeOffset.UtcNow.AddMonths(-7)
        };
        var lister = new User
        {
            Email = "jess@example.com",
            PasswordHash = demoHash,
            Name = "Jess Park",
            City = "Boulder",
            State = "CO",
            Role = UserRole.Lister,
            EmailVerified = true,
            IdentityVerified = true,
            JoinedAt = DateTimeOffset.UtcNow.AddYears(-1)
        };
        var admin = new User
        {
            Email = "lee@kitlo.com",
            PasswordHash = demoHash,
            Name = "Lee Brown",
            City = "Denver",
            State = "CO",
            Role = UserRole.Admin,
            EmailVerified = true,
            IdentityVerified = true,
            JoinedAt = DateTimeOffset.UtcNow.AddYears(-2)
        };
        db.Users.AddRange(renter, lister, admin);

        // ---------- Hunting optics (legacy seed pair) ----------
        var thermal = new Listing
        {
            Title = "Pulsar Thermion 2 XQ50 Pro",
            Vertical = Vertical.HuntingOptics,
            GearType = GearType.Thermal,
            GearTypeLabel = "Thermal",
            Condition = Condition.FieldReady,
            Description = "Pristine Pulsar Thermion 2 XQ50 Pro. Used 4 seasons. Includes carry case, two batteries, charger.",
            PickupZip = "80301",
            DailyRateCents = 8500,
            DepositCents = 50000,
            Status = ListingStatus.Published,
            Lister = lister,
            PublishedAt = DateTimeOffset.UtcNow.AddDays(-30),
            RatingAverage = 4.8,
            RatingCount = 12
        };
        thermal.Photos.Add(new ListingPhoto { Url = "https://placehold.co/640x480/333/eee?text=Thermion+1", IsHero = true, Ordinal = 0 });
        thermal.Photos.Add(new ListingPhoto { Url = "https://placehold.co/640x480/333/eee?text=Thermion+2", Ordinal = 1 });
        thermal.Photos.Add(new ListingPhoto { Url = "https://placehold.co/640x480/333/eee?text=Thermion+3", Ordinal = 2 });
        thermal.Specs.Add(new ListingSpec { Key = "Resolution", Value = "640x480", Ordinal = 0 });
        thermal.Specs.Add(new ListingSpec { Key = "Detection range", Value = "1800m", Ordinal = 1 });
        thermal.Specs.Add(new ListingSpec { Key = "Magnification", Value = "3.5–14x", Ordinal = 2 });

        var nv = new Listing
        {
            Title = "ATN X-Sight 4K Pro",
            Vertical = Vertical.HuntingOptics,
            GearType = GearType.NightVision,
            GearTypeLabel = "Night vision",
            Condition = Condition.Mint,
            Description = "ATN X-Sight 4K Pro day/night scope, used twice. Comes with mounting hardware.",
            PickupZip = "80305",
            DailyRateCents = 6500,
            DepositCents = 40000,
            Status = ListingStatus.Published,
            Lister = lister,
            PublishedAt = DateTimeOffset.UtcNow.AddDays(-20),
            RatingAverage = 4.6,
            RatingCount = 5
        };
        nv.Photos.Add(new ListingPhoto { Url = "https://placehold.co/640x480/333/eee?text=ATN+1", IsHero = true, Ordinal = 0 });
        nv.Photos.Add(new ListingPhoto { Url = "https://placehold.co/640x480/333/eee?text=ATN+2", Ordinal = 1 });
        nv.Photos.Add(new ListingPhoto { Url = "https://placehold.co/640x480/333/eee?text=ATN+3", Ordinal = 2 });

        // ---------- Overlanding (anchor vertical) ----------
        var rtt = new Listing
        {
            Title = "Roofnest Sparrow Eye XL",
            Vertical = Vertical.Overlanding,
            GearType = GearType.RooftopTent,
            GearTypeLabel = "Rooftop tent",
            Condition = Condition.Mint,
            Description = "Hard-shell aerodynamic rooftop tent. Sleeps 2 adults, mounts to factory crossbars in under 10 minutes. Two seasons on a 4Runner. Includes ladder, mattress, and storage cover.",
            PickupZip = "80301",
            DailyRateCents = 11000,
            DepositCents = 60000,
            Status = ListingStatus.Published,
            Lister = lister,
            PublishedAt = DateTimeOffset.UtcNow.AddDays(-12),
            RatingAverage = 4.9,
            RatingCount = 8
        };
        rtt.Photos.Add(new ListingPhoto { Url = "https://placehold.co/640x480/4a5d3a/eee?text=RTT+Closed", IsHero = true, Ordinal = 0 });
        rtt.Photos.Add(new ListingPhoto { Url = "https://placehold.co/640x480/4a5d3a/eee?text=RTT+Open", Ordinal = 1 });
        rtt.Photos.Add(new ListingPhoto { Url = "https://placehold.co/640x480/4a5d3a/eee?text=Mounted", Ordinal = 2 });
        rtt.Specs.Add(new ListingSpec { Key = "Mount type", Value = "Crossbar (factory or aftermarket)", Ordinal = 0 });
        rtt.Specs.Add(new ListingSpec { Key = "Load rating (lbs)", Value = "650", Ordinal = 1 });
        rtt.Specs.Add(new ListingSpec { Key = "Sleeping capacity", Value = "2 adults", Ordinal = 2 });
        rtt.Specs.Add(new ListingSpec { Key = "Setup time (min)", Value = "5–10", Ordinal = 3 });

        var awning = new Listing
        {
            Title = "ARB Series III 2500 awning",
            Vertical = Vertical.Overlanding,
            GearType = GearType.Awning,
            GearTypeLabel = "Awning",
            Condition = Condition.FieldReady,
            Description = "ARB 2500 awning, 8.2x8.2 ft. Wall-mount or rack-mount brackets included. Lightly weathered, no tears.",
            PickupZip = "80301",
            DailyRateCents = 3000,
            DepositCents = 18000,
            Status = ListingStatus.Published,
            Lister = lister,
            PublishedAt = DateTimeOffset.UtcNow.AddDays(-10),
            RatingAverage = 4.7,
            RatingCount = 4
        };
        awning.Photos.Add(new ListingPhoto { Url = "https://placehold.co/640x480/8a6b3a/eee?text=Awning+1", IsHero = true, Ordinal = 0 });
        awning.Photos.Add(new ListingPhoto { Url = "https://placehold.co/640x480/8a6b3a/eee?text=Awning+2", Ordinal = 1 });
        awning.Photos.Add(new ListingPhoto { Url = "https://placehold.co/640x480/8a6b3a/eee?text=Awning+3", Ordinal = 2 });
        awning.Specs.Add(new ListingSpec { Key = "Coverage (ft)", Value = "8.2 x 8.2", Ordinal = 0 });
        awning.Specs.Add(new ListingSpec { Key = "Mount type", Value = "Rack or wall", Ordinal = 1 });
        awning.Specs.Add(new ListingSpec { Key = "Setup time (min)", Value = "3", Ordinal = 2 });

        var fridge = new Listing
        {
            Title = "Dometic CFX3 55IM",
            Vertical = Vertical.Overlanding,
            GearType = GearType.Fridge12V,
            GearTypeLabel = "12V fridge / freezer",
            Condition = Condition.Mint,
            Description = "Dometic CFX3 55IM with internal ice maker. 53L capacity, runs cleanly off a dual-battery setup or a 200Wh+ power station. Insulated cover included.",
            PickupZip = "80301",
            DailyRateCents = 4500,
            DepositCents = 25000,
            Status = ListingStatus.Published,
            Lister = lister,
            PublishedAt = DateTimeOffset.UtcNow.AddDays(-8),
            RatingAverage = 5.0,
            RatingCount = 3
        };
        fridge.Photos.Add(new ListingPhoto { Url = "https://placehold.co/640x480/465159/eee?text=Fridge+1", IsHero = true, Ordinal = 0 });
        fridge.Photos.Add(new ListingPhoto { Url = "https://placehold.co/640x480/465159/eee?text=Fridge+Open", Ordinal = 1 });
        fridge.Photos.Add(new ListingPhoto { Url = "https://placehold.co/640x480/465159/eee?text=Mounted", Ordinal = 2 });
        fridge.Specs.Add(new ListingSpec { Key = "Capacity (L)", Value = "53", Ordinal = 0 });
        fridge.Specs.Add(new ListingSpec { Key = "Power draw (W)", Value = "45 cycling", Ordinal = 1 });
        fridge.Specs.Add(new ListingSpec { Key = "Voltage", Value = "12/24V DC + 110V AC", Ordinal = 2 });

        var recovery = new Listing
        {
            Title = "MaxTrax MKII recovery board pair",
            Vertical = Vertical.Overlanding,
            GearType = GearType.RecoveryBoard,
            GearTypeLabel = "Recovery boards",
            Condition = Condition.FieldReady,
            Description = "Genuine MaxTrax MKII pair with mounting pins. Some sand-blasted teeth from a Sand Hollow weekend, full structural integrity.",
            PickupZip = "80305",
            DailyRateCents = 2200,
            DepositCents = 12000,
            Status = ListingStatus.Published,
            Lister = lister,
            PublishedAt = DateTimeOffset.UtcNow.AddDays(-6),
            RatingAverage = 4.5,
            RatingCount = 2
        };
        recovery.Photos.Add(new ListingPhoto { Url = "https://placehold.co/640x480/c97a3d/eee?text=MaxTrax+1", IsHero = true, Ordinal = 0 });
        recovery.Photos.Add(new ListingPhoto { Url = "https://placehold.co/640x480/c97a3d/eee?text=MaxTrax+2", Ordinal = 1 });
        recovery.Photos.Add(new ListingPhoto { Url = "https://placehold.co/640x480/c97a3d/eee?text=Mounted", Ordinal = 2 });
        recovery.Specs.Add(new ListingSpec { Key = "Material", Value = "Engineering-grade nylon", Ordinal = 0 });
        recovery.Specs.Add(new ListingSpec { Key = "Length (in)", Value = "45", Ordinal = 1 });
        recovery.Specs.Add(new ListingSpec { Key = "Pair count", Value = "2", Ordinal = 2 });

        // ---------- Power station ----------
        var power = new Listing
        {
            Title = "Bluetti AC180 power station",
            Vertical = Vertical.PowerStation,
            GearType = GearType.PowerStation,
            GearTypeLabel = "Power station",
            Condition = Condition.Mint,
            Description = "Bluetti AC180. 1152Wh capacity, 1800W AC out, 1440W solar input. Runs the fridge for 24+ hours; pairs with the Dometic CFX3 listing for a base-camp combo.",
            PickupZip = "80301",
            DailyRateCents = 3800,
            DepositCents = 30000,
            Status = ListingStatus.Published,
            Lister = lister,
            PublishedAt = DateTimeOffset.UtcNow.AddDays(-4),
            RatingAverage = 4.8,
            RatingCount = 2
        };
        power.Photos.Add(new ListingPhoto { Url = "https://placehold.co/640x480/2c3137/eee?text=Bluetti+1", IsHero = true, Ordinal = 0 });
        power.Photos.Add(new ListingPhoto { Url = "https://placehold.co/640x480/2c3137/eee?text=Bluetti+2", Ordinal = 1 });
        power.Photos.Add(new ListingPhoto { Url = "https://placehold.co/640x480/2c3137/eee?text=Bluetti+3", Ordinal = 2 });
        power.Specs.Add(new ListingSpec { Key = "Capacity (Wh)", Value = "1152", Ordinal = 0 });
        power.Specs.Add(new ListingSpec { Key = "AC output (W)", Value = "1800", Ordinal = 1 });
        power.Specs.Add(new ListingSpec { Key = "UL 9540/2743 cert #", Value = "UL 2743 (E517123)", Ordinal = 2 });

        // ---------- Fly fishing (Phase 2 vertical seed so the picker isn't empty) ----------
        var waders = new Listing
        {
            Title = "Simms G3 Guide stockingfoot waders (M)",
            Vertical = Vertical.FlyFishing,
            GearType = GearType.Wader,
            GearTypeLabel = "Wader",
            Condition = Condition.FieldReady,
            Description = "Simms G3 Guide stockingfoot, men's medium. One season of guided trips. Patches included for the rare leak.",
            PickupZip = "80301",
            DailyRateCents = 2500,
            DepositCents = 15000,
            Status = ListingStatus.Published,
            Lister = lister,
            PublishedAt = DateTimeOffset.UtcNow.AddDays(-2),
            RatingAverage = 0,
            RatingCount = 0
        };
        waders.Photos.Add(new ListingPhoto { Url = "https://placehold.co/640x480/3a5c5c/eee?text=Waders+1", IsHero = true, Ordinal = 0 });
        waders.Photos.Add(new ListingPhoto { Url = "https://placehold.co/640x480/3a5c5c/eee?text=Waders+2", Ordinal = 1 });
        waders.Photos.Add(new ListingPhoto { Url = "https://placehold.co/640x480/3a5c5c/eee?text=Waders+3", Ordinal = 2 });
        waders.Specs.Add(new ListingSpec { Key = "Size", Value = "M (men's)", Ordinal = 0 });
        waders.Specs.Add(new ListingSpec { Key = "Material", Value = "GORE-TEX", Ordinal = 1 });
        waders.Specs.Add(new ListingSpec { Key = "Stockingfoot or boot-foot", Value = "Stockingfoot", Ordinal = 2 });

        db.Listings.AddRange(thermal, nv, rtt, awning, fridge, recovery, power, waders);

        // Save the children first so we have IDs for the bundle FKs.
        await db.SaveChangesAsync(ct);

        // ---------- Weekend Overland Kit bundle ----------
        var bundle = new Listing
        {
            Title = "Weekend Overland Kit — RTT + Fridge + Power",
            Vertical = Vertical.Overlanding,
            GearType = GearType.OverlandKit,
            GearTypeLabel = "Bundle",
            Condition = Condition.FieldReady,
            Description = "Everything you need for a 3-night overland weekend: rooftop tent, 12V fridge, and a power station to keep it running. Inherits the strictest cancellation policy of any included listing.",
            PickupZip = "80301",
            DailyRateCents = 16500,
            DepositCents = 80000,
            Status = ListingStatus.Published,
            IsBundle = true,
            Lister = lister,
            PublishedAt = DateTimeOffset.UtcNow.AddDays(-3),
            RatingAverage = 5.0,
            RatingCount = 1
        };
        bundle.Photos.Add(new ListingPhoto { Url = "https://placehold.co/640x480/4a5d3a/eee?text=Weekend+Kit+1", IsHero = true, Ordinal = 0 });
        bundle.Photos.Add(new ListingPhoto { Url = "https://placehold.co/640x480/4a5d3a/eee?text=Weekend+Kit+2", Ordinal = 1 });
        bundle.Photos.Add(new ListingPhoto { Url = "https://placehold.co/640x480/4a5d3a/eee?text=Weekend+Kit+3", Ordinal = 2 });
        bundle.BundleItems.Add(new BundleItem { ChildListingId = rtt.Id });
        bundle.BundleItems.Add(new BundleItem { ChildListingId = fridge.Id });
        bundle.BundleItems.Add(new BundleItem { ChildListingId = power.Id });
        db.Listings.Add(bundle);

        await db.SaveChangesAsync(ct);
    }
}
