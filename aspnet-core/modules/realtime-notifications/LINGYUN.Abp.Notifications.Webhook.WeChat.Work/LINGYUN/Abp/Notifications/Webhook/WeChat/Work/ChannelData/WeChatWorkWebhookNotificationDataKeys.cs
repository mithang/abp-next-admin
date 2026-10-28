namespace LINGYUN.Abp.Notifications.Webhook.WeChat.Work;

/// <summary>
/// Khóa dữ liệu thông báo Webhook WeChat Work
/// </summary>
/// <remarks>
/// <para>
/// Tiền tố <c>wx-work-hook:</c> thuộc về chính kênh Webhook.
/// Kênh **tin nhắn ứng dụng** của WeChat Work sử dụng tiền tố <c>wx-work:</c> — hai kênh là các phương thức truyền tải khác nhau,
/// Không gian khóa phải tách riêng, nếu không khi cùng một thông báo được cả hai kênh đăng ký đồng thời,
/// payload sẽ bị cả hai phía phân tích và gửi đi mỗi phía một bản.
/// </para>
/// <para>
/// Quá trình đọc không phân biệt chữ hoa/chữ thường (ưu tiên khớp chính xác).
/// </para>
/// </remarks>
public static class WeChatWorkWebhookNotificationDataKeys
{
    /// <summary>
    /// Tiền tố khóa dữ liệu của kênh này
    /// </summary>
    public const string Prefix = "wx-work-hook:";

    /// <summary>
    /// Tin nhắn văn bản
    /// </summary>
    public const string Text = Prefix + "text";
    /// <summary>
    /// Tin nhắn markdown
    /// </summary>
    public const string Markdown = Prefix + "markdown";
    /// <summary>
    /// Tin nhắn markdown_v2
    /// </summary>
    public const string MarkdownV2 = Prefix + "markdown_v2";
    /// <summary>
    /// Tin nhắn hình ảnh (base64 + md5)
    /// </summary>
    public const string Image = Prefix + "image";
    /// <summary>
    /// Tin nhắn hình ảnh và văn bản
    /// </summary>
    public const string News = Prefix + "news";
    /// <summary>
    /// Tin nhắn tệp
    /// </summary>
    public const string File = Prefix + "file";
    /// <summary>
    /// Tin nhắn thoại
    /// </summary>
    public const string Voice = Prefix + "voice";
    /// <summary>
    /// Tin nhắn thẻ mẫu
    /// </summary>
    public const string TemplateCard = Prefix + "template_card";
}
