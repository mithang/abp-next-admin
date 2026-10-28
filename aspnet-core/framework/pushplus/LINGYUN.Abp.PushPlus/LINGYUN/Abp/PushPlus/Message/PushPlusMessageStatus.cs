namespace LINGYUN.Abp.PushPlus.Message;

public enum PushPlusMessageStatus
{
    /// <summary>
    /// Chưa gửi
    /// </summary>
    NotSend = 0,
    /// <summary>
    /// Đang gửi
    /// </summary>
    Sending = 1,
    /// <summary>
    /// Đã gửi
    /// </summary>
    Successed = 2,
    /// <summary>
    /// Gửi thất bại
    /// </summary>
    Failed = 3,
}
