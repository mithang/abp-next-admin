using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace LINGYUN.Abp.BackgroundTasks;
/// <summary>
/// Giao diện điều phối tác vụ
/// </summary>
/// <remarks>
/// Kịch bản sử dụng: Điều phối tác vụ tới bộ điều phối tác vụ (điều phối tới tác vụ của nút chạy được chỉ định)
/// </remarks>
public interface IJobDispatcher
{
    /// <summary>
    /// Điều phối một tác vụ
    /// </summary>
    /// <param name="job">Chi tiết tác vụ</param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<bool> DispatchAsync(JobInfo job, CancellationToken cancellationToken = default);
    /// <summary>
    /// Điều phối nhiều tác vụ
    /// </summary>
    /// <param name="jobs">Danh sách tác vụ</param>
    /// <param name="nodeName">Nút chạy</param>
    /// <param name="tenantId">Định danh thuê bao</param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<bool> DispatchAsync(
        IEnumerable<JobInfo> jobs,
        string? nodeName = null,
        Guid? tenantId = null,
        CancellationToken cancellationToken = default);
    /// <summary>
    /// Thông báo dọn dẹp các tác vụ đã hết hạn
    /// </summary>
    /// <remarks>
    /// Thông báo cho các nút dọn dẹp các tác vụ đã hết hạn trong nút hiện tại
    /// </remarks>
    /// <param name="tenantId">Định danh thuê bao</param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task CleanExpiredJobAsync(
        Guid? tenantId = null,
        CancellationToken cancellationToken = default);
    /// <summary>
    /// Kiểm tra các tác vụ đang chạy
    /// </summary>
    /// <remarks>
    /// Thông báo cho các nút kiểm tra các tác vụ đang chạy trong nút hiện tại
    /// </remarks>
    /// <param name="tenantId">Định danh thuê bao</param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task CheckRuningJobAsync(
        Guid? tenantId = null,
        CancellationToken cancellationToken = default);
}
