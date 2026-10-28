using LINGYUN.Abp.IM.Contract;
using System;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace LINGYUN.Abp.MessageService.Chat;

public class UserChatFriend : CreationAuditedAggregateRoot<long>, IMultiTenant
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
    /// Định danh bạn bè
    /// </summary>
    public virtual Guid FrientId { get; protected set; }
    /// <summary>
    /// Được hệ thống tạo sẵn
    /// </summary>
    public virtual bool IsStatic { get; set; }
    /// <summary>
    /// Đã thêm vào danh sách chặn
    /// </summary>
    public virtual bool Black { get; set; }
    /// <summary>
    /// Không làm phiền tin nhắn
    /// </summary>
    public virtual bool DontDisturb { get; set; }
    /// <summary>
    /// Quan tâm đặc biệt
    /// </summary>
    public virtual bool SpecialFocus { get; set; }
    /// <summary>
    /// Tên ghi chú
    /// </summary>
    public virtual string? RemarkName { get; set; }
    /// <summary>
    /// Mô tả bổ sung
    /// </summary>
    public virtual string? Description { get; set; }

    public virtual UserFriendStatus Status { get; protected set; }

    protected UserChatFriend()
    {
    }

    public UserChatFriend(
        Guid userId,
        Guid friendId,
        string? remarkName = null,
        string? description = null,
        Guid? tenantId = null)
    {
        UserId = userId;
        FrientId = friendId;
        RemarkName = remarkName;
        TenantId = tenantId;
        Description = description;
        Status = UserFriendStatus.NeedValidation;
    }

    public void SetStatus(UserFriendStatus status = UserFriendStatus.NeedValidation)
    {
        if (Status == UserFriendStatus.NeedValidation && status == UserFriendStatus.Added)
        {
            // Nếu là trường hợp xác thực sau đó được chấp thuận thì cần một sự kiện riêng
            AddLocalEvent(new UserChatFriendEto
            {
                TenantId = TenantId,
                UserId = UserId,
                FrientId = FrientId,
                Status = UserFriendStatus.Added
            });
        }
        Status = status;
    }
}
