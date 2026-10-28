using System;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace LINGYUN.Abp.MessageService.Groups;

/// <summary>
/// Nhóm người dùng
/// </summary>
public class UserChatGroup : CreationAuditedEntity<long>, IMultiTenant
{
    /// <summary>
    /// Đơn vị thuê (Tenant)
    /// </summary>
    public virtual Guid? TenantId { get; protected set; }
    public virtual Guid UserId { get; protected set; }
    public virtual long GroupId { get; protected set; }
    protected UserChatGroup() { }
    public UserChatGroup(long groupId, Guid userId, Guid acceptUserId, Guid? tenantId = null)
    {
        UserId = userId;
        GroupId = groupId;
        CreatorId = acceptUserId;
        TenantId = tenantId;
    }
}
