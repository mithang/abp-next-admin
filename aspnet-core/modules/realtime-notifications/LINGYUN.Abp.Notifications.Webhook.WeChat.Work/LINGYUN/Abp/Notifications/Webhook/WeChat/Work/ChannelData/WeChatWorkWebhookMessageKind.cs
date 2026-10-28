namespace LINGYUN.Abp.Notifications.Webhook.WeChat.Work;

/// <summary>
/// Loại đối tượng mang tin nhắn Webhook của WeChat Work
/// </summary>
/// <remarks>
/// Giá trị nhất quán với <c>WeChatWorkWebhookMessage.MsgType</c> của framework.
/// </remarks>
public enum WeChatWorkWebhookMessageKind
{
    /// <summary>
    /// Chưa chỉ định
    /// </summary>
    None = 0,
    /// <summary>
    /// Văn bản
    /// </summary>
    Text = 1,
    /// <summary>
    /// Markdown
    /// </summary>
    Markdown = 2,
    /// <summary>
    /// Markdown_v2
    /// </summary>
    MarkdownV2 = 3,
    /// <summary>
    /// Hình ảnh
    /// </summary>
    Image = 4,
    /// <summary>
    /// Tin tức đồ họa
    /// </summary>
    News = 5,
    /// <summary>
    /// Tệp
    /// </summary>
    File = 6,
    /// <summary>
    /// Giọng nói
    /// </summary>
    Voice = 7,
    /// <summary>
    /// Thẻ mẫu
    /// </summary>
    TemplateCard = 8
}
