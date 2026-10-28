namespace LINGYUN.Abp.PushPlus.Setting;
/// <summary>
/// Giới hạn gửi;
/// 0-Không giới hạn,
/// 1-Cấm gửi qua mọi kênh,
/// 2-Hạn chế kênh WeChat,
/// 3-Hạn chế kênh email
/// </summary>
public enum PushPlusChannelSendLimit
{
    /// <summary>
    /// Không giới hạn
    /// </summary>
    None = 0,
    /// <summary>
    /// Cấm gửi qua mọi kênh
    /// </summary>
    ForbidAllChannel = 1,
    /// <summary>
    /// Hạn chế kênh WeChat
    /// </summary>
    ForbidWeChatChannel = 2,
    /// <summary>
    /// Hạn chế kênh email
    /// </summary>
    ForbidEmailChannel = 3,
}
