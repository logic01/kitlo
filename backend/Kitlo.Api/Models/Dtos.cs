using Kitlo.Core.Enums;

namespace Kitlo.Api.Models;

// =================== Auth ===================
public record LoginRequest(string Email, string Password);
public record SignupRequest(
    string Email,
    string Password,
    string Name,
    string? Intent,
    string? City = null,
    string? State = null);
public record AuthResponse(string AccessToken, string RefreshToken, UserDto User);
public record RefreshRequest(string RefreshToken);

// =================== Users ===================
public record UserDto(
    Guid Id,
    string Email,
    string Name,
    string Role,
    bool Verified,
    string? City,
    string? State,
    string? AvatarUrl,
    DateTimeOffset JoinedAt,
    string Status = "active");

public record UpdateUserRequest(string? Name, string? City, string? State, string? AvatarUrl, string? Bio);

public record PublicProfileDto(
    Guid Id,
    string Name,
    string? AvatarUrl,
    bool Verified,
    string? City,
    string? State,
    DateTimeOffset JoinedAt,
    double RatingAverage,
    int RatingCount);

// =================== Listings ===================
public record ListingPhotoDto(Guid Id, string Url, string? Alt, bool IsHero);
public record ListingSpecDto(string Key, string Value);

public record ListingSummaryDto(
    Guid Id,
    string Title,
    Vertical Vertical,
    GearType GearType,
    string GearTypeLabel,
    Condition Condition,
    int DailyRateCents,
    string PickupZip,
    string HeroPhotoUrl,
    Guid ListerId,
    string ListerName,
    bool ListerVerified,
    bool IsBundle,
    double RatingAverage,
    int RatingCount,
    ListingStatus Status = ListingStatus.Published);

public record ListingDto(
    Guid Id,
    string Title,
    Vertical Vertical,
    GearType GearType,
    string GearTypeLabel,
    Condition Condition,
    int DailyRateCents,
    int? DepositCents,
    int ServiceFeeBp,
    CancellationPolicy CancellationPolicy,
    string PickupZip,
    string Description,
    ListingStatus Status,
    bool IsBundle,
    Guid ListerId,
    string ListerName,
    bool ListerVerified,
    double RatingAverage,
    int RatingCount,
    IReadOnlyList<ListingPhotoDto> Photos,
    IReadOnlyList<ListingSpecDto> Specs,
    IReadOnlyList<Guid>? BundleListingIds);

public record CreateListingRequest(
    string Title,
    Vertical Vertical,
    GearType GearType,
    string GearTypeLabel,
    Condition Condition,
    string PickupZip,
    string? Description,
    int? DailyRateCents,
    int? DepositCents,
    CancellationPolicy? CancellationPolicy,
    bool IsBundle);

public record UpdateListingRequest(
    string? Title,
    string? Description,
    int? DailyRateCents,
    int? DepositCents,
    CancellationPolicy? CancellationPolicy,
    Condition? Condition,
    string? PickupZip,
    Vertical? Vertical = null,
    GearType? GearType = null,
    string? GearTypeLabel = null,
    bool? IsBundle = null,
    IReadOnlyList<Guid>? BundleListingIds = null);

public record ListingPhotoUploadRequest(string Url, string? Alt, bool IsHero);

// =================== Bookings ===================
public record BookingSummaryDto(
    Guid Id,
    BookingStatus Status,
    DateOnly StartDate,
    DateOnly EndDate,
    string GearTitle,
    string GearPhotoUrl,
    string CounterpartyName,
    string? CounterpartyAvatarUrl,
    int TotalCents);

public record BookingTimelineEventDto(
    Guid Id,
    string Label,
    string? Detail,
    DateTimeOffset OccurredAt,
    string State);

public record CreateBookingRequest(
    Guid ListingId,
    DateOnly StartDate,
    DateOnly EndDate);

public record UpdateBookingStatusRequest(string Action, string? Reason);

