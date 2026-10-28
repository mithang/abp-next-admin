namespace LINGYUN.Abp.Notifications;

/// <summary>
/// Mức độ nghiêm trọng
/// </summary>
public enum NotificationSeverity : sbyte
{
    /// <summary>
    /// Thành công
    /// </summary>
    Success = 0,
    /// <summary>
    /// Thông tin
    /// </summary>
    Info = 10,
    /// <summary>
    /// Cảnh báo
    /// </summary>
    Warn = 20,
    /// <summary>
    /// Lỗi
    /// </summary>
    Error = 30,
    /// <summary>
    /// Lỗi nghiêm trọng
    /// </summary>
    Fatal = 40
}
