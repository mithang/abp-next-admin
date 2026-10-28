using System;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;
using Volo.Abp.Timing;

namespace LINGYUN.Abp.MessageService.Groups;

/// <summary>
/// Thẻ nhóm của người dùng
/// </summary>
public class UserGroupCard : AuditedAggregateRoot<long>, IMultiTenant
{
    /// <summary>
    /// Bên thuê
    /// </summary>
    public virtual Guid? TenantId { get; protected set; }
    /// <summary>
    /// Mã định danh người dùng
    /// </summary>
    public virtual Guid UserId { get; protected set; }
    /// <summary>
    /// Biệt danh
    /// </summary>
    public virtual string? NickName { get; set; }
    /// <summary>
    /// Có phải quản trị viên không
    /// </summary>
    public virtual bool IsAdmin { get; protected set; }
    /// <summary>
    /// Thời điểm kết thúc cấm chat
    /// </summary>
    public virtual DateTime? SilenceEnd { get; protected set; }
    protected UserGroupCard()
    {
    }
    public UserGroupCard(
        Guid userId,
        string nickName = "",
        bool isAdmin = false,
        DateTime? silenceEnd = null,
        Guid? tenantId = null)
    {
        UserId = userId;
        NickName = nickName;
        IsAdmin = isAdmin;
        SilenceEnd = silenceEnd;
        TenantId = tenantId;
    }
    /// <summary>
    /// Đặt quản trị viên
    /// </summary>
    /// <param name="admin"></param>
    public void SetAdmin(bool admin)
    {
        IsAdmin = admin;
    }
    /// <summary>
    /// Cấm chat
    /// </summary>
    /// <param name="clock"></param>
    /// <param name="seconds"></param>
    public void Silence(IClock clock, double seconds)
    {
        SilenceEnd = clock.Now.AddSeconds(seconds);
    }
    /// <summary>
    /// Hủy cấm chat
    /// </summary>
    public void UnSilence()
    {
        SilenceEnd = null;
    }
}
