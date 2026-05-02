using Kitlo.Api.Common;
using Kitlo.Api.Models;
using Kitlo.Core.Enums;
using Kitlo.Core.Models;
using Kitlo.Data;
using Microsoft.EntityFrameworkCore;

namespace Kitlo.Api.Services;

public class DisputeService
{
    private readonly KitloDbContext _db;
    private readonly NotificationService _notifications;
    public DisputeService(KitloDbContext db, NotificationService notifications)
    {
        _db = db;
        _notifications = notifications;
    }

    public async Task<DisputeDto> FileAsync(Guid filerId, FileDisputeRequest req, CancellationToken ct)
    {
        var booking = await _db.Bookings.FirstOrDefaultAsync(b => b.Id == req.BookingId, ct)
            ?? throw DomainException.NotFound("Booking");
        if (booking.RenterId != filerId && booking.ListerId != filerId)
            throw DomainException.Forbidden();
        if (await _db.Disputes.AnyAsync(d => d.BookingId == booking.Id, ct))
            throw DomainException.Conflict("A dispute already exists for this booking.");

        var dispute = new Dispute
        {
            BookingId = booking.Id,
            FiledById = filerId,
            Status = DisputeStatus.Open,
            Reason = req.Reason,
            ReasonLabel = req.ReasonLabel,
            Summary = req.Summary,
            AmountInDisputeCents = req.AmountInDisputeCents,
            FiledAt = DateTimeOffset.UtcNow
        };
        _db.Disputes.Add(dispute);
        booking.Status = BookingStatus.Disputed;
        booking.Events.Add(new BookingEvent { BookingId = booking.Id, Kind = BookingEventKind.Disputed, Label = "Dispute filed", ActorUserId = filerId });
        await _db.SaveChangesAsync(ct);

        // Notify the counterparty.
        var counterpartyId = filerId == booking.RenterId ? booking.ListerId : booking.RenterId;
        await _notifications.EnqueueAsync(
            counterpartyId, NotificationKind.Dispute,
            "Dispute filed",
            req.ReasonLabel,
            $"/dashboard/bookings/{booking.Id}", ct);

        return await GetAsync(dispute.Id, filerId, isAdmin: false, ct);
    }

    public async Task<DisputeDto> GetAsync(Guid id, Guid actorId, bool isAdmin, CancellationToken ct)
    {
        var d = await _db.Disputes
            .Include(x => x.FiledBy)
            .Include(x => x.Booking)
            .Include(x => x.Evidence)
            .FirstOrDefaultAsync(x => x.Id == id, ct)
            ?? throw DomainException.NotFound("Dispute");

        if (!isAdmin && d.Booking is not null
            && d.Booking.RenterId != actorId
            && d.Booking.ListerId != actorId)
        {
            throw DomainException.Forbidden();
        }
        return ToDto(d);
    }

    public async Task<DisputeEvidenceDto> AddEvidenceAsync(Guid disputeId, Guid actorId, bool isAdmin, AddEvidenceRequest req, CancellationToken ct)
    {
        var dispute = await _db.Disputes.Include(d => d.Booking).FirstOrDefaultAsync(d => d.Id == disputeId, ct)
            ?? throw DomainException.NotFound("Dispute");
        if (!isAdmin && dispute.Booking is not null
            && dispute.Booking.RenterId != actorId
            && dispute.Booking.ListerId != actorId)
        {
            throw DomainException.Forbidden();
        }
        if (dispute.Status is DisputeStatus.Resolved or DisputeStatus.Closed)
            throw new DomainException("Dispute is closed.");

        var evidence = new DisputeEvidence
        {
            DisputeId = disputeId,
            UploadedById = actorId,
            Kind = req.Kind,
            Url = req.Url,
            Text = req.Text
        };
        _db.DisputeEvidence.Add(evidence);
        if (dispute.Status == DisputeStatus.Open) dispute.Status = DisputeStatus.Evidence;
        await _db.SaveChangesAsync(ct);
        return new DisputeEvidenceDto(evidence.Id, evidence.UploadedById, evidence.UploadedAt, evidence.Kind, evidence.Url, evidence.Text);
    }

