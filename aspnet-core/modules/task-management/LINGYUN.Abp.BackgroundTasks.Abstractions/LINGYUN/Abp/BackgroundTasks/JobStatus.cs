namespace LINGYUN.Abp.BackgroundTasks;

public enum JobStatus
{
    /// <summary>
    /// Không xác định
    /// </summary>
    None = -1,
    /// <summary>
    /// Đã hoàn thành
    /// </summary>
    Completed = 0,
    /// <summary>
    /// Đang xếp hàng
    /// </summary>
    Queuing = 5,
    /// <summary>
    /// Đang chạy
    /// </summary>
    Running = 10,
    /// <summary>
    /// Thất bại, đang thử lại
    /// </summary>
    FailedRetry = 15,
    /// <summary>
    /// Đã tạm dừng
    /// </summary>
    Paused = 20,
    /// <summary>
    /// Đã dừng
    /// </summary>
    Stopped = 30
}
