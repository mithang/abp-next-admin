namespace LINGYUN.Abp.Notifications.WeChat.Work;

/// <summary>
/// Loại nội dung tin nhắn WeChat Work
/// </summary>
/// <remarks>
/// Khai báo tường minh hình thái dữ liệu của kênh, thay cho mức độ ưu tiên ngầm định trong cách triển khai cũ là "dò từng trường một",
/// Nhờ đó phía sản xuất (producer) cũng có thể thể hiện rõ ràng ý định của mình.
/// </remarks>
public enum WeChatWorkMessageKind
{
    /// <summary>
    /// Chưa chỉ định, kênh sẽ suy ra theo loại nội dung
    /// </summary>
    None = 0,
    /// <summary>
    /// Tin nhắn thông báo mini-program
    /// </summary>
    MiniProgramNotice = 1,
    /// <summary>
    /// Tin nhắn hình ảnh - văn bản (mpnews)
    /// </summary>
    MpNews = 2,
    /// <summary>
    /// Tin nhắn thẻ mẫu
    /// </summary>
    TemplateCard = 3,
    /// <summary>
    /// Tin nhắn thẻ văn bản
    /// </summary>
    TextCard = 4,
    /// <summary>
    /// Tin nhắn video
    /// </summary>
    Video = 5,
    /// <summary>
    /// Tin nhắn thoại
    /// </summary>
    Voice = 6,
    /// <summary>
    /// Tin nhắn tệp
    /// </summary>
    File = 7,
    /// <summary>
    /// Tin nhắn văn bản
    /// </summary>
    Text = 8,
    /// <summary>
    /// Tin nhắn markdown
    /// </summary>
    Markdown = 9
}
