using System;

namespace LINGYUN.Abp.Notifications;

/// <summary>
/// Bộ truy cập dữ liệu kênh thông báo (tải trọng)
/// </summary>
/// <remarks>
/// <para>
/// Dữ liệu thông báo trong các liên kết như bền vững hóa, thử lại khi thất bại, phân phối liên tiến trình chắc chắn trải qua khứ hồi JSON,
/// Sau khứ hồi, giá trị trong <c>ExtraPropertyDictionary</c> là nút JSON chứ không phải phiên bản CLR gốc:
/// <c>byte 1</c> sẽ trở thành <c>long 1</c> / <c>JsonElement(Number)</c>,
/// <c>x as byte?</c> cũ sẽ luôn trả về null.
/// </para>
/// <para>
/// Dịch vụ này là triển khai duy nhất chuyển đổi "gói thuộc tính kiểu yếu ↔ giá trị kiểu mạnh" của dữ liệu kênh,
/// được dùng chung bởi <see cref="INotificationChannelDataSerializer"/> và
/// <see cref="INotificationChannelDataResolver"/>,
/// và đảm bảo không phụ thuộc vào triển khai JSON được dùng.
/// </para>
/// </remarks>
public interface INotificationChannelDataAccessor
{
    /// <summary>
    /// Lấy khóa kiểu dữ liệu của tải trọng
    /// </summary>
    /// <returns>Tên khóa, trả về null khi kiểu không có tên đầy đủ</returns>
    string? GetDataTypeKey(Type payloadType);

    /// <summary>
    /// Khóa có tồn tại hay không (không phân biệt chữ hoa chữ thường)
    /// </summary>
    bool IsPresent(NotificationData notificationData, string key);

    /// <summary>
    /// Đọc giá trị gốc (không phân biệt chữ hoa chữ thường)
    /// </summary>
    /// <param name="notificationData">Dữ liệu thông báo</param>
    /// <param name="key">Tên khóa</param>
    /// <param name="value">Giá trị gốc</param>
    /// <param name="matchedKey">Tên khóa thực tế khớp (có thể khác chữ hoa chữ thường so với tham số đầu vào)</param>
    bool TryGetRawValue(NotificationData notificationData, string key, out object? value, out string? matchedKey);

    /// <summary>
    /// Đọc và chuyển đổi sang kiểu đích
    /// </summary>
    /// <returns>Giá trị sau chuyển đổi; trả về null khi khóa không tồn tại hoặc không thể chuyển đổi</returns>
    object? Get(NotificationData notificationData, string key, Type targetType);

    /// <summary>
    /// Đọc theo kiểu (trả về null khi chưa đặt, để phân biệt "chưa đặt" với "false/0 tường minh")
    /// </summary>
    TValue? GetValue<TValue>(NotificationData notificationData, string key)
        where TValue : struct;

    /// <summary>
    /// Đọc theo kiểu, trả về giá trị mặc định khi chưa đặt
    /// </summary>
    TValue GetValue<TValue>(NotificationData notificationData, string key, TValue defaultValue)
        where TValue : struct;

    /// <summary>
    /// Đọc theo thứ tự giá trị chuỗi không rỗng đầu tiên (không phân biệt chữ hoa chữ thường)
    /// </summary>
    string? GetOrNull(NotificationData notificationData, params string[] keys);

    /// <summary>
    /// Ghi giá trị, kiểu phức tạp được lưu trữ dưới dạng JSON
    /// </summary>
    void Set(NotificationData notificationData, string key, Type valueType, object? value, NotificationChannelDataFormat format);
}
