using Kitlo.Core.Enums;
using Kitlo.Core.Models;
using Microsoft.EntityFrameworkCore;

namespace Kitlo.Data.Seed;

/// <summary>
/// Idempotent dev seed. Call from <c>Program.cs</c> when <c>app.Environment.IsDevelopment()</c>
/// is true. Production seeding (categories, etc.) lives in dedicated migrations.
/// </summary>
public static class SeedData
{
    public static async Task ApplyAsync(KitloDbContext db, CancellationToken ct = default)
    {
        if (await db.Users.AnyAsync(ct)) return; // already seeded

        // Note: PasswordHash here is a placeholder ("password" → bcrypt). Real signup goes through PasswordHasher.
        const string demoHash = "$2a$11$0j4ER1A3yhI5W2aR9j5TROzXhB.wDiXa4MfNfx7qeuVVw1UO3uD0G";

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

        var thermal = new Listing
        {
            Title = "Pulsar Thermion 2 XQ50 Pro",
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

        db.Listings.AddRange(thermal, nv);

        await db.SaveChangesAsync(ct);
    }
}
