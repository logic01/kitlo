using System.Globalization;
using System.Text;
using System.Text.RegularExpressions;
using Kitlo.Api.Common;
using Kitlo.Api.Models;
using Kitlo.Core.Models;
using Kitlo.Data;
using Microsoft.EntityFrameworkCore;

namespace Kitlo.Api.Services;

public partial class WaitlistService
{
    private readonly KitloDbContext _db;
    private readonly ILogger<WaitlistService> _log;

    public WaitlistService(KitloDbContext db, ILogger<WaitlistService> log)
    {
        _db = db;
        _log = log;
    }

    public async Task<WaitlistJoinResponse> JoinAsync(
        WaitlistJoinRequest req,
        string? ipAddress,
        string? userAgent,
        CancellationToken ct)
    {
        // Silently absorb honeypot hits. Returning a fake-but-stable id keeps bots
        // from learning they were flagged.
        if (!string.IsNullOrWhiteSpace(req.HpCompany))
        {
            _log.LogInformation("Waitlist honeypot triggered from {Ip}", ipAddress);
            return new WaitlistJoinResponse(Guid.Empty, false);
        }

        var name = (req.Name ?? "").Trim();
        var email = (req.Email ?? "").Trim().ToLowerInvariant();
        var zip = (req.Zip ?? "").Trim();
        var firstRental = string.IsNullOrWhiteSpace(req.FirstRental) ? null : req.FirstRental.Trim();

        if (name.Length is 0 or > 120)
            throw new DomainException("Name is required.");
        if (!EmailRegex().IsMatch(email) || email.Length > 254)
            throw new DomainException("A valid email is required.");
        if (!ZipRegex().IsMatch(zip))
            throw new DomainException("A 5-digit US zip code is required.");
        if (firstRental is { Length: > 200 })
            throw new DomainException("Answer is too long.");

        var existing = await _db.WaitlistEntries.FirstOrDefaultAsync(w => w.Email == email, ct);
        if (existing is not null)
        {
            // Idempotent: update mutable fields if the user re-submits with new info.
            existing.Name = name;
            existing.Zip = zip;
            existing.FirstRental = firstRental ?? existing.FirstRental;
            existing.InterestedAsLister = existing.InterestedAsLister || req.InterestedAsLister;
            await _db.SaveChangesAsync(ct);
            return new WaitlistJoinResponse(existing.Id, true);
        }

        var entry = new WaitlistEntry
        {
            Email = email,
            Name = name,
            Zip = zip,
            FirstRental = firstRental,
            InterestedAsLister = req.InterestedAsLister,
            Source = string.IsNullOrWhiteSpace(req.Source) ? null : req.Source.Trim(),
            IpAddress = ipAddress,
            UserAgent = userAgent is { Length: > 500 } ? userAgent[..500] : userAgent,
        };
        _db.WaitlistEntries.Add(entry);
        await _db.SaveChangesAsync(ct);
        _log.LogInformation("Waitlist signup {Id} ({Zip}, lister={Lister})", entry.Id, zip, entry.InterestedAsLister);
        return new WaitlistJoinResponse(entry.Id, false);
    }

    public async Task<PagedResult<WaitlistEntryDto>> ListAsync(
        string? q, string? zip, bool? listersOnly, int? page, int? pageSize, CancellationToken ct)
    {
        var (p, ps) = PagingDefaults.Normalize(page, pageSize);
        IQueryable<WaitlistEntry> query = _db.WaitlistEntries;

        if (!string.IsNullOrWhiteSpace(q))
        {
            var term = q.Trim().ToLowerInvariant();
            query = query.Where(w => w.Email.Contains(term) || w.Name.ToLower().Contains(term));
        }
        if (!string.IsNullOrWhiteSpace(zip))
        {
            var z = zip.Trim();
            query = query.Where(w => w.Zip == z);
        }
        if (listersOnly == true)
            query = query.Where(w => w.InterestedAsLister);

        var total = await query.CountAsync(ct);
        var rows = await query
            .OrderByDescending(w => w.CreatedAt)
            .Skip((p - 1) * ps).Take(ps)
            .ToListAsync(ct);

        return new PagedResult<WaitlistEntryDto>
        {
            Items = rows.Select(ToDto).ToList(),
            Total = total,
            Page = p,
            PageSize = ps,
        };
    }

    public async Task<(string fileName, byte[] content)> ExportCsvAsync(CancellationToken ct)
    {
        var rows = await _db.WaitlistEntries
            .OrderByDescending(w => w.CreatedAt)
            .ToListAsync(ct);

        var sb = new StringBuilder();
        sb.AppendLine("created_at,email,name,zip,interested_as_lister,first_rental,source");
        foreach (var w in rows)
        {
            sb.Append(w.CreatedAt.ToString("o", CultureInfo.InvariantCulture)).Append(',');
            sb.Append(Csv(w.Email)).Append(',');
            sb.Append(Csv(w.Name)).Append(',');
            sb.Append(Csv(w.Zip)).Append(',');
            sb.Append(w.InterestedAsLister ? "true" : "false").Append(',');
            sb.Append(Csv(w.FirstRental)).Append(',');
            sb.AppendLine(Csv(w.Source));
        }

        var name = $"waitlist-{DateTimeOffset.UtcNow:yyyyMMdd-HHmmss}.csv";
        return (name, Encoding.UTF8.GetBytes(sb.ToString()));
    }

    private static string Csv(string? s)
    {
        if (string.IsNullOrEmpty(s)) return "";
        var needsQuote = s.IndexOfAny(['"', ',', '\n', '\r']) >= 0;
        var v = s.Replace("\"", "\"\"");
        return needsQuote ? $"\"{v}\"" : v;
    }

    private static WaitlistEntryDto ToDto(WaitlistEntry w) =>
        new(w.Id, w.Email, w.Name, w.Zip, w.FirstRental, w.InterestedAsLister, w.Source, w.CreatedAt, w.ConvertedUserId);

    [GeneratedRegex(@"^[^@\s]+@[^@\s]+\.[^@\s]+$")]
    private static partial Regex EmailRegex();

    [GeneratedRegex(@"^\d{5}$")]
    private static partial Regex ZipRegex();
}
