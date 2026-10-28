using LINGYUN.Abp.RealTime.Localization;
using System;
using Volo.Abp.Auditing;
using Volo.Abp.Data;
using Volo.Abp.EventBus;
using Volo.Abp.Timing;

namespace LINGYUN.Abp.IM.Messages;

[Serializable]
[EventName("im.message")]
public class ChatMessage : IHasExtraProperties
{
    /// <summary>
    /// Tenant
    /// </summary>
    public Guid? TenantId { get; set; }
    /// <summary>
    /// Định danh nhóm
    /// </summary>
    public string GroupId { get; set; } = default!;
    /// <summary>
    /// Định danh tin nhắn
    /// </summary>
    /// <remarks>
    /// Người gọi không cần quan tâm đến trường này, dịch vụ sẽ tự động tạo
    /// </remarks>
    public string MessageId { get; set; } = default!;
    /// <summary>
    /// Định danh người gửi
    /// </summary>
    public Guid FormUserId { get; set; }
    /// <summary>
    /// Tên người gửi
    /// </summary>
    public string FormUserName { get; set; } = default!;
    /// <summary>
    /// Định danh người dùng nhận
    /// </summary>
    /// <remarks>
    /// Được thiết kế có thể null để tương thích với tin nhắn nhóm
    /// /remarks>
    public Guid? ToUserId { get; set; }
    /// <summary>
    /// Nội dung tin nhắn
    /// </summary>
    [DisableAuditing]
    public string Content { get; set; } = default!;
    /// <summary>
    /// Thời gian gửi
    /// </summary>
    public DateTime SendTime { get; set; }
    /// <summary>
    /// Có gửi ẩn danh hay không (lưu trong trường mở rộng)
    /// </summary>
    public bool IsAnonymous { get; set; }
    /// <summary>
    /// Loại tin nhắn
    /// </summary>
    public MessageType MessageType { get; set; } = MessageType.Text;

    public MessageSourceType Source { get; set; } = MessageSourceType.User;

    public ExtraPropertyDictionary ExtraProperties { get; set; }

    public ChatMessage()
    {
        ExtraProperties = new ExtraPropertyDictionary();
        this.SetDefaultsForExtraProperties();
    }

    public static ChatMessage User(
        Guid formUserId,
        string formUserName,
        Guid toUserId,
        string content,
        IClock clock,
        bool isAnonymous = false,
        MessageType type = MessageType.Text,
        MessageSourceType souce = MessageSourceType.User,
        Guid? tenantId = null)
    {
        return new ChatMessage
        {
            FormUserId = formUserId,
            FormUserName = formUserName,
            ToUserId = toUserId,
            Content = content,
            SendTime = clock.Now,
            IsAnonymous = isAnonymous,
            MessageType = type,
            TenantId = tenantId,
            Source = souce,
        };
    }
    public static ChatMessage System(
        Guid formUserId,
        Guid toUserId,
        string content,
        IClock clock,
        MessageType type = MessageType.Text,
        Guid? tenantId = null)
    {
        return new ChatMessage
        {
            FormUserId = formUserId,
            FormUserName = "system",
            ToUserId = toUserId,
            Content = content,
            SendTime = clock.Now,
            IsAnonymous = false,
            MessageType = type,
            TenantId = tenantId,
            Source = MessageSourceType.System,
        }
        .SetProperty("L", false);
    }

    /// <summary>
    /// Tin nhắn hệ thống đã bản địa hóa
    /// Tin nhắn người dùng và tin nhắn nhóm không thể dùng đa ngôn ngữ
    /// </summary>
    /// <param name="formUserId"></param>
    /// <param name="toUserId"></param>
    /// <param name="content"></param>
    /// <param name="clock"></param>
    /// <param name="type"></param>
    /// <param name="tenantId"></param>
    /// <returns></returns>
    public static ChatMessage SystemLocalized(
        Guid formUserId,
        Guid toUserId,
        LocalizableStringInfo content,
        IClock clock,
        MessageType type = MessageType.Text,
        Guid? tenantId = null)
    {
        return new ChatMessage
        {
            FormUserId = formUserId,
            FormUserName = "system",
            ToUserId = toUserId,
            Content = "",
            SendTime = clock.Now,
            IsAnonymous = false,
            MessageType = type,
            TenantId = tenantId,
            Source = MessageSourceType.System,
        }
        .SetProperty("L", true)
        .SetProperty(nameof(ChatMessage.Content).ToPascalCase(), content);
    }

    public static ChatMessage System(
        Guid formUserId,
        string groupId,
        string content,
        IClock clock,
        MessageType type = MessageType.Text,
        Guid? tenantId = null)
    {
        return new ChatMessage
        {
            FormUserId = formUserId,
            FormUserName = "system",
            GroupId = groupId,
            Content = content,
            SendTime = clock.Now,
            IsAnonymous = false,
            MessageType = type,
            TenantId = tenantId,
            Source = MessageSourceType.System,
        }
        .SetProperty("L", false);
    }
    /// <summary>
    /// Tin nhắn hệ thống đã bản địa hóa
    /// Tin nhắn người dùng và tin nhắn nhóm không thể dùng đa ngôn ngữ
    /// </summary>
    /// <param name="formUserId"></param>
    /// <param name="groupId"></param>
    /// <param name="content"></param>
    /// <param name="clock"></param>
    /// <param name="type"></param>
    /// <param name="tenantId"></param>
    /// <returns></returns>
    public static ChatMessage SystemLocalized(
        Guid formUserId,
        string groupId,
        LocalizableStringInfo content,
        IClock clock,
        MessageType type = MessageType.Text,
        Guid? tenantId = null)
    {
        return new ChatMessage
        {
            FormUserId = formUserId,
            FormUserName = "system",
            GroupId = groupId,
            Content = "",
            SendTime = clock.Now,
            IsAnonymous = false,
            MessageType = type,
            TenantId = tenantId,
            Source = MessageSourceType.System,
        }
        .SetProperty("L", true)
        .SetProperty(nameof(ChatMessage.Content).ToPascalCase(), content);
    }

    public static ChatMessage Group(
        Guid formUserId,
        string formUserName,
        string groupId,
        string content,
        IClock clock,
        bool isAnonymous = false,
        MessageType type = MessageType.Text,
        MessageSourceType souce = MessageSourceType.User,
        Guid? tenantId = null)
    {
        return new ChatMessage
        {
            FormUserId = formUserId,
            FormUserName = formUserName,
            GroupId = groupId,
            Content = content,
            SendTime = clock.Now,
            IsAnonymous = isAnonymous,
            MessageType = type,
            TenantId = tenantId,
            Source = souce,
        };
    }
}
