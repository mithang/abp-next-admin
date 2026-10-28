namespace LINGYUN.Abp.Notifications.Webhook.WeChat.Work;
public class AbpNotificationsWebhookWeChatWorkOptions
{
    /// <summary>
    /// Khi gửi thông báo dạng Markdown có sử dụng định dạng MarkdownV2 hay không, mặc định: true
    /// </summary>
    /// <remarks>
    /// Xem chi tiết: https://developer.work.weixin.qq.com/document/path/99110#markdown-v2%E7%B1%BB%E5%9E%8B
    /// </remarks>
    public bool UseMarkdownV2 {  get; set; }
    public AbpNotificationsWebhookWeChatWorkOptions()
    {
        UseMarkdownV2 = true;
    }
}
