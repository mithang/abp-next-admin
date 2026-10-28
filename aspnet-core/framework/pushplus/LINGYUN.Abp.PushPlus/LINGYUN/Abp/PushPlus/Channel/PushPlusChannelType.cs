namespace LINGYUN.Abp.PushPlus.Channel;
/// <summary>
/// Enum kênh gửi (channel)
/// </summary>
public enum PushPlusChannelType
{
    /// <summary>
    /// Tài khoản công khai WeChat
    /// </summary>
    WeChat = 0,
    /// <summary>
    /// Webhook của bên thứ ba
    /// </summary>
    Webhook = 1,
    /// <summary>
    /// Ứng dụng WeChat Work
    /// </summary>
    WeWork = 2,
    /// <summary>
    /// Email
    /// </summary>
    Email = 3,
    /// <summary>
    /// SMS
    /// </summary>
    Sms = 4
}
