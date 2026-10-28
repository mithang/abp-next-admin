using System.Threading.Tasks;

namespace LINGYUN.Abp.Notifications;
/// <summary>
/// Bộ chặn phát hành thông báo, triển khai giao diện này để thêm kiểm tra tùy chỉnh trước khi phát hành
/// </summary>
public interface INotificationPublishInterceptor
{
    /// <summary>
    /// Mức độ ưu tiên chặn, giá trị càng nhỏ mức độ ưu tiên càng cao
    /// </summary>
    int Priority { get; }

    /// <summary>
    /// Thực hiện kiểm tra trước khi phát hành thông báo
    /// </summary>
    /// <param name="notification">Thông tin thông báo</param>
    /// <returns>true - cho phép phát hành, false - chặn phát hành</returns>
    Task<bool> CanPublishAsync(NotificationInfo notification);
}
