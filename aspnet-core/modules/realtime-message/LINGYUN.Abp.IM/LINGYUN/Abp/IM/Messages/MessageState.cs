namespace LINGYUN.Abp.IM.Messages;

/// <summary>
/// Trạng thái tin nhắn
/// </summary>
public enum MessageState : sbyte
{
    /// <summary>
    /// Đã gửi
    /// </summary>
    Send = 0,
    /// <summary>
    /// Đã đọc
    /// </summary>
    Read = 1,
    /// <summary>
    /// Thu hồi
    /// </summary>
    ReCall = 10,
    /// <summary>
    /// Gửi thất bại
    /// </summary>
    Failed = 50,
    /// <summary>
    /// Trả lại
    /// </summary>
    BackTo = 100
}
