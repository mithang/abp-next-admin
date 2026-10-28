using System;
using Volo.Abp.Domain.Entities;
using Volo.Abp.MultiTenancy;

namespace LINGYUN.Abp.MessageService.Chat;

public class UserChatSetting : Entity<long>, IMultiTenant
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
    /// Cho phép trò chuyện ẩn danh
    /// </summary>
    public virtual bool AllowAnonymous { get; set; }
    /// <summary>
    /// Cho phép thêm bạn bè
    /// </summary>
    public virtual bool AllowAddFriend { get; set; }
    /// <summary>
    /// Thêm bạn bè cần xác minh
    /// </summary>
    public virtual bool RequireAddFriendValition { get; set; }
    /// <summary>
    /// Cho phép nhận tin nhắn
    /// </summary>
    public virtual bool AllowReceiveMessage { get; set; }
    /// <summary>
    /// Cho phép gửi tin nhắn
    /// </summary>
    public virtual bool AllowSendMessage { get; set; }
    protected UserChatSetting() 
    {
    }
    public UserChatSetting(Guid userId, Guid? tenantId)
        : this()
    {
        UserId = userId;
        TenantId = tenantId;
        AllowAnonymous = false;
        AllowAddFriend = true;
        AllowReceiveMessage = true;
        AllowSendMessage = true;
        RequireAddFriendValition = true;
    }
}
