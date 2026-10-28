using System;

namespace LINGYUN.Abp.Notifications;

/// <summary>
/// Xác định kiểu giá trị của dữ liệu kênh
/// </summary>
/// <remarks>
/// Dùng để phân biệt kiểu đơn giản "có thể lưu trực tiếp vào gói thuộc tính" với kiểu phức tạp "cần tuần tự hóa".
/// </remarks>
public static class NotificationChannelDataValueTypes
{
    /// <summary>
    /// Xác định xem có phải kiểu đơn giản có thể lưu trữ trực tiếp hay không
    /// </summary>
    public static bool IsPrimitive(Type type)
    {
        return type.IsPrimitive
            || type.IsEnum
            || type == typeof(string)
            || type == typeof(decimal)
            || type == typeof(DateTime)
            || type == typeof(DateTimeOffset)
            || type == typeof(TimeSpan)
            || type == typeof(Guid);
    }
}
