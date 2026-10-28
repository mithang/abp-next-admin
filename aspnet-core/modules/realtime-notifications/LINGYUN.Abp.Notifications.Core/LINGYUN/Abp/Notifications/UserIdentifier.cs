using System;

namespace LINGYUN.Abp.Notifications;

/// <summary>
/// Thông tin người dùng
/// </summary>
public class UserIdentifier
{
    /// <summary>
    /// Mã định danh người dùng
    /// </summary>
    public Guid UserId { get; set; }
    /// <summary>
    /// Tên người dùng
    /// </summary>
    public string? UserName { get; set; }

    public UserIdentifier()
    {

    }

    public UserIdentifier(Guid userId, string? userName)
    {
        UserId = userId;
        UserName = userName;
    }
}
