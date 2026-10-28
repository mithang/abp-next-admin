using LINGYUN.Abp.WeChat.Work.Messages;

namespace LINGYUN.Abp.Notifications.Webhook.WeChat.Work;

/// <summary>
/// Kết quả xây dựng thông báo Webhook WeChat doanh nghiệp
/// </summary>
public class WeChatWorkWebhookMessageFactoryResult
{
    /// <summary>
    /// Vật chứa thông báo
    /// </summary>
    public WeChatWorkWebhookMessage Message { get; }

    /// <summary>
    /// Kiểu vật chứa thông báo, dùng cho ghi log và khắc phục sự cố
    /// </summary>
    public WeChatWorkWebhookMessageKind Kind { get; }

    public WeChatWorkWebhookMessageFactoryResult(
        WeChatWorkWebhookMessage message,
        WeChatWorkWebhookMessageKind kind)
    {
        Message = message;
        Kind = kind;
    }

    public static WeChatWorkWebhookMessageFactoryResult Create(
        WeChatWorkWebhookMessage message,
        WeChatWorkWebhookMessageKind kind)
    {
        return new WeChatWorkWebhookMessageFactoryResult(message, kind);
    }
}
