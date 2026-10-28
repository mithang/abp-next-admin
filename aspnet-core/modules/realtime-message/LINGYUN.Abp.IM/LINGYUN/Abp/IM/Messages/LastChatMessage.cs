using System;
using Volo.Abp.Auditing;
using Volo.Abp.Data;

namespace LINGYUN.Abp.IM.Messages;

/// <summary>
/// Tin nhắn trò chuyện gần nhất
/// </summary>
public class LastChatMessage : IHasExtraProperties
{
    public string? AvatarUrl { get; set; }

    public string? Object { get; set; }
    /// <summary>
    /// Tenant
    /// </summary>
    public Guid? TenantId { get; set; }
    /// <summary>
    /// Mã định danh nhóm
    /// </summary>
    public string GroupId { get; set; } = default!;
    /// <summary>
    /// Mã định danh tin nhắn
    /// </summary>
    /// <remarks>
    /// Người gọi không cần quan tâm đến trường này, trường này sẽ được dịch vụ tự động tạo
    /// </remarks>
    public string MessageId { get; set; } = default!;
    /// <summary>
    /// Mã định danh người gửi
    /// </summary>
    public Guid FormUserId { get; set; }
    /// <summary>
    /// Tên người gửi
    /// </summary>
    public string FormUserName { get; set; } = default!;
    /// <summary>
    /// Mã định danh người dùng nhận
    /// </summary>
    /// <remarks>
    /// Được thiết kế cho phép null để tương thích với tin nhắn nhóm
    /// /remarks>
    public string ToUserId { get; set; } = default!;
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
    public bool IsAnonymous => this.GetProperty(nameof(IsAnonymous), false);
    /// <summary>
    /// Loại tin nhắn
    /// </summary>
    public MessageType MessageType { get; set; }

    public MessageSourceType Source { get; set; }
    public ExtraPropertyDictionary ExtraProperties { get; set; }
    public LastChatMessage()
    {
        ExtraProperties = new ExtraPropertyDictionary();
    }
}
