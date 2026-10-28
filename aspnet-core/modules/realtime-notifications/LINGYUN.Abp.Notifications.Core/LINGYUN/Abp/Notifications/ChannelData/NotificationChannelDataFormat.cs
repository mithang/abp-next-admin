namespace LINGYUN.Abp.Notifications;

/// <summary>
/// Định dạng lưu trữ thuộc tính dữ liệu (payload) của kênh thông báo
/// </summary>
public enum NotificationChannelDataFormat
{
    /// <summary>
    /// Tự động nhận dạng (mặc định)
    /// </summary>
    /// <remarks>
    /// Kiểu đơn giản được chuyển đổi trực tiếp, kiểu phức tạp được tuần tự hóa thành chuỗi JSON,
    /// Khi đọc cũng tương thích với cả hai dạng "thể hiện đối tượng" và "chuỗi JSON".
    /// </remarks>
    Auto = 0,
    /// <summary>
    /// Luôn lưu trữ dưới dạng chuỗi JSON
    /// </summary>
    Json = 1
}
