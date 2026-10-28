namespace LINGYUN.Abp.PushPlus.User;

public enum PushPlusUserSendLimit
{
    /// <summary>
    /// Chưa bị giới hạn
    /// </summary>
    None = 1,
    /// <summary>
    /// Giới hạn ngắn hạn
    /// </summary>
    Short = 2,
    /// <summary>
    /// Giới hạn vĩnh viễn
    /// </summary>
    Permanent = 3,
}
