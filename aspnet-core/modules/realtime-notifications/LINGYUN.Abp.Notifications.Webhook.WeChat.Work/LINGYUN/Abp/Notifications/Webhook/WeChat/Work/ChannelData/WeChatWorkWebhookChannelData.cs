namespace LINGYUN.Abp.Notifications.Webhook.WeChat.Work;

/// <summary>
/// Lớp cơ sở dữ liệu kênh Webhook WeChat doanh nghiệp (tải trọng)
/// </summary>
/// <remarks>
/// Mỗi tải trọng tương ứng với một vật mang tin nhắn Webhook, khai báo rõ dạng thức qua <see cref="Kind"/>,
/// Phía kênh dùng từ điển factory để phân phối O(1).
/// </remarks>
public abstract class WeChatWorkWebhookChannelData : NotificationChannelData
{
    /// <summary>
    /// Loại vật mang tin nhắn
    /// </summary>
    public abstract WeChatWorkWebhookMessageKind Kind { get; }
}
