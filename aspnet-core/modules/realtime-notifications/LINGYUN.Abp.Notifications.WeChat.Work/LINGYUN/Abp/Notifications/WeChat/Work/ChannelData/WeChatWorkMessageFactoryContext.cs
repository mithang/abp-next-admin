using LINGYUN.Abp.WeChat.Work.Messages;

namespace LINGYUN.Abp.Notifications.WeChat.Work;

/// <summary>
/// Ngữ cảnh tạo tin nhắn WeChat doanh nghiệp
/// </summary>
public class WeChatWorkMessageFactoryContext
{
    /// <summary>
    /// Tin nhắn thông báo
    /// </summary>
    public NotificationInfo Notification { get; }

    /// <summary>
    /// Dữ liệu chuẩn của thông báo (đã hoàn tất bản địa hóa và kết xuất mẫu)
    /// </summary>
    public NotificationStandardData StandardData { get; }

    /// <summary>
    /// Dữ liệu kênh (payload)
    /// </summary>
    public WeChatWorkChannelData ChannelData { get; }

    /// <summary>
    /// Người nhận tin nhắn
    /// </summary>
    public WeChatWorkNotificationContact Contact { get; }

    /// <summary>
    /// Tùy chọn chung của tin nhắn
    /// </summary>
    public WeChatWorkMessageOptions Options { get; }

    public WeChatWorkMessageFactoryContext(
        NotificationInfo notification,
        NotificationStandardData standardData,
        WeChatWorkChannelData channelData,
        WeChatWorkNotificationContact contact,
        WeChatWorkMessageOptions options)
    {
        Notification = notification;
        StandardData = standardData;
        ChannelData = channelData;
        Contact = contact;
        Options = options;
    }
}
