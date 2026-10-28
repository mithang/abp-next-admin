using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LINGYUN.Abp.Notifications;

/// <summary>
/// Giao diện gửi thông báo
/// </summary>
public interface INotificationSender
{
    /// <summary>
    /// Gửi thông báo
    /// </summary>
    /// <param name="name">Tên</param>
    /// <param name="data">Dữ liệu</param>
    /// <param name="users">Danh sách người dùng, để trống nghĩa là gửi cho tất cả người dùng đã đăng ký</param>
    /// <param name="tenantId">Tenant</param>
    /// <param name="severity">Mức độ nghiêm trọng</param>
    /// <param name="useProviders">Sử dụng nhà cung cấp thông báo</param>
    /// <returns>Định danh thông báo</returns>
    Task<string> SendNofiterAsync(
        string name,
        NotificationData data,
        IEnumerable<UserIdentifier>? users = null,
        Guid? tenantId = null,
        NotificationSeverity severity = NotificationSeverity.Info,
        IEnumerable<string>? useProviders = null);
    /// <summary>
    /// Gửi thông báo mẫu
    /// </summary>
    /// <param name="name">Tên</param>
    /// <param name="template">Đối tượng mẫu</param>
    /// <param name="users">Danh sách người dùng, để trống nghĩa là gửi cho tất cả người dùng đã đăng ký</param>
    /// <param name="tenantId">Tenant</param>
    /// <param name="severity">Mức độ nghiêm trọng</param>
    /// <param name="useProviders">Sử dụng nhà cung cấp thông báo</param>
    /// <returns></returns>
    Task<string> SendNofiterAsync(
        string name,
        NotificationTemplate template,
        IEnumerable<UserIdentifier>? users = null,
        Guid? tenantId = null,
        NotificationSeverity severity = NotificationSeverity.Info,
        IEnumerable<string>? useProviders = null);
}
