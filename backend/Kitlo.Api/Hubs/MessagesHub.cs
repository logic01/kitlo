using Kitlo.Api.Common;
using Kitlo.Api.Models;
using Kitlo.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace Kitlo.Api.Hubs;

/// <summary>
/// Real-time delivery for thread messages. Clients call <c>JoinThread</c> when they
/// open a conversation; messages persisted via <see cref="MessagesController"/>
/// are broadcast to the per-thread group from <see cref="OnMessagePersisted"/>.
/// </summary>
[Authorize]
public class MessagesHub : Hub
{
    public Task JoinThread(string threadId) =>
        Groups.AddToGroupAsync(Context.ConnectionId, ThreadGroup(threadId));

    public Task LeaveThread(string threadId) =>
        Groups.RemoveFromGroupAsync(Context.ConnectionId, ThreadGroup(threadId));

    public static string ThreadGroup(string threadId) => $"thread:{threadId}";
}

/// <summary>
/// Wraps <see cref="MessageService"/> and pushes a SignalR broadcast on every send.
/// Controllers depend on this instead of <see cref="MessageService"/> directly so the
/// HTTP path and the realtime path stay in sync.
/// </summary>
public class RealtimeMessageService
{
    private readonly MessageService _messages;
    private readonly IHubContext<MessagesHub> _hub;

    public RealtimeMessageService(MessageService messages, IHubContext<MessagesHub> hub)
    {
        _messages = messages;
        _hub = hub;
    }

    public async Task<MessageDto> SendAsync(Guid threadId, Guid senderId, SendMessageRequest req, CancellationToken ct)
    {
        var dto = await _messages.SendAsync(threadId, senderId, req, ct);
        await _hub.Clients.Group(MessagesHub.ThreadGroup(threadId.ToString()))
            .SendAsync("messageReceived", dto, ct);
        return dto;
    }
}
