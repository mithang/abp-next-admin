using System;

namespace LINGYUN.Abp.Notifications;

/// <summary>
/// Hợp đồng dữ liệu kênh thông báo
/// </summary>
/// <remarks>
/// <para>
/// Dữ liệu kênh (tải trọng/payload) là cấu trúc dữ liệu đã thỏa thuận giữa kênh phát hành và nhà sản xuất.
/// Nhà sản xuất ghi tải trọng thông qua <see cref="INotificationChannelDataSerializer"/>,
/// Kênh phân giải tải trọng thông qua <see cref="INotificationChannelDataResolver"/>.
/// </para>
/// <para>
/// Sự tồn tại của tải trọng được biểu đạt một cách khai báo bởi <see cref="Presence"/>, kết hợp với
/// định nghĩa khóa của <see cref="NotificationChannelPropertyAttribute"/> để tự suy ra,
/// không cần triển khai phương thức phán đoán trong kiểu tải trọng.
/// </para>
/// <para>
/// Nếu vừa không khai báo <see cref="Presence"/>, vừa không có thuộc tính nào có thể tham gia khớp,
/// khi đăng ký sẽ ném ra <see cref="AbpNotificationChannelDataConfigurationException"/>:
/// để việc "quên định nghĩa tính tồn tại" bị lộ ra ở giai đoạn khởi động, thay vì âm thầm loại bỏ thông báo trong môi trường sản xuất.
/// </para>
/// </remarks>
[AttributeUsage(AttributeTargets.Class, AllowMultiple = false, Inherited = false)]
public sealed class NotificationChannelDataAttribute : Attribute
{
    /// <summary>
    /// Tên kênh, tương ứng với <see cref="INotificationPublishProvider.Name"/>
    /// </summary>
    public string ProviderName { get; }

    /// <summary>
    /// Thứ tự khớp của tải trọng trong cùng một kênh, giá trị càng nhỏ càng khớp trước
    /// </summary>
    /// <remarks>
    /// Dùng để biểu đạt quy tắc tường minh trong kênh, thứ tự khớp bắt buộc phải khai báo,
    /// không được phụ thuộc vào thứ tự đăng ký hay thứ tự thăm dò trường.
    /// </remarks>
    public int Priority { get; set; }

    /// <summary>
    /// Chế độ phán đoán tính tồn tại, mặc định phán đoán theo "tất cả các thuộc tính tham gia khớp đều tồn tại"
    /// </summary>
    public NotificationChannelDataPresenceMode Presence { get; set; } = NotificationChannelDataPresenceMode.DeclaredProperties;

    public NotificationChannelDataAttribute(string providerName)
    {
        if (providerName.IsNullOrWhiteSpace())
        {
            throw new ArgumentException("The provider name of the channel data can not be null or whitespace.", nameof(providerName));
        }

        ProviderName = providerName;
    }
}
