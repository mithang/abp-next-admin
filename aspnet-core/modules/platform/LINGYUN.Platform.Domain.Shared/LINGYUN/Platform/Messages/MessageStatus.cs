namespace LINGYUN.Platform.Messages;
public enum MessageStatus
{
    /// <summary>
    /// Chưa gửi
    /// </summary>
    Pending = -1,
    /// <summary>
    /// Đã gửi
    /// </summary>
    Sent = 0,
    /// <summary>
    /// Gửi thất bại
    /// </summary>
    Failed = 10
}
