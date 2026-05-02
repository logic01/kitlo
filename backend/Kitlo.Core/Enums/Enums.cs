namespace Kitlo.Core.Enums;

public enum UserRole
{
    Renter = 0,
    Lister = 1,
    Admin = 2
}

public enum UserStatus
{
    Active = 0,
    Restricted = 1,
    Suspended = 2,
    Banned = 3
}

public enum GearType
{
    // Weapons (firearms, hunting bows, crossbows) are prohibited on Kitlo —
    // see docs/features/18-admin-listing-review.md for the policy.
    Thermal = 0,
    NightVision = 1,
    TreeStand = 2,
    Optics = 3,
    Pack = 4,
    Other = 5
}

public enum Condition
{
    Mint = 0,
    FieldReady = 1,
    BattleScarred = 2
}

public enum ListingStatus
{
    Draft = 0,
    PendingReview = 1,
    Published = 2,
    Paused = 3,
    Rejected = 4,
    Archived = 5
}

public enum CancellationPolicy
{
    Flexible = 0,
    Moderate = 1,
    Strict = 2
}

public enum AvailabilityReason
{
    Booked = 0,
    OwnerBlocked = 1,
    Maintenance = 2
}

public enum BookingStatus
{
    Pending = 0,
    Confirmed = 1,
    Active = 2,
    Returned = 3,
    Completed = 4,
    Cancelled = 5,
    Disputed = 6
}

public enum BookingEventKind
{
    Created = 0,
    Confirmed = 1,
    PickupConfirmed = 2,
    ReturnConfirmed = 3,
    Cancelled = 4,
    Disputed = 5,
    PayoutReleased = 6,
    Custom = 99
}

public enum PaymentStatus
{
    Pending = 0,
    Authorized = 1,
    Captured = 2,
    Refunded = 3,
    PartiallyRefunded = 4,
    Failed = 5
}

public enum PaymentKind
{
    Rental = 0,
    Deposit = 1,
    Extension = 2,
    DamageCharge = 3
}

public enum PayoutStatus
{
    Scheduled = 0,
    InTransit = 1,
    Paid = 2,
    Failed = 3
}

public enum DisputeStatus
{
    Open = 0,
    Evidence = 1,
    Mediation = 2,
    Resolved = 3,
    Closed = 4
}

public enum DisputeReason
{
    Damage = 0,
    LateReturn = 1,
    NoShow = 2,
    Misrepresented = 3,
    Other = 99
}

public enum DisputeResolution
{
    RefundRenterFull = 0,
    RefundRenterPartial = 1,
    ReleaseListerFull = 2,
    ReleaseListerPartial = 3,
    Split = 4
}

public enum DisputeEvidenceKind
{
    Photo = 0,
    Message = 1,
    Note = 2
}

public enum ReviewKind
{
    RenterOfLister = 0,
    ListerOfRenter = 1
}

public enum ReviewAccuracy
{
    Accurate = 0,
    Somewhat = 1,
    Inaccurate = 2
}

public enum NotificationKind
{
    BookingRequest = 0,
    BookingConfirmed = 1,
    BookingReminder = 2,
    Message = 3,
    ReviewReceived = 4,
    PayoutReleased = 5,
    Dispute = 6,
    AdminAction = 7,
    System = 99
}

public enum AdminActionKind
{
    Warn = 0,
    Restrict = 1,
    Suspend = 2,
    Ban = 3,
    Reinstate = 4,
    ApproveListing = 10,
    RejectListing = 11,
    RuleDispute = 20
}

public enum ReportTargetType
{
    User = 0,
    Listing = 1,
    Message = 2,
    Review = 3
}
