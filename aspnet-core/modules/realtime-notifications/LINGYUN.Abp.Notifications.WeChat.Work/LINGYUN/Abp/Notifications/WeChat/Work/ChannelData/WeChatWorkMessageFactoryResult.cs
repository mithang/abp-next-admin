using LINGYUN.Abp.WeChat.Work.Messages;

namespace LINGYUN.Abp.Notifications.WeChat.Work;

/// <summary>
/// Kết quả xây dựng thông báo WeChat doanh nghiệp
/// </summary>
public class WeChatWorkMessageFactoryResult
{
    /// <summary>
    /// Vật chứa thông báo
    /// </summary>
    public WeChatWorkMessage Message { get; }

    /// <summary>
    /// Kiểu vật chứa thông báo, dùng cho ghi log và khắc phục sự cố
    /// </summary>
    public WeChatWorkMessageKind Kind { get; }

    public WeChatWorkMessageFactoryResult(WeChatWorkMessage message, WeChatWorkMessageKind kind)
    {
        Message = message;
        Kind = kind;
    }

    public static WeChatWorkMessageFactoryResult Create(WeChatWorkMessage message, WeChatWorkMessageKind kind)
    {
        return new WeChatWorkMessageFactoryResult(message, kind);
    }
}
