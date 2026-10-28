using System;

namespace LINGYUN.Abp.Notifications;

/// <summary>
/// Abstraction tuần tự hóa JSON cho dữ liệu kênh thông báo (payload)
/// </summary>
public interface INotificationChannelDataJsonSerializer
{
    /// <summary>
    /// Tuần tự hóa
    /// </summary>
    string Serialize(object value, Type valueType);

    /// <summary>
    /// Giải tuần tự hóa
    /// </summary>
    /// <param name="json">Chuỗi JSON</param>
    /// <param name="targetType">Kiểu đích</param>
    /// <returns>Thể hiện, trả về null khi kiểu không được hỗ trợ</returns>
    object? Deserialize(string json, Type targetType);
}
