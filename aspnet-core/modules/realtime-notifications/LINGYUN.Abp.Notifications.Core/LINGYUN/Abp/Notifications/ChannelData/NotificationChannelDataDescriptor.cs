using System;

namespace LINGYUN.Abp.Notifications;

/// <summary>
/// Bộ mô tả dữ liệu kênh thông báo (payload)
/// </summary>
public sealed class NotificationChannelDataDescriptor
{
    /// <summary>
    /// Tên kênh
    /// </summary>
    public string ProviderName { get; }

    /// <summary>
    /// Loại payload
    /// </summary>
    public Type PayloadType { get; }

    /// <summary>
    /// Thứ tự khớp, giá trị càng nhỏ càng khớp trước
    /// </summary>
    public int Priority { get; }

    /// <summary>
    /// Chế độ xác định sự tồn tại
    /// </summary>
    public NotificationChannelDataPresenceMode Presence { get; }

    /// <summary>
    /// Xác định xem dữ liệu thông báo có chứa payload này hay không
    /// </summary>
    public Func<NotificationData, bool> IsPresent { get; }

    public NotificationChannelDataDescriptor(
        string providerName,
        Type payloadType,
        int priority,
        NotificationChannelDataPresenceMode presence,
        Func<NotificationData, bool> isPresent)
    {
        ProviderName = providerName;
        PayloadType = payloadType;
        Priority = priority;
        Presence = presence;
        IsPresent = isPresent;
    }

    public override string ToString()
    {
        return $"{ProviderName}:{PayloadType.Name}(Priority={Priority}, Presence={Presence})";
    }
}
