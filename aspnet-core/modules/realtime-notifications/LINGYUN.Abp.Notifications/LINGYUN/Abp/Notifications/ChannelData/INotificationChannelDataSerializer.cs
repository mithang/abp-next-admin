using System;

namespace LINGYUN.Abp.Notifications;

/// <summary>
/// Bộ tuần tự hóa dữ liệu kênh thông báo (payload)
/// </summary>
/// <remarks>
/// Điểm vào thống nhất phía producer, chịu trách nhiệm ghi payload kiểu mạnh vào <see cref="NotificationData"/>。
/// </remarks>
public interface INotificationChannelDataSerializer
{
    /// <summary>
    /// Ghi dữ liệu kênh (payload)
    /// </summary>
    /// <typeparam name="TChannelData">Loại payload</typeparam>
    /// <param name="notificationData">Dữ liệu thông báo</param>
    /// <param name="channelData">Thể hiện payload</param>
    NotificationData Write<TChannelData>(NotificationData notificationData, TChannelData channelData)
        where TChannelData : class;

    /// <summary>
    /// Ghi dữ liệu kênh (payload)
    /// </summary>
    /// <param name="notificationData">Dữ liệu thông báo</param>
    /// <param name="channelData">Thể hiện payload</param>
    NotificationData Write(NotificationData notificationData, NotificationChannelData channelData);

    /// <summary>
    /// Xóa dữ liệu kênh theo loại payload
    /// </summary>
    NotificationData Clear<TChannelData>(NotificationData notificationData)
        where TChannelData : class;

    /// <summary>
    /// Kiểm tra xem dữ liệu thông báo có chứa payload chỉ định hay không
    /// </summary>
    bool Has<TPayload>(NotificationData notificationData)
        where TPayload : class;
}
