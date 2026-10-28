using System;
using Volo.Abp;

namespace LINGYUN.Abp.Notifications.WeChat.Work;

/// <summary>
/// Tùy chọn chung của tin nhắn WeChat doanh nghiệp
/// </summary>
public class WeChatWorkMessageOptions
{
    /// <summary>
    /// Định danh ứng dụng tin nhắn, được kênh điền khi phát hành
    /// </summary>
    public string AgentId { get; set; } = default!;

    /// <summary>
    /// Có phải là tin nhắn bảo mật hay không
    /// </summary>
    public bool? Safe { get; set; }

    /// <summary>
    /// Có bật chuyển đổi id hay không
    /// </summary>
    public bool? EnableIdTrans { get; set; }

    /// <summary>
    /// Có bật kiểm tra tin nhắn trùng lặp hay không
    /// </summary>
    public bool? EnableDuplicateCheck { get; set; }

    /// <summary>
    /// Khoảng thời gian kiểm tra tin nhắn trùng lặp (giây)
    /// </summary>
    public int? DuplicateCheckInterval { get; set; }

    /// <summary>
    /// Phân tích tùy chọn chung từ dữ liệu thông báo
    /// </summary>
    public static WeChatWorkMessageOptions From(
        INotificationChannelDataResolver resolver,
        NotificationData notificationData)
    {
        Check.NotNull(resolver, nameof(resolver));
        Check.NotNull(notificationData, nameof(notificationData));

        return new WeChatWorkMessageOptions
        {
            Safe = resolver.GetValue<bool>(notificationData, WeChatWorkNotificationDataKeys.Safe),
            EnableIdTrans = resolver.GetValue<bool>(notificationData, WeChatWorkNotificationDataKeys.EnableIdTrans),
            EnableDuplicateCheck = resolver.GetValue<bool>(notificationData, WeChatWorkNotificationDataKeys.EnableDuplicateCheck),
            DuplicateCheckInterval = resolver.GetValue<int>(notificationData, WeChatWorkNotificationDataKeys.DuplicateCheckInterval)
        };
    }

    /// <summary>
    /// Cờ đánh dấu tin nhắn bảo mật
    /// </summary>
    public byte SafeValue => Safe == true ? (byte)1 : (byte)0;

    /// <summary>
    /// Cờ đánh dấu chuyển đổi id
    /// </summary>
    public byte EnableIdTransValue => EnableIdTrans == true ? (byte)1 : (byte)0;

    /// <summary>
    /// Cờ đánh dấu kiểm tra tin nhắn trùng lặp
    /// </summary>
    public byte EnableDuplicateCheckValue => EnableDuplicateCheck == true ? (byte)1 : (byte)0;

    /// <summary>
    /// Khoảng thời gian kiểm tra tin nhắn trùng lặp, khi chưa thiết lập sẽ dùng giá trị mặc định của WeChat doanh nghiệp
    /// </summary>
    public int DuplicateCheckIntervalValue => DuplicateCheckInterval ?? 1800;
}
