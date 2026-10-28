namespace LINGYUN.Abp.Notifications;

/// <summary>
/// Lớp cơ sở dữ liệu kênh thông báo (payload)
/// </summary>
/// <remarks>
/// <para>
/// Dữ liệu kênh là "cấu trúc dữ liệu kiểu mạnh mà kênh phát hành có thể hiểu", nhà sản xuất dùng nó để biểu đạt ngữ nghĩa riêng của kênh,
/// phía triển khai kênh dùng nó để phân tích ra vật mang tin nhắn cụ thể.
/// </para>
/// <para>
/// Lớp dẫn xuất cần làm hai việc:
/// <list type="number">
/// <item>
/// Dùng <see cref="NotificationChannelDataAttribute"/> để khai báo kênh, thứ tự khớp và
/// <see cref="NotificationChannelDataAttribute.Presence"/> chế độ xác định sự tồn tại;
/// </item>
/// <item>
/// Dùng <see cref="NotificationChannelPropertyAttribute"/> để gắn thuộc tính tham gia đọc/ghi.
/// </item>
/// </list>
/// </para>
/// </remarks>
public abstract class NotificationChannelData
{
}
