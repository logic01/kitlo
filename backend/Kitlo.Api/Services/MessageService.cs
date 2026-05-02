using Kitlo.Api.Common;
using Kitlo.Api.Models;
using Kitlo.Core.Models;
using Kitlo.Data;
using Microsoft.EntityFrameworkCore;

namespace Kitlo.Api.Services;

public class MessageService
{
    private readonly KitloDbContext _db;
    public MessageService(KitloDbContext db) => _db = db;

    public async Task<IReadOnlyList<ThreadDto>> ListThreadsAsync(Guid userId, CancellationToken ct)
    {
        var threadIds = await _db.ThreadParticipants
            .Where(p => p.UserId == userId)
            .Select(p => p.ThreadId)
            .ToListAsync(ct);

        var threads = await _db.MessageThreads
            .Include(t => t.Participants).ThenInclude(p => p.User)
            .Include(t => t.Messages)
            .Where(t => threadIds.Contains(t.Id))
            .OrderByDescending(t => t.LastMessageAt)
            .ToListAsync(ct);

        return threads.Select(t => ToDto(t, userId)).ToList();
    }

    public async Task<ThreadDto> StartListingThreadAsync(Guid actorId, Guid listingId, CancellationToken ct)
    {
        var listing = await _db.Listings.FindAsync([listingId], ct)
            ?? throw DomainException.NotFound("Listing");
        if (listing.ListerId == actorId)
            throw new DomainException("Can't start a thread with yourself.");

        // Reuse an existing renter↔lister thread for this listing if there is one
        // and it isn't booking-scoped.
        var participants = new[] { actorId, listing.ListerId };
        var existing = await _db.MessageThreads
            .Include(t => t.Participants).ThenInclude(p => p.User)
            .Include(t => t.Messages)
            .Where(t => t.ListingId == listingId && t.BookingId == null
                && t.Participants.Any(p => p.UserId == actorId)
                && t.Participants.Any(p => p.UserId == listing.ListerId))
            .FirstOrDefaultAsync(ct);
        if (existing is not null) return ToDto(existing, actorId);

        var thread = await StartThreadAsync(participants, bookingId: null, listingId: listingId, ct);
        // Reload with includes for ToDto.
        var hydrated = await _db.MessageThreads
            .Include(t => t.Participants).ThenInclude(p => p.User)
            .Include(t => t.Messages)
            .FirstAsync(t => t.Id == thread.Id, ct);
        return ToDto(hydrated, actorId);
    }

    public async Task<ThreadDto> GetThreadAsync(Guid threadId, Guid actorId, CancellationToken ct)
    {
        await EnsureMemberAsync(threadId, actorId, ct);
        var thread = await _db.MessageThreads
            .Include(t => t.Participants).ThenInclude(p => p.User)
            .Include(t => t.Messages)
            .FirstOrDefaultAsync(t => t.Id == threadId, ct)
            ?? throw DomainException.NotFound("Thread");
        return ToDto(thread, actorId);
    }

    public async Task<IReadOnlyList<MessageDto>> ListMessagesAsync(Guid threadId, Guid actorId, CancellationToken ct)
    {
        await EnsureMemberAsync(threadId, actorId, ct);
        var msgs = await _db.Messages
            .Where(m => m.ThreadId == threadId)
            .OrderBy(m => m.SentAt)
            .ToListAsync(ct);

        // Mark as read
        var participant = await _db.ThreadParticipants.FindAsync([threadId, actorId], ct);
        if (participant is not null)
        {
            participant.LastReadAt = DateTimeOffset.UtcNow;
            await _db.SaveChangesAsync(ct);
        }

        return msgs.Select(ToDto).ToList();
    }

    public async Task<MessageDto> SendAsync(Guid threadId, Guid senderId, SendMessageRequest req, CancellationToken ct)
    {
        await EnsureMemberAsync(threadId, senderId, ct);
        if (string.IsNullOrWhiteSpace(req.Body)) throw new DomainException("Message can't be empty.");

        var thread = await _db.MessageThreads.FindAsync([threadId], ct)
            ?? throw DomainException.NotFound("Thread");

        var msg = new Message
        {
            ThreadId = threadId,
            SenderId = senderId,
            Body = req.Body.Trim()
        };
        thread.LastMessageAt = msg.SentAt;
        thread.LastMessagePreview = msg.Body[..Math.Min(280, msg.Body.Length)];
        _db.Messages.Add(msg);
        await _db.SaveChangesAsync(ct);
        return ToDto(msg);
    }

    public async Task<MessageThread> StartThreadAsync(IEnumerable<Guid> participantIds, Guid? bookingId, Guid? listingId, CancellationToken ct)
    {
        var ids = participantIds.Distinct().ToList();
        if (ids.Count < 2) throw new DomainException("A thread needs at least two participants.");

        // Idempotent for booking-scoped threads — we only ever want one per booking.
        if (bookingId is not null)
        {
            var existing = await _db.MessageThreads
                .Include(t => t.Participants)
                .FirstOrDefaultAsync(t => t.BookingId == bookingId, ct);
            if (existing is not null) return existing;
        }

        var thread = new MessageThread
        {
            BookingId = bookingId,
            ListingId = listingId,
        };
        foreach (var uid in ids)
        {
            thread.Participants.Add(new ThreadParticipant { UserId = uid, Thread = thread });
        }
        _db.MessageThreads.Add(thread);
        await _db.SaveChangesAsync(ct);
        return thread;
    }

    private async Task EnsureMemberAsync(Guid threadId, Guid userId, CancellationToken ct)
    {
        var member = await _db.ThreadParticipants.AnyAsync(p => p.ThreadId == threadId && p.UserId == userId, ct);
        if (!member) throw DomainException.Forbidden("You aren't a member of this thread.");
    }

    public static MessageDto ToDto(Message m) =>
        new(m.Id, m.ThreadId, m.SenderId, m.Body, m.SentAt, m.ReadAt is not null);

    public static ThreadDto ToDto(MessageThread t, Guid viewerId)
    {
        var others = t.Participants.Where(p => p.UserId != viewerId).ToList();
        var name = others.FirstOrDefault()?.User?.Name ?? "Unknown";
        var avatar = others.FirstOrDefault()?.User?.AvatarUrl;
        var viewer = t.Participants.FirstOrDefault(p => p.UserId == viewerId);
        var unread = t.Messages.Count(m => m.SenderId != viewerId && (viewer?.LastReadAt is null || m.SentAt > viewer.LastReadAt));
        return new ThreadDto(
            t.Id,
            t.Participants.Select(p => p.UserId).ToList(),
            name, avatar,
            t.BookingId, t.ListingId,
            t.LastMessagePreview, t.LastMessageAt, unread);
    }
}
