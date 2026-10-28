using Volo.Abp.Modularity;

namespace LINGYUN.Abp.Notifications.Webhook.WeChat.Work;

/// <summary>
/// Tên kênh thông báo Webhook của WeChat Work
/// </summary>
/// <remarks>
/// <para>
/// Việc **phát hành** của Webhook vẫn đi qua <c>WebhookNotificationPublishProvider</c> (tên kênh <c>Webhook</c>),
/// Hằng số này chỉ được dùng làm **khóa của sổ đăng ký tải trọng**:
/// Thông báo ứng dụng WeChat Work (tên kênh <c>WeChat.Work</c>) và Webhook là hai phương thức truyền tải,
/// hai mô hình vật mang khác nhau, vì vậy phải dùng các khóa sổ đăng ký khác nhau để tránh tải trọng bị phía còn lại phân tích nhầm.
/// </para>
/// <para>
/// Phía nhà sản xuất: trong định nghĩa thông báo vẫn phải khai báo <c>ProviderName</c> là <c>"Webhook"</c> thì mới được phát hành,
/// Tải trọng được ghi bằng khóa dữ liệu của kênh này (tiền tố <c>wx-work-hook:</c>).
/// </para>
/// </remarks>
public static class WeChatWorkWebhookNotificationProvider
{
    /// <summary>
    /// Khóa sổ đăng ký tải trọng của kênh này
    /// </summary>
    public const string ProviderName = "WeChat.Work.Webhook";
}
