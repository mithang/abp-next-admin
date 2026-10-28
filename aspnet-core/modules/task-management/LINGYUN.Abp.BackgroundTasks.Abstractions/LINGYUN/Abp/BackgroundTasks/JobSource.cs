namespace LINGYUN.Abp.BackgroundTasks;
/// <summary>
/// Nguồn gốc job
/// </summary>
public enum JobSource
{
    /// <summary>
    /// Chưa xác định
    /// </summary>
    None = -1,
    /// <summary>
    /// Người dùng
    /// </summary>
    User = 0,
    /// <summary>
    /// Tích hợp sẵn trong hệ thống
    /// </summary>
    System = 10,
}
