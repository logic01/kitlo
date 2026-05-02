using Kitlo.Api.Common;
using Kitlo.Api.Hubs;
using Kitlo.Api.Models;
using Kitlo.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Kitlo.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/messages")]
public class MessagesController : ControllerBase
{
    private readonly MessageService _messages;
    private readonly RealtimeMessageService _realtime;

    public MessagesController(MessageService messages, RealtimeMessageService realtime)
    {
        _messages = messages;
        _realtime = realtime;
    }

    [HttpGet("threads")]
    public Task<IReadOnlyList<ThreadDto>> Threads(CancellationToken ct) =>
        _messages.ListThreadsAsync(User.RequireUserId(), ct);

    [HttpGet("threads/{threadId:guid}")]
    public Task<IReadOnlyList<MessageDto>> Messages(Guid threadId, CancellationToken ct) =>
        _messages.ListMessagesAsync(threadId, User.RequireUserId(), ct);

    [HttpGet("threads/{threadId:guid}/meta")]
    public Task<ThreadDto> ThreadMeta(Guid threadId, CancellationToken ct) =>
        _messages.GetThreadAsync(threadId, User.RequireUserId(), ct);

    [HttpPost("threads/{threadId:guid}")]
    public Task<MessageDto> Send(Guid threadId, [FromBody] SendMessageRequest req, CancellationToken ct) =>
        _realtime.SendAsync(threadId, User.RequireUserId(), req, ct);

    /// <summary>Open or fetch a thread between the caller and a listing's lister.</summary>
    [HttpPost("threads/listing/{listingId:guid}")]
    public Task<ThreadDto> StartListingThread(Guid listingId, CancellationToken ct) =>
        _messages.StartListingThreadAsync(User.RequireUserId(), listingId, ct);
}
