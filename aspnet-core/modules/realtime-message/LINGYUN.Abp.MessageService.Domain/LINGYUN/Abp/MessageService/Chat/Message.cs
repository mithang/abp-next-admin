using LINGYUN.Abp.IM.Messages;
using System;
using Volo.Abp.Data;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace LINGYUN.Abp.MessageService.Chat;

public abstract class Message : CreationAuditedAggregateRoot<long>, IMultiTenant
{
    /// <summary>
    /// Bên thuê
    /// </summary>
    public virtual Guid? TenantId { get; protected set; }
    /// <summary>
    /// Mã định danh tin nhắn
    /// </summary>
    public virtual long MessageId { get; protected set; }
    /// <summary>
    /// Tên người dùng gửi
    /// </summary>
    public virtual string SendUserName { get; protected set; } = default!;
    /// <summary>
    /// Nội dung
    /// </summary>
    public virtual string Content { get; protected set; } = default!;
    /// <summary>
    /// Loại tin nhắn
    /// </summary>
    public virtual MessageType Type { get; protected set; }
    /// <summary>
    /// Nguồn tin nhắn
    /// </summary>
    public virtual MessageSourceType Source { get; protected set; }
    /// <summary>
    /// Trạng thái gửi
    /// </summary>
    public virtual MessageState State { get; protected set; }
    protected Message() { }
    protected Message(
        long id,
        Guid sendUserId,
        string sendUserName,
        string content,
        MessageType type = MessageType.Text,
        MessageSourceType source = MessageSourceType.User,
        Guid? tenantId = null)
    {
        MessageId = id;
        CreatorId = sendUserId;
        SendUserName = sendUserName;
        Content = content;
        Type = type;
        Source = source;
        CreationTime = DateTime.Now;
        TenantId = tenantId;
        ChangeSendState();
    }

    public void ChangeSendState(MessageState state = MessageState.Send)
    {
        State = state;
    }
}
