using Kitlo.Core.Models;
using Microsoft.EntityFrameworkCore;

namespace Kitlo.Data;

public class KitloDbContext : DbContext
{
    public KitloDbContext(DbContextOptions<KitloDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Listing> Listings => Set<Listing>();
    public DbSet<ListingPhoto> ListingPhotos => Set<ListingPhoto>();
    public DbSet<ListingSpec> ListingSpecs => Set<ListingSpec>();
    public DbSet<BundleItem> BundleItems => Set<BundleItem>();
    public DbSet<AvailabilityBlock> AvailabilityBlocks => Set<AvailabilityBlock>();
    public DbSet<Booking> Bookings => Set<Booking>();
    public DbSet<BookingEvent> BookingEvents => Set<BookingEvent>();
    public DbSet<Payment> Payments => Set<Payment>();
    public DbSet<Payout> Payouts => Set<Payout>();
    public DbSet<MessageThread> MessageThreads => Set<MessageThread>();
    public DbSet<ThreadParticipant> ThreadParticipants => Set<ThreadParticipant>();
    public DbSet<Message> Messages => Set<Message>();
    public DbSet<Review> Reviews => Set<Review>();
    public DbSet<Dispute> Disputes => Set<Dispute>();
    public DbSet<DisputeEvidence> DisputeEvidence => Set<DisputeEvidence>();
    public DbSet<Notification> Notifications => Set<Notification>();
    public DbSet<NotificationPreferences> NotificationPreferences => Set<NotificationPreferences>();
    public DbSet<AdminAction> AdminActions => Set<AdminAction>();
    public DbSet<Report> Reports => Set<Report>();

    protected override void OnModelCreating(ModelBuilder b)
    {
        // ----- User -----
        b.Entity<User>(e =>
        {
            e.HasIndex(u => u.Email).IsUnique();
            e.HasOne(u => u.NotificationPreferences)
                .WithOne(p => p.User!)
                .HasForeignKey<NotificationPreferences>(p => p.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // ----- Listing -----
        b.Entity<Listing>(e =>
        {
            e.HasIndex(l => l.ListerId);
            e.HasIndex(l => new { l.GearType, l.Status });
            e.HasIndex(l => l.PickupZip);
            e.HasOne(l => l.Lister)
                .WithMany(u => u.Listings)
                .HasForeignKey(l => l.ListerId)
                .OnDelete(DeleteBehavior.Restrict);
            e.HasMany(l => l.Photos)
                .WithOne(p => p.Listing!)
                .HasForeignKey(p => p.ListingId)
                .OnDelete(DeleteBehavior.Cascade);
            e.HasMany(l => l.Specs)
                .WithOne(s => s.Listing!)
                .HasForeignKey(s => s.ListingId)
                .OnDelete(DeleteBehavior.Cascade);
            e.HasMany(l => l.AvailabilityBlocks)
                .WithOne(a => a.Listing!)
                .HasForeignKey(a => a.ListingId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // ----- BundleItem (composite key) -----
        b.Entity<BundleItem>(e =>
        {
            e.HasKey(x => new { x.BundleListingId, x.ChildListingId });
            e.HasOne(x => x.BundleListing)
                .WithMany(l => l.BundleItems)
                .HasForeignKey(x => x.BundleListingId)
                .OnDelete(DeleteBehavior.Cascade);
            e.HasOne(x => x.ChildListing)
                .WithMany()
                .HasForeignKey(x => x.ChildListingId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // ----- AvailabilityBlock -----
        b.Entity<AvailabilityBlock>(e =>
        {
            e.HasIndex(a => new { a.ListingId, a.StartDate, a.EndDate });
            e.HasOne(a => a.Booking)
                .WithMany()
                .HasForeignKey(a => a.BookingId)
                .OnDelete(DeleteBehavior.SetNull);
        });

        // ----- Booking -----
        b.Entity<Booking>(e =>
        {
            e.HasIndex(x => x.RenterId);
            e.HasIndex(x => x.ListerId);
            e.HasIndex(x => x.ListingId);
            e.HasIndex(x => x.Status);
            e.HasOne(x => x.Listing)
                .WithMany()
                .HasForeignKey(x => x.ListingId)
                .OnDelete(DeleteBehavior.Restrict);
            e.HasOne(x => x.Renter)
                .WithMany(u => u.BookingsAsRenter)
                .HasForeignKey(x => x.RenterId)
                .OnDelete(DeleteBehavior.Restrict);
            e.HasOne(x => x.Lister)
                .WithMany(u => u.BookingsAsLister)
                .HasForeignKey(x => x.ListerId)
                .OnDelete(DeleteBehavior.Restrict);
            e.HasMany(x => x.Events)
                .WithOne(ev => ev.Booking!)
                .HasForeignKey(ev => ev.BookingId)
                .OnDelete(DeleteBehavior.Cascade);
            e.HasMany(x => x.Payments)
                .WithOne(p => p.Booking!)
                .HasForeignKey(p => p.BookingId)
                .OnDelete(DeleteBehavior.Cascade);
            e.HasOne(x => x.Payout)
                .WithOne(p => p.Booking!)
                .HasForeignKey<Payout>(p => p.BookingId)
                .OnDelete(DeleteBehavior.Cascade);
            e.HasOne(x => x.Dispute)
                .WithOne(d => d.Booking!)
                .HasForeignKey<Dispute>(d => d.BookingId)
                .OnDelete(DeleteBehavior.Cascade);
            e.HasMany(x => x.Reviews)
                .WithOne(r => r.Booking!)
                .HasForeignKey(r => r.BookingId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // ----- Payment -----
        b.Entity<Payment>(e =>
        {
            e.HasIndex(p => p.StripePaymentIntentId);
            e.HasIndex(p => new { p.BookingId, p.Kind });
        });

        // ----- Payout -----
        b.Entity<Payout>(e =>
        {
            e.HasIndex(p => p.ListerId);
            e.HasIndex(p => p.Status);
            e.HasIndex(p => p.StripeTransferId);
            e.HasOne(p => p.Lister)
                .WithMany()
                .HasForeignKey(p => p.ListerId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // ----- MessageThread -----
        b.Entity<MessageThread>(e =>
        {
            e.HasMany(t => t.Participants)
                .WithOne(p => p.Thread!)
                .HasForeignKey(p => p.ThreadId)
                .OnDelete(DeleteBehavior.Cascade);
            e.HasMany(t => t.Messages)
                .WithOne(m => m.Thread!)
                .HasForeignKey(m => m.ThreadId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        b.Entity<ThreadParticipant>(e =>
        {
            e.HasKey(x => new { x.ThreadId, x.UserId });
            e.HasOne(x => x.User)
                .WithMany()
                .HasForeignKey(x => x.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        b.Entity<Message>(e =>
        {
            e.HasIndex(m => new { m.ThreadId, m.SentAt });
            e.HasOne(m => m.Sender)
                .WithMany()
                .HasForeignKey(m => m.SenderId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // ----- Review -----
        b.Entity<Review>(e =>
        {
            e.HasIndex(r => new { r.BookingId, r.Kind }).IsUnique();
            e.HasIndex(r => r.RevieweeId);
            e.HasOne(r => r.Reviewer)
                .WithMany()
                .HasForeignKey(r => r.ReviewerId)
                .OnDelete(DeleteBehavior.Restrict);
            e.HasOne(r => r.Reviewee)
                .WithMany()
                .HasForeignKey(r => r.RevieweeId)
                .OnDelete(DeleteBehavior.Restrict);
            e.HasOne(r => r.Listing)
                .WithMany()
                .HasForeignKey(r => r.ListingId)
                .OnDelete(DeleteBehavior.SetNull);
        });

        // ----- Dispute -----
        b.Entity<Dispute>(e =>
        {
            e.HasIndex(d => d.Status);
            e.HasOne(d => d.FiledBy)
                .WithMany()
                .HasForeignKey(d => d.FiledById)
                .OnDelete(DeleteBehavior.Restrict);
            e.HasOne(d => d.ResolvedByAdmin)
                .WithMany()
                .HasForeignKey(d => d.ResolvedByAdminId)
                .OnDelete(DeleteBehavior.SetNull);
            e.HasMany(d => d.Evidence)
                .WithOne(ev => ev.Dispute!)
                .HasForeignKey(ev => ev.DisputeId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        b.Entity<DisputeEvidence>(e =>
        {
            e.HasOne(x => x.UploadedBy)
                .WithMany()
                .HasForeignKey(x => x.UploadedById)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // ----- Notification -----
        b.Entity<Notification>(e =>
        {
            e.HasIndex(n => new { n.UserId, n.ReadAt, n.CreatedAt });
            e.HasOne(n => n.User)
                .WithMany()
                .HasForeignKey(n => n.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        b.Entity<NotificationPreferences>(e =>
        {
            e.HasKey(p => p.UserId);
        });

        // ----- AdminAction -----
        b.Entity<AdminAction>(e =>
        {
            e.HasIndex(a => a.AdminUserId);
            e.HasIndex(a => a.CreatedAt);
            e.HasOne(a => a.AdminUser)
                .WithMany()
                .HasForeignKey(a => a.AdminUserId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // ----- Report -----
        b.Entity<Report>(e =>
        {
            e.HasIndex(r => new { r.TargetType, r.TargetId });
            e.HasOne(r => r.Reporter)
                .WithMany()
                .HasForeignKey(r => r.ReporterId)
                .OnDelete(DeleteBehavior.Restrict);
            e.HasOne(r => r.ResolvedByAdmin)
                .WithMany()
                .HasForeignKey(r => r.ResolvedByAdminId)
                .OnDelete(DeleteBehavior.SetNull);
        });
    }
}
