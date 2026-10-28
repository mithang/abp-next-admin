using LINGYUN.Abp.Notifications;

namespace LINGYUN.Abp.Notifications.WeChat.MiniProgram;

/// <summary>
/// Dữ liệu kênh Mini Program WeChat (payload)
/// </summary>
/// <remarks>
/// <para>
/// Payload của thông báo đăng ký Mini Program có dạng "quảng bá": ngoài định danh mẫu và tham số chuyển hướng,
/// dữ liệu mẫu (<c>data</c>) lấy trực tiếp từ gói thuộc tính của dữ liệu thông báo, vì vậy ở đây chỉ khai báo
/// các trường vô hướng cần đọc theo kiểu.
/// </para>
/// <para>
/// Tên khóa mang tiền tố của kênh này (<see cref="WeChatMiniProgramNotificationDataKeys.Prefix"/>),
/// việc đọc không phân biệt chữ hoa/thường; tính tồn tại được suy ra từ khóa định danh mẫu, vì vậy khai báo tham số chuyển hướng là
/// "chỉ đọc, không tham gia khớp" —— nhà sản xuất có thể chỉ ghi định danh mẫu.
/// </para>
/// <para>
/// Các khóa cũ không có tiền tố được kênh đọc dự phòng khi phân tích (xem
/// <c>WeChatMiniProgramNotificationPublishProvider.ResolveChannelData</c>)。
/// </para>
/// </remarks>
[NotificationChannelData(WeChatMiniProgramNotificationPublishProvider.ProviderName, Priority = 100)]
public class WeChatMiniProgramSubscribeChannelData : NotificationChannelData
{
    /// <summary>
    /// Định danh mẫu của Mini Program (khóa định danh payload)
    /// </summary>
    [NotificationChannelProperty(WeChatMiniProgramNotificationDataKeys.TemplateId)]
    public virtual string? TemplateId { get; set; }

    /// <summary>
    /// Trang Mini Program chuyển đến khi nhấn
    /// </summary>
    [NotificationChannelProperty(WeChatMiniProgramNotificationDataKeys.RedirectPage, IgnoreWhenMatching = true)]
    public virtual string? RedirectPage { get; set; }

    /// <summary>
    /// Loại Mini Program chuyển đến
    /// </summary>
    [NotificationChannelProperty(WeChatMiniProgramNotificationDataKeys.WeAppState, IgnoreWhenMatching = true)]
    public virtual string? WeAppState { get; set; }

    /// <summary>
    /// Ngôn ngữ của Mini Program
    /// </summary>
    [NotificationChannelProperty(WeChatMiniProgramNotificationDataKeys.WeAppLanguage, IgnoreWhenMatching = true)]
    public virtual string? WeAppLanguage { get; set; }
}
