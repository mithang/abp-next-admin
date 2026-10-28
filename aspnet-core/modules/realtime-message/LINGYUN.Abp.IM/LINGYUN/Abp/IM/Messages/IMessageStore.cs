using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace LINGYUN.Abp.IM.Messages;

public interface IMessageStore
{
    /// <summary>
    /// Lưu trữ lịch sử trò chuyện
    /// </summary>
    /// <param name="chatMessage"></param>
    /// <param name="formUserId"></param>
    /// <param name="toUserId"></param>
    /// <returns></returns>
    Task StoreMessageAsync(
        ChatMessage chatMessage,
        CancellationToken cancellationToken = default);
    /// <summary>
    /// Lấy tổng số lịch sử trò chuyện nhóm
    /// </summary>
    /// <param name="tenantId"></param>
    /// <param name="groupId"></param>
    /// <param name="filter"></param>
    /// <param name="type"></param>
    /// <returns></returns>
    Task<long> GetGroupMessageCountAsync(
        Guid? tenantId,
        long groupId,
        MessageType? type = null,
        string? filter = null,
        CancellationToken cancellationToken = default);
    /// <summary>
    /// Lấy lịch sử trò chuyện nhóm
    /// </summary>
    /// <param name="tenantId"></param>
    /// <param name="groupId"></param>
    /// <param name="filter"></param>
    /// <param name="sorting"></param>
    /// <param name="type"></param>
    /// <param name="skipCount"></param>
    /// <param name="maxResultCount"></param>
    /// <returns></returns>
    Task<List<ChatMessage>> GetGroupMessageAsync(
        Guid? tenantId,
        long groupId,
        MessageType? type = null,
        string? filter = null,
        string? sorting = nameof(ChatMessage.MessageId),
        int skipCount = 0,
        int maxResultCount = 10,
        CancellationToken cancellationToken = default);
    /// <summary>
    /// Lấy bản ghi tin nhắn liên lạc gần nhất
    /// </summary>
    /// <param name="tenantId"></param>
    /// <param name="userId"></param>
    /// <param name="state"></param>
    /// <param name="sorting"></param>
    /// <param name="maxResultCount"></param>
    /// <returns></returns>
    Task<List<LastChatMessage>> GetLastChatMessagesAsync(
        Guid? tenantId,
        Guid userId,
        MessageState? state = null,
        string? sorting = nameof(LastChatMessage.SendTime),
        int maxResultCount = 10,
        CancellationToken cancellationToken = default
        );
    /// <summary>
    /// Lấy tổng số lịch sử trò chuyện với một người dùng
    /// </summary>
    /// <param name="tenantId"></param>
    /// <param name="sendUserId"></param>
    /// <param name="receiveUserId"></param>
    /// <param name="filter"></param>
    /// <param name="type"></param>
    /// <returns></returns>
    Task<long> GetChatMessageCountAsync(
        Guid? tenantId,
        Guid sendUserId,
        Guid receiveUserId,
        MessageType? type = null,
        string? filter = "",
        CancellationToken cancellationToken = default);
    /// <summary>
    /// Lấy lịch sử trò chuyện của người dùng
    /// </summary>
    /// <param name="tenantId"></param>
    /// <param name="sendUserId"></param>
    /// <param name="receiveUserId"></param>
    /// <param name="type"></param>
    /// <param name="filter"></param>
    /// <param name="sorting"></param>
    /// <param name="skipCount"></param>
    /// <param name="maxResultCount"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<List<ChatMessage>> GetChatMessageAsync(
        Guid? tenantId,
        Guid sendUserId,
        Guid receiveUserId,
        MessageType? type = null,
        string? filter = null,
        string? sorting = nameof(ChatMessage.MessageId),
        int skipCount = 0,
        int maxResultCount = 10,
        CancellationToken cancellationToken = default);
}
