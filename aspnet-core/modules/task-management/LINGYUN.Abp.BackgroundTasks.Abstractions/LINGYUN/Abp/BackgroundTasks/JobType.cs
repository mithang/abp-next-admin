namespace LINGYUN.Abp.BackgroundTasks;
/// <summary>
/// Loại tác vụ
/// </summary>
public enum JobType
{
    /// <summary>
    /// Một lần
    /// </summary>
    Once,
    /// <summary>
    /// Định kỳ
    /// </summary>
    Period,
    /// <summary>
    /// Liên tục
    /// </summary>
    Persistent
}
