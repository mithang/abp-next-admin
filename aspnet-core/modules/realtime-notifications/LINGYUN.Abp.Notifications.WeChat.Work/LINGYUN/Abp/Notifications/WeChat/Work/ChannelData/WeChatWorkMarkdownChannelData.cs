namespace LINGYUN.Abp.Notifications.WeChat.Work;

/// <summary>
/// Tải trọng tin nhắn markdown
/// </summary>
/// <remarks>
/// Không tham gia phân tích kênh: suy ra từ <c>ContentType</c> do thông báo định nghĩa,
/// Nhà sản xuất không cần chuẩn bị bất kỳ dữ liệu riêng theo kênh nào cho nó.
/// </remarks>
public class WeChatWorkMarkdownChannelData : WeChatWorkChannelData
{
    public override WeChatWorkMessageKind Kind => WeChatWorkMessageKind.Markdown;

    /// <summary>
    /// Nội dung tin nhắn, khi trống sẽ dùng dữ liệu chuẩn của thông báo
    /// </summary>
    public virtual string? Content { get; set; }
}
