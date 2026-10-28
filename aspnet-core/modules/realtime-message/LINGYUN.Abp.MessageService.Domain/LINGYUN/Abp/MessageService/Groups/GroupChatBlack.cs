using System;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace LINGYUN.Abp.MessageService.Groups;

/// <summary>
/// Danh sách đen người dùng
/// </summary>
public class GroupChatBlack : CreationAuditedEntity<long>, IMultiTenant
{
    /// <summary>
    /// Tenant
    /// </summary>
    public virtual Guid? TenantId { get; protected set; }
    /// <summary>
    /// Mã định danh nhóm
    /// </summary>
    public virtual long GroupId { get; protected set; }
    /// <summary>
    /// Người dùng bị chặn
    /// </summary>
    public virtual Guid ShieldUserId { get; protected set; }
    protected GroupChatBlack() { }
    public GroupChatBlack(long groupId, Guid shieldUserId, Guid? tenantId)
    {
        GroupId = groupId;
        ShieldUserId = shieldUserId;
        TenantId = tenantId;
    }
}