    public async Task<DisputeDto> ResolveAsync(Guid disputeId, Guid adminId, ResolveDisputeRequest req, CancellationToken ct)
    {
        var dispute = await _db.Disputes.Include(d => d.Booking).FirstOrDefaultAsync(d => d.Id == disputeId, ct)
            ?? throw DomainException.NotFound("Dispute");
        if (dispute.Status is DisputeStatus.Resolved or DisputeStatus.Closed)
            throw new DomainException("Dispute is already closed.");

        dispute.Status = DisputeStatus.Resolved;
        dispute.Resolution = req.Resolution;
        dispute.ResolutionNote = req.Note;
        dispute.ResolvedAt = DateTimeOffset.UtcNow;
        dispute.ResolvedByAdminId = adminId;

        if (dispute.Booking is not null)
        {
            dispute.Booking.Status = req.Resolution switch
            {
                DisputeResolution.RefundRenterFull or DisputeResolution.RefundRenterPartial
                    or DisputeResolution.Split => BookingStatus.Cancelled,
                _ => BookingStatus.Completed
            };
            dispute.Booking.Events.Add(new BookingEvent
            {
                BookingId = dispute.Booking.Id,
                Kind = BookingEventKind.Custom,
                Label = $"Dispute resolved: {req.Resolution}",
                Detail = req.Note,
                ActorUserId = adminId
            });
        }

        _db.AdminActions.Add(new AdminAction
        {
            AdminUserId = adminId,
            Kind = AdminActionKind.RuleDispute,
            TargetDisputeId = disputeId,
            TargetBookingId = dispute.BookingId,
            Note = req.Note
        });

        await _db.SaveChangesAsync(ct);

        // Notify both parties of the ruling.
        if (dispute.Booking is not null)
        {
            await _notifications.EnqueueAsync(
                dispute.Booking.RenterId, NotificationKind.Dispute,
                "Dispute resolved", req.Note ?? req.Resolution.ToString(),
                $"/dashboard/bookings/{dispute.Booking.Id}", ct);
            await _notifications.EnqueueAsync(
                dispute.Booking.ListerId, NotificationKind.Dispute,
                "Dispute resolved", req.Note ?? req.Resolution.ToString(),
                $"/dashboard/bookings/{dispute.Booking.Id}", ct);
        }

        return await GetAsync(disputeId, adminId, isAdmin: true, ct);
    }

    public async Task<PagedResult<DisputeDto>> ListAsync(DisputeStatus? status, int? page, int? pageSize, CancellationToken ct)
    {
        var (p, ps) = PagingDefaults.Normalize(page, pageSize);
        IQueryable<Dispute> q = _db.Disputes.Include(d => d.FiledBy).Include(d => d.Evidence);
        if (status is not null) q = q.Where(d => d.Status == status);
        var total = await q.CountAsync(ct);
        var rows = await q.OrderByDescending(d => d.FiledAt).Skip((p - 1) * ps).Take(ps).ToListAsync(ct);
        return new PagedResult<DisputeDto> { Items = rows.Select(ToDto).ToList(), Total = total, Page = p, PageSize = ps };
    }

    public static DisputeDto ToDto(Dispute d) =>
        new(d.Id, d.BookingId, d.FiledById, d.FiledBy?.Name ?? "", d.FiledAt,
            d.Status, d.Reason, d.ReasonLabel, d.Summary, d.AmountInDisputeCents,
            d.Resolution, d.ResolvedAt, d.ResolutionNote,
            d.Evidence.Select(e => new DisputeEvidenceDto(e.Id, e.UploadedById, e.UploadedAt, e.Kind, e.Url, e.Text)).ToList());
}
