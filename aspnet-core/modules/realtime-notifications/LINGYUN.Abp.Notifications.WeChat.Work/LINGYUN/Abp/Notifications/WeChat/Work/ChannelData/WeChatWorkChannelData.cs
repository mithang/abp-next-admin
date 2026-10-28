namespace LINGYUN.Abp.Notifications.WeChat.Work;

/// <summary>
/// Lớp cơ sở dữ liệu kênh WeChat doanh nghiệp (payload)
/// </summary>
/// <remarks>
/// Mỗi payload tương ứng với một loại vật mang tin nhắn WeChat doanh nghiệp, thông qua <see cref="Kind"/> để khai báo rõ ràng hình thái,
/// phía kênh sử dụng từ điển factory để phân phối O(1), không còn phụ thuộc vào thứ tự dò tìm if/else.
/// <para>
/// Tính tồn tại được suy ra một cách khai báo bởi <see cref="NotificationChannelDataAttribute.Presence"/>:
/// Mỗi payload chỉ có một "khóa định danh", vì vậy ngữ nghĩa mặc định "tất cả các thuộc tính tham gia khớp đều tồn tại" là đúng,
/// không cần triển khai phương thức xác định trong loại payload.
/// </para>
/// </remarks>
public abstract class WeChatWorkChannelData : NotificationChannelData
{
    /// <summary>
    /// Loại vật mang tin nhắn
    /// </summary>
    public abstract WeChatWorkMessageKind Kind { get; }
}
