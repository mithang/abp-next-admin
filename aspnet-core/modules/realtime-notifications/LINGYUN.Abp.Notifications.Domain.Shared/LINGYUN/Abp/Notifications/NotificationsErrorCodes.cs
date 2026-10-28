namespace LINGYUN.Abp.Notifications;

/// <summary>
/// Thiết kế mã lỗi hệ thống tin nhắn
/// Mã trạng thái gồm hai phần: 2 ký tự đầu là lĩnh vực, 3 ký tự sau là trạng thái  
/// <br />
/// Phần lĩnh vực:
/// <list type="table">
///     <item>000-019  Đầu vào</item>
///     <item>020-029  Nhóm</item>
///     <item>030-039  Người dùng</item>
///     <item>040-049  Ứng dụng</item>
///     <item>050-059  Nội bộ</item>
///     <item>100-199  Đầu ra</item>
/// </list>
/// 
/// Phần trạng thái:
/// <list type="table">
///     <item>200-299 Thành công</item>
///     <item>300-399 Thành công nhưng có thao tác tiếp theo</item>
///     <item>400-499 Ngoại lệ nghiệp vụ</item>
///     <item>500-599 Ngoại lệ nội bộ</item>
///     <item>900-999 Ngoại lệ đầu vào/đầu ra</item>
/// </list>
/// 
/// </summary>
public class NotificationsErrorCodes
{
    public const string Namespace = "Notifications";
    /// <summary>
    /// Mẫu thông báo không tồn tại!
    /// </summary>
    public const string NotificationTemplateNotFound = Namespace + ":001404";

    public static class GroupDefinition
    {
        private const string Prefix = Namespace + ":002";

        public const string StaticGroupNotAllowedChanged = Prefix + "400";

        public const string AlreayNameExists = Prefix + "403";

        public const string NameNotFount = Prefix + "404";
    }

    public static class Definition
    {
        private const string Prefix = Namespace + ":003";

        public const string StaticFeatureNotAllowedChanged = Prefix + "400";

        public const string FailedGetGroup = Prefix + "401";

        public const string AlreayNameExists = Prefix + "403";

        public const string NameNotFount = Prefix + "404";
    }
}
