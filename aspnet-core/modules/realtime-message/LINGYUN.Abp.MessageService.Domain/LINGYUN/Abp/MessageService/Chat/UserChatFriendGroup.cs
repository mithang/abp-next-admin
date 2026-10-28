using System;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace LINGYUN.Abp.MessageService.Chat;

public class UserChatFriendGroup : CreationAuditedEntity<long>, IMultiTenant
{
    /// <summary>
    /// Tenant
    /// </summary>
    public virtual Guid? TenantId { get; protected set; }
    /// <summary>
    /// Mã định danh người dùng
    /// </summary>
    public virtual Guid UserId { get; protected set; }
    /// <summary>
    /// Mã định danh nhóm
    /// </summary>
    public virtual long GroupId { get; protected set; }
    /// <summary>
    /// Tên hiển thị
    /// </summary>
    public virtual string? DisplayName { get; protected set; }
}
