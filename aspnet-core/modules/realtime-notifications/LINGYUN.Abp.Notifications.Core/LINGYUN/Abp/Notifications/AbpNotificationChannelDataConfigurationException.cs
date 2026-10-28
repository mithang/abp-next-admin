using System;

namespace LINGYUN.Abp.Notifications;

/// <summary>
/// Ngoại lệ cấu hình dữ liệu kênh
/// </summary>
/// <remarks>
/// Được ném khi kiểm tra hợp đồng trong giai đoạn đăng ký thất bại, mục đích: để lỗi cấu hình lộ ra ngay ở giai đoạn khởi động,
/// thay vì âm thầm loại bỏ thông báo trong môi trường production.
/// </remarks>
public class AbpNotificationChannelDataConfigurationException : Exception
{
    public AbpNotificationChannelDataConfigurationException(string message)
        : base(message)
    {
    }

    public AbpNotificationChannelDataConfigurationException(string message, Exception innerException)
        : base(message, innerException)
    {
    }
}
