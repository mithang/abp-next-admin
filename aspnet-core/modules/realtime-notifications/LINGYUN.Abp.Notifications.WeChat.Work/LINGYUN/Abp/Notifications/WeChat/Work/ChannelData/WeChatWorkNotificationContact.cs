using System;

namespace LINGYUN.Abp.Notifications.WeChat.Work;

/// <summary>
/// Người nhận tin nhắn WeChat doanh nghiệp
/// </summary>
/// <remarks>
/// WeChat doanh nghiệp yêu cầu touser / toparty / totag không được đồng thời để trống,
/// Do đó, người nhận phải được truyền nguyên vẹn tới quá trình tạo tin nhắn.
/// </remarks>
public class WeChatWorkNotificationContact
{
    /// <summary>
    /// Danh sách ID thành viên, nhiều người nhận dùng "|" để phân tách
    /// </summary>
    public string? ToUser { get; set; }

    /// <summary>
    /// Danh sách ID phòng ban, nhiều người nhận dùng "|" để phân tách
    /// </summary>
    public string? ToParty { get; set; }

    /// <summary>
    /// Danh sách ID thẻ, nhiều người nhận dùng "|" để phân tách
    /// </summary>
    public string? ToTag { get; set; }

    public bool IsEmpty()
    {
        return ToUser.IsNullOrWhiteSpace()
            && ToParty.IsNullOrWhiteSpace()
            && ToTag.IsNullOrWhiteSpace();
    }

    public static WeChatWorkNotificationContact From(
        string? toUser = null,
        string? toParty = null,
        string? toTag = null)
    {
        return new WeChatWorkNotificationContact
        {
            ToUser = toUser,
            ToParty = toParty,
            ToTag = toTag
        };
    }
}