// =================== Messages ===================
public record MessageDto(Guid Id, Guid ThreadId, Guid SenderId, string Body, DateTimeOffset SentAt, bool Read);
public record ThreadDto(
    Guid Id,
    IReadOnlyList<Guid> ParticipantIds,
    string ParticipantName,
    string? ParticipantAvatarUrl,
    Guid? BookingId,
    Guid? ListingId,
    string LastMessagePreview,
    DateTimeOffset LastMessageAt,
    int UnreadCount);
public record SendMessageRequest(string Body);

// =================== Reviews ===================
public record ReviewDto(
    Guid Id,
    Guid BookingId,
    string ReviewerName,
    string? ReviewerAvatarUrl,
    DateTimeOffset SubmittedAt,
    int Rating,
    ReviewAccuracy? Accuracy,
    string Text,
    IReadOnlyList<string>? Tags);

public record SubmitReviewRequest(int Rating, ReviewAccuracy? Accuracy, string Text, IReadOnlyList<string>? Tags);

// =================== Disputes ===================
public record DisputeEvidenceDto(
    Guid Id,
    Guid UploadedById,
    DateTimeOffset UploadedAt,
    DisputeEvidenceKind Kind,
    string? Url,
    string? Text);

public record DisputeDto(
    Guid Id,
    Guid BookingId,
    Guid FiledById,
    string FiledByName,
    DateTimeOffset FiledAt,
    DisputeStatus Status,
    DisputeReason Reason,
    string ReasonLabel,
    string Summary,
    int AmountInDisputeCents,
    DisputeResolution? Resolution,
    DateTimeOffset? ResolvedAt,
    string? ResolutionNote,
    IReadOnlyList<DisputeEvidenceDto> Evidence);

public record FileDisputeRequest(
    Guid BookingId,
    DisputeReason Reason,
    string ReasonLabel,
    string Summary,
    int AmountInDisputeCents);

public record AddEvidenceRequest(DisputeEvidenceKind Kind, string? Url, string? Text);
public record ResolveDisputeRequest(DisputeResolution Resolution, string? Note);

// =================== Notifications ===================
public record NotificationDto(
    Guid Id,
    NotificationKind Kind,
    string Title,
    string Body,
    DateTimeOffset CreatedAt,
    bool Read,
    string? Link);

public record NotificationPreferencesDto(bool EmailEnabled, bool PushEnabled, bool SmsEnabled, long OptedOutMask);

// =================== Payouts ===================
public record PayoutDto(
    Guid Id,
    Guid BookingId,
    string ListingTitle,
    int RentalDays,
    int GrossCents,
    int PlatformFeeCents,
    int NetCents,
    PayoutStatus Status,
    DateTimeOffset ScheduledFor,
    DateTimeOffset? PaidAt,
    string? BankLast4);

public record EarningsSummaryDto(
    long LifetimeCents,
    long PendingCents,
    long ThisMonthCents,
    int BookingsCount,
    int AverageDailyRateCents);

// =================== Admin ===================
public record AdminQueueItemDto(Guid Id, string Name, IReadOnlyList<string> Meta, string Reason, string ReasonLabel, int SlaHoursRemaining);
public record AdminStatsDto(int ListingsPending, int DisputesOpen, int VerificationsPending);
public record UserAdminActionRequest(string Action, string? Note);

// =================== Payments ===================
public record CreatePaymentIntentRequest(Guid BookingId);
public record PaymentIntentResponse(string ClientSecret, string PaymentIntentId);
public record StripeWebhookRequest(); // body is read raw

// =================== Waitlist ===================
public record WaitlistJoinRequest(
    string Name,
    string Email,
    string Zip,
    string? FirstRental,
    bool InterestedAsLister,
    string? Source,
    // Honeypot — bots fill all fields, real browsers leave hidden inputs blank.
    // Non-empty value silently drops the submission.
    string? HpCompany);

public record WaitlistJoinResponse(Guid Id, bool AlreadyOnList);

public record WaitlistEntryDto(
    Guid Id,
    string Email,
    string Name,
    string Zip,
    string? FirstRental,
    bool InterestedAsLister,
    string? Source,
    DateTimeOffset CreatedAt,
    Guid? ConvertedUserId);
