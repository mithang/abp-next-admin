using System.Collections.Generic;
using System.Threading.Tasks;

namespace LINGYUN.Abp.Notifications;

/// <summary>
/// Giao diện nhà cung cấp phát hành thông báo
/// </summary>
public interface INotificationPublishProvider
{
    /// <summary>
    /// Tên
    /// </summary>
    string Name { get; }
    /// <summary>
    /// Có thể phát hành thông báo hay không
    /// </summary>
    /// <param name="notification"></param>
    /// <returns></returns>
    Task<bool> CanPublishAsync(
        NotificationInfo notification);
    /// <summary>
    /// Phát hành thông báo
    /// </summary>
    /// <param name="context">Thông tin bối cảnh gửi thông báo</param>
    /// <returns></returns>
    Task PublishAsync(NotificationPublishContext context);
}
