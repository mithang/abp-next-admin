using System;
using System.Threading;
using System.Threading.Tasks;

namespace LINGYUN.Abp.BackgroundTasks;
/// <summary>
/// Giao diện kiểm tra trạng thái công việc
/// </summary>
public interface IJobStateChecker
{
    /// <summary>
    /// Dọn dẹp công việc đã hết hạn
    /// </summary>
    /// <param name="tenantId">Định danh bên thuê</param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task CleanExpiredJobAsync(
        Guid? tenantId = null,
        CancellationToken cancellationToken = default);
    /// <summary>
    /// Kiểm tra công việc đang chạy
    /// </summary>
    /// <param name="tenantId">Định danh bên thuê</param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task CheckRuningJobAsync(
        Guid? tenantId = null,
        CancellationToken cancellationToken = default);
}
