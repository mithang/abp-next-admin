using LINGYUN.Abp.IM;
using LINGYUN.Abp.MessageService.Utils;
using System;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;
using Volo.Abp.Timing;

namespace LINGYUN.Abp.MessageService.Chat;

/// <summary>
/// Thẻ người dùng
/// </summary>
public class UserChatCard : AuditedAggregateRoot<long>, IMultiTenant
{
    /// <summary>
    /// Tenant
    /// </summary>
    public virtual Guid? TenantId { get; protected set; }
    /// <summary>
    /// Định danh người dùng
    /// </summary>
    public virtual Guid UserId { get; protected set; }
    /// <summary>
    /// Tên người dùng
    /// </summary>
    public virtual string UserName { get; protected set; } = default!;
    /// <summary>
    /// Giới tính
    /// </summary>
    public virtual Sex Sex { get; set; }
    /// <summary>
    /// Chữ ký
    /// </summary>
    public virtual string? Sign { get; set; }
    /// <summary>
    /// Biệt danh
    /// </summary>
    public virtual string? NickName { get; set; }
    /// <summary>
    /// Mô tả
    /// </summary>
    public virtual string? Description { get; set; }
    /// <summary>
    /// Địa chỉ ảnh đại diện
    /// </summary>
    public virtual string? AvatarUrl { get; protected set; }
    /// <summary>
    /// Ngày sinh
    /// </summary>
    public virtual DateTime? Birthday { get; protected set; }
    /// <summary>
    /// Tuổi
    /// </summary>
    public virtual int Age { get; protected set; }

    public virtual DateTime? LastOnlineTime { get; protected set; }

    public virtual UserOnlineState State { get; protected set; }

    protected UserChatCard()
    {
    }

    public UserChatCard(
        Guid userId,
        string userName,
        Sex sex,
        string? nickName = null,
        string? avatarUrl = null,
        Guid? tenantId = null)
    {
        Sex = sex;
        UserId = userId;
        UserName = userName;
        NickName = nickName ?? userName;
        AvatarUrl = avatarUrl;
        TenantId = tenantId;
    }

    public void SetBirthday(DateTime birthday, IClock clock)
    {
        Birthday = birthday;

        Age = DateTimeHelper.CalcAgrByBirthdate(birthday, clock.Now);
    }

    public void SetAvatarUrl(string url)
    {
        AvatarUrl = url;
    }

    public void ChangeState(IClock clock, UserOnlineState state)
    {
        State = state;
        if (State == UserOnlineState.Online)
        {
            LastOnlineTime = clock.Now;
        }
    }

    public UserCard ToUserCard()
    {
        return new UserCard
        {
            Age = Age,
            AvatarUrl = AvatarUrl,
            Birthday = Birthday,
            Description = Description,
            NickName = NickName,
            Sex = Sex,
            Sign = Sign,
            UserId = UserId,
            UserName = UserName,
            TenantId = TenantId,
            Online = State == UserOnlineState.Online,
        };
    }
}
