using System.Threading.Tasks;
using System.Collections.Generic;
using System.Threading;

namespace LINGYUN.Abp.BackgroundTasks;
/// <summary>
/// Giao diện bộ lập lịch công việc
/// </summary>
public interface IJobScheduler
{
    /// <summary>
    /// Đưa công việc vào hàng đợi
    /// </summary>
    /// <param name="job"></param>
    /// <returns></returns>
    Task<bool> QueueAsync(JobInfo job, CancellationToken cancellationToken = default);
    /// <summary>
    /// Đưa công việc vào hàng đợi
    /// </summary>
    /// <param name="jobs"></param>
    /// <returns></returns>
    Task QueuesAsync(IEnumerable<JobInfo> jobs, CancellationToken cancellationToken = default);
    /// <summary>
    /// Công việc có tồn tại hay không
    /// </summary>
    /// <param name="group"></param>
    /// <param name="name"></param>
    /// <returns></returns>
    Task<bool> ExistsAsync(JobInfo job, CancellationToken cancellationToken = default);
    /// <summary>
    /// Kích hoạt công việc
    /// </summary>
    /// <param name="group"></param>
    /// <param name="name"></param>
    /// <returns></returns>
    Task TriggerAsync(JobInfo job, CancellationToken cancellationToken = default);
    /// <summary>
    /// Tạm dừng công việc
    /// </summary>
    /// <param name="group"></param>
    /// <param name="name"></param>
    /// <returns></returns>
    Task PauseAsync(JobInfo job, CancellationToken cancellationToken = default);
    /// <summary>
    /// Khôi phục công việc đã tạm dừng
    /// </summary>
    /// <param name="group"></param>
    /// <param name="name"></param>
    /// <returns></returns>
    Task ResumeAsync(JobInfo job, CancellationToken cancellationToken = default);
    /// <summary>
    /// Xóa công việc
    /// </summary>
    /// <param name="group"></param>
    /// <param name="name"></param>
    /// <returns></returns>
    Task<bool> RemoveAsync(JobInfo job, CancellationToken cancellationToken = default);
    /// <summary>
    /// Khởi động bộ điều phối công việc
    /// </summary>
    /// <returns></returns>
    Task<bool> StartAsync(CancellationToken cancellationToken = default);
    /// <summary>
    /// Dừng bộ điều phối công việc
    /// </summary>
    /// <returns></returns>
    Task<bool> StopAsync(CancellationToken cancellationToken = default);
    /// <summary>
    /// Giải phóng bộ điều phối công việc
    /// </summary>
    /// <returns></returns>
    Task<bool> ShutdownAsync(CancellationToken cancellationToken = default);
}
