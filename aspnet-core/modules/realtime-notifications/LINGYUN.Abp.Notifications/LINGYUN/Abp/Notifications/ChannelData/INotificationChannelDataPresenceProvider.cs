using System;
using System.Collections.Generic;

namespace LINGYUN.Abp.Notifications;

/// <summary>
/// Nhà cung cấp xét tồn tại dữ liệu kênh
/// </summary>
public interface INotificationChannelDataPresenceProvider
{
    /// <summary>
    /// Lấy chế độ xét tồn tại do tải trọng khai báo
    /// </summary>
    NotificationChannelDataPresenceMode GetPresenceMode(Type channelDataType);

    /// <summary>
    /// Lấy các khóa thuộc tính tham gia khớp
    /// </summary>
    IReadOnlyList<string> GetMatchingKeys(Type channelDataType);

    /// <summary>
    /// Tạo ủy quyền xét tồn tại
    /// </summary>
    /// <exception cref="AbpNotificationChannelDataConfigurationException">
    /// Đã khai báo xét tồn tại theo khóa, nhưng không có thuộc tính nào có thể tham gia khớp
    /// </exception>
    Func<NotificationData, bool> Create(Type channelDataType);
}
