namespace LINGYUN.Abp.Notifications;

/// <summary>
/// Chế độ xác định sự tồn tại của dữ liệu kênh (payload)
/// </summary>
public enum NotificationChannelDataPresenceMode
{
    /// <summary>
    /// Payload luôn được coi là tồn tại
    /// </summary>
    /// <remarks>
    /// Áp dụng cho payload không phụ thuộc vào dữ liệu thông báo (do kênh tự xây dựng lúc chạy).
    /// </remarks>
    None = 0,

    /// <summary>
    /// Khi tất cả thuộc tính tham gia khớp đều tồn tại, payload được coi là tồn tại (mặc định)
    /// </summary>
    /// <remarks>
    /// Áp dụng cho trường hợp "một khóa nào đó chính là định danh payload", ví dụ các loại tin nhắn của WeChat doanh nghiệp.
    /// </remarks>
    DeclaredProperties = 1,

    /// <summary>
    /// Khi bất kỳ thuộc tính nào tham gia khớp tồn tại, payload được coi là tồn tại
    /// </summary>
    /// <remarks>
    /// Áp dụng cho trường hợp "chỉ cần bất kỳ một trong nhiều khóa tùy chọn",
    /// ví dụ webhook và callback của PushPlus, chỉ cần một trong hai.
    /// </remarks>
    AnyDeclaredProperty = 2
}
