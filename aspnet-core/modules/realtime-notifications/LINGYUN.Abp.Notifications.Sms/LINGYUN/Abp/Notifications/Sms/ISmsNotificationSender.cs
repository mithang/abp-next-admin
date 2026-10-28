using System.Threading.Tasks;

namespace LINGYUN.Abp.Notifications.Sms;

/// <summary>
/// Giao diện gửi thông báo SMS
/// </summary>
/// <remarks>
/// Ghi đè để triển khai xử lý tin nhắn SMS tùy chỉnh
/// </remarks>
public interface ISmsNotificationSender
{
    /// <summary>
    /// Gửi thông báo
    /// </summary>
    /// <param name="notification">Dữ liệu thông báo</param>
    /// <param name="phoneNumbers">Danh sách số điện thoại, nhiều số điện thoại phân tách bằng dấu phẩy (,)</param>
    /// <returns></returns>
    Task SendAsync(NotificationInfo notification, string phoneNumbers);
}
