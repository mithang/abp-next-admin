namespace LINGYUN.Abp.PushPlus.User;

public enum PushPlusUserEmailStatus
{
    /// <summary>
    /// Chưa xác thực
    /// </summary>
    None = 0,
    /// <summary>
    /// Đang chờ xác thực
    /// </summary>
    UnConfirmed = 1,
    /// <summary>
    /// Đã xác minh
    /// </summary>
    Confirmed = 2,
}
