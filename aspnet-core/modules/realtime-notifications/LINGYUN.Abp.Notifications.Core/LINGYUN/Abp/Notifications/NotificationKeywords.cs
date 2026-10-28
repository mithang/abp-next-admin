namespace LINGYUN.Abp.Notifications;
/// <summary>
/// Từ khóa của lớp thông báo, không tự ý chiếm dụng
/// </summary>
public static class NotificationKeywords
{
    /// <summary>
    /// Mã định danh thông báo, mã định danh duy nhất toàn cục, trường kiểu long
    /// </summary>
    public const string Id = "notificationId";
    /// <summary>
    /// Tên thông báo
    /// </summary>
    public const string Name = "notification";
    /// <summary>
    /// Mã định danh người dùng nguồn
    /// </summary>
    public const string FormUser = "formUser";
    /// <summary>
    /// Mã định danh người dùng đích
    /// </summary>
    public const string ToUser = "toUser";
    /// <summary>
    /// Tiêu đề thông báo
    /// </summary>
    public const string Title = "title";
    /// <summary>
    /// Thời gian tạo
    /// </summary>
    public const string CreationTime = "creationTime";
}
