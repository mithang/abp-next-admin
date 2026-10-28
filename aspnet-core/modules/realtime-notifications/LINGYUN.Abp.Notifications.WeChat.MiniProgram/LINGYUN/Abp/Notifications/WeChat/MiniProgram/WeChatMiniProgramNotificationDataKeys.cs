using System;

namespace LINGYUN.Abp.Notifications.WeChat.MiniProgram;

/// <summary>
/// Khóa dữ liệu thông báo của Mini Program WeChat
/// </summary>
/// <remarks>
/// <para>
/// Tên khóa thống nhất mang tiền tố của kênh này (<see cref="Prefix"/>), nhất quán với các kênh khác,
/// tránh xung đột giữa các khóa của các kênh khác nhau trong cùng một gói thuộc tính dữ liệu thông báo。
/// </para>
/// <para>
/// Quá trình đọc không phân biệt chữ hoa chữ thường (ưu tiên khớp chính xác), vì vậy bên sản xuất dùng chữ hoa/thường tùy ý đều khớp được。
/// </para>
/// </remarks>
public static class WeChatMiniProgramNotificationDataKeys
{
    /// <summary>
    /// Tiền tố khóa dữ liệu của kênh này
    /// </summary>
    public const string Prefix = "wx-mp:";

    /// <summary>
    /// Định danh mẫu Mini Program (khóa định danh tải trọng)
    /// </summary>
    public const string TemplateId = Prefix + "template_id";

    /// <summary>
    /// Trang Mini Program sẽ chuyển đến khi nhấn
    /// </summary>
    public const string RedirectPage = Prefix + "redirect_page";

    /// <summary>
    /// Loại Mini Program sẽ chuyển đến
    /// </summary>
    public const string WeAppState = Prefix + "weapp_state";

    /// <summary>
    /// Ngôn ngữ Mini Program
    /// </summary>
    public const string WeAppLanguage = Prefix + "weapp_language";

    /// <summary>
    /// Khóa cũ không có tiền tố còn tồn tại vì lý do lịch sử
    /// </summary>
    /// <remarks>
    /// <para>
    /// Các phiên bản trước dùng khóa không có tiền tố, bên sản xuất đã cài đặt có thể vẫn đang ghi, vì vậy giữ lại để **tương thích chỉ đọc**。
    /// </para>
    /// <para>
    /// <b>Đã lỗi thời</b>: mã mới hãy dùng hằng số có tiền tố (<see cref="TemplateId"/> v.v.).
    /// Điểm đọc duy nhất được phép là cơ chế dự phòng lịch sử phía kênh
    /// (<c>WeChatMiniProgramNotificationPublishProvider.ApplyLegacyKeys</c>),
    /// Khi khớp khóa cũ, nó sẽ ghi cảnh báo để thúc đẩy bên sản xuất di chuyển。
    /// </para>
    /// </remarks>
    [Obsolete("The legacy non-prefixed keys are deprecated. Use the prefixed constants instead, for example WeChatMiniProgramNotificationDataKeys.TemplateId. They are kept for read-only fallback to remain compatible with already deployed producers.")]
    public static class Legacy
    {
#pragma warning disable CS0618 // Type or member is obsolete: the nested class references its own members

        /// <summary>
        /// Lịch sử: định danh mẫu Mini Program
        /// </summary>
        [Obsolete("The legacy non-prefixed key is deprecated. Use WeChatMiniProgramNotificationDataKeys.TemplateId instead.")]
        public const string TemplateId = "TemplateId";

        /// <summary>
        /// Lịch sử: trang Mini Program sẽ chuyển đến khi nhấn
        /// </summary>
        [Obsolete("The legacy non-prefixed key is deprecated. Use WeChatMiniProgramNotificationDataKeys.RedirectPage instead.")]
        public const string RedirectPage = "RedirectPage";

        /// <summary>
        /// Lịch sử: loại Mini Program sẽ chuyển đến
        /// </summary>
        [Obsolete("The legacy non-prefixed key is deprecated. Use WeChatMiniProgramNotificationDataKeys.WeAppState instead.")]
        public const string WeAppState = "WeAppState";

        /// <summary>
        /// Lịch sử: ngôn ngữ Mini Program
        /// </summary>
        [Obsolete("The legacy non-prefixed key is deprecated. Use WeChatMiniProgramNotificationDataKeys.WeAppLanguage instead.")]
        public const string WeAppLanguage = "WeAppLanguage";

        /// <summary>
        /// Tất cả các khóa lịch sử
        /// </summary>
        public static readonly string[] All =
        {
            TemplateId,
            RedirectPage,
            WeAppState,
            WeAppLanguage
        };

#pragma warning restore CS0618
    }
}
