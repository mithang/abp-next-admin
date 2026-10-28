using System;

namespace LINGYUN.Abp.Notifications;

/// <summary>
/// Metadata thuộc tính dữ liệu kênh
/// </summary>
/// <remarks>
/// Được suy ra từ <see cref="NotificationChannelPropertyAttribute"/>,
/// mô tả "ghi/đọc khóa nào, kiểu là gì, có tham gia vào việc xác định sự tồn tại hay không".
/// </remarks>
public sealed class NotificationChannelDataProperty
{
    /// <summary>
    /// Tên khóa dữ liệu
    /// </summary>
    public string Key { get; }

    /// <summary>
    /// Kiểu khai báo của thuộc tính
    /// </summary>
    public Type PropertyType { get; }

    /// <summary>
    /// Định dạng lưu trữ
    /// </summary>
    public NotificationChannelDataFormat Format { get; }

    /// <summary>
    /// Có bỏ qua thuộc tính này khi xác định sự tồn tại hay không
    /// </summary>
    public bool IgnoreWhenMatching { get; }

    /// <summary>
    /// Delegate đọc
    /// </summary>
    public Func<object, object?> GetValue { get; }

    /// <summary>
    /// Delegate ghi
    /// </summary>
    public Action<object, object?> SetValue { get; }

    public NotificationChannelDataProperty(
        string key,
        Type propertyType,
        NotificationChannelDataFormat format,
        bool ignoreWhenMatching,
        Func<object, object?> getValue,
        Action<object, object?> setValue)
    {
        Key = key;
        PropertyType = propertyType;
        Format = format;
        IgnoreWhenMatching = ignoreWhenMatching;
        GetValue = getValue;
        SetValue = setValue;
    }
}
