namespace LINGYUN.Abp.Notifications.WeChat.Work;

/// <summary>
/// Tải trọng tin nhắn văn bản
/// </summary>
/// <remarks>
/// Không tham gia phân tích kênh: tin nhắn văn bản được suy ra từ dữ liệu chuẩn của thông báo (title/message),
/// Nhà sản xuất không cần chuẩn bị bất kỳ dữ liệu riêng của kênh nào cho nó.
/// </remarks>
public class WeChatWorkTextChannelData : WeChatWorkChannelData
{
    public override WeChatWorkMessageKind Kind => WeChatWorkMessageKind.Text;

    /// <summary>
    /// Nội dung tin nhắn, khi để trống sẽ dùng dữ liệu chuẩn của thông báo
    /// </summary>
    public virtual string? Content { get; set; }
}
