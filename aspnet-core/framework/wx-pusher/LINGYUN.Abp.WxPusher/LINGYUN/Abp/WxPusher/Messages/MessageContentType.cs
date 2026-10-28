namespace LINGYUN.Abp.WxPusher.Messages;
public enum MessageContentType
{
    /// <summary>
    /// Văn bản
    /// </summary>
    Text = 1,
    /// <summary>
    /// html(chỉ gửi dữ liệu bên trong thẻ body là đủ, không bao gồm thẻ body
    /// </summary>
    Html = 2,
    /// <summary>
    /// markdown
    /// </summary>
    Markdown = 3
}
