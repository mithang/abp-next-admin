using LINGYUN.Abp.IM.Messages;
using LINGYUN.Abp.MessageService.Chat;
using System;

namespace LINGYUN.Abp.MessageService.Groups;

public class GroupMessage : Message
{
    /// <summary>
    /// Định danh nhóm
    /// </summary>
    public virtual long GroupId { get; protected set; }

    protected GroupMessage() { }
    public GroupMessage(
        long id,
        Guid sendUserId,
        string sendUserName,
        long groupId,
        string content,
        MessageType type = MessageType.Text,
        MessageSourceType source = MessageSourceType.User,
        Guid? tenantId = null)
        : base(id, sendUserId, sendUserName, content, type, source, tenantId)
    {
        GroupId = groupId;
    }
}
