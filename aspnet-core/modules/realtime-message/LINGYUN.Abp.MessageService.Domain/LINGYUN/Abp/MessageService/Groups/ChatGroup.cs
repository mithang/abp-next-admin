using System;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace LINGYUN.Abp.MessageService.Groups;

/// <summary>
/// Nhóm trò chuyện
/// </summary>
public class ChatGroup : AuditedEntity<long>, IMultiTenant
{
    /// <summary>
    /// Tenant
    /// </summary>
    public virtual Guid? TenantId { get; protected set; }
    /// <summary>
    /// Chủ nhóm
    /// </summary>
    public virtual Guid AdminUserId { get; protected set; }
    /// <summary>
    /// Mã định danh nhóm
    /// </summary>
    public virtual long GroupId { get; protected set; }
    /// <summary>
    /// Tên nhóm
    /// </summary>
    public virtual string Name { get; protected set; } = default!;
    /// <summary>
    /// Nhãn của nhóm
    /// </summary>
    public virtual string? Tag { get; protected set; }
    /// <summary>
    /// Địa chỉ nhóm
    /// </summary>
    public virtual string? Address { get; set; }
    /// <summary>
    /// Thông báo của nhóm
    /// </summary>
    public virtual string? Notice { get; set; }
    /// <summary>
    /// Số lượng người dùng tối đa
    /// </summary>
    public virtual int MaxUserCount { get; protected set; }
    /// <summary>
    /// Cho phép trò chuyện ẩn danh
    /// </summary>
    public virtual bool AllowAnonymous { get; set; }
    /// <summary>
    /// Cho phép gửi tin nhắn
    /// </summary>
    public virtual bool AllowSendMessage { get; set; }
    /// <summary>
    /// Mô tả nhóm
    /// </summary>
    public virtual string? Description { get; set; }
    /// <summary>
    /// Địa chỉ ảnh đại diện của nhóm
    /// </summary>
    public virtual string? AvatarUrl { get; set; }
    protected ChatGroup()
    {
    }
    public ChatGroup(
        long id,
        Guid adminUserId,
        string name,
        string? tag = null,
        string? address = null,
        int maxUserCount = 200)
    {
        GroupId = id;
        AdminUserId = adminUserId;
        Name = name;
        Tag = tag;
        Address = address;
        MaxUserCount = maxUserCount;
    }
}
