using System.ComponentModel.DataAnnotations;

namespace Kitlo.Core.Models;

public class MessageThread
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid? ListingId { get; set; }
    public Listing? Listing { get; set; }

    public Guid? BookingId { get; set; }
    public Booking? Booking { get; set; }

    [MaxLength(280)]
    public string LastMessagePreview { get; set; } = string.Empty;

    public DateTimeOffset LastMessageAt { get; set; } = DateTimeOffset.UtcNow;
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;

    public ICollection<ThreadParticipant> Participants { get; set; } = [];
    public ICollection<Message> Messages { get; set; } = [];
}

/// <summary>Composite-key join table linking users to threads.</summary>
public class ThreadParticipant
{
    public Guid ThreadId { get; set; }
    public MessageThread? Thread { get; set; }

    public Guid UserId { get; set; }
    public User? User { get; set; }

    public DateTimeOffset? LastReadAt { get; set; }
    public bool Muted { get; set; }
}

public class Message
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid ThreadId { get; set; }
    public MessageThread? Thread { get; set; }

    public Guid SenderId { get; set; }
    public User? Sender { get; set; }

    [Required, MaxLength(4000)]
    public string Body { get; set; } = string.Empty;

    public DateTimeOffset SentAt { get; set; } = DateTimeOffset.UtcNow;
    public DateTimeOffset? ReadAt { get; set; }
}
