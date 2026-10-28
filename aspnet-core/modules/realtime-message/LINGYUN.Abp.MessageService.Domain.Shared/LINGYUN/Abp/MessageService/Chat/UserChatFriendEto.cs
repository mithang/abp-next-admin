using LINGYUN.Abp.IM.Contract;
using System;
using Volo.Abp.MultiTenancy;

namespace LINGYUN.Abp.MessageService.Chat;

public class UserChatFriendEto : IMultiTenant
{
    public Guid? TenantId { get; set; }
    /// <summary>
    /// Mã định danh người dùng
    /// </summary>
    public Guid UserId { get; set; }
    /// <summary>
    /// Mã định danh bạn bè
    /// </summary>
    public Guid FrientId { get; set; }
    /// <summary>
    /// Trạng thái
    /// </summary>
    public UserFriendStatus Status { get; set; }
}
