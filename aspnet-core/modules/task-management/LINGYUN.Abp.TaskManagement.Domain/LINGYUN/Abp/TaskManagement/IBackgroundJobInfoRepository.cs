using LINGYUN.Abp.BackgroundTasks;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Specifications;

namespace LINGYUN.Abp.TaskManagement;

public interface IBackgroundJobInfoRepository : IRepository<BackgroundJobInfo, string>
{
    Task<bool> CheckNameAsync(
        string group,
        string name,
        CancellationToken cancellationToken = default);
    /// <summary>
    /// Lấy tác vụ
    /// </summary>
    /// <param name="id"></param>
    /// <param name="includeDetails"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<JobInfo?> FindJobAsync(
        string id,
        bool includeDetails = true,
        CancellationToken cancellationToken = default);
    /// <summary>
    /// Lấy danh sách tác vụ đã hết hạn
    /// </summary>
    /// <param name="maxResultCount"></param>
    /// <param name="jobExpiratime"></param>
    /// <param name="nodeName"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<List<BackgroundJobInfo>> GetExpiredJobsAsync(
        int maxResultCount,
        TimeSpan jobExpiratime,
        string? nodeName = null,
        CancellationToken cancellationToken = default);
    /// <summary>
    /// Lấy tất cả tác vụ định kỳ
    /// Các tác vụ đã chỉ định biểu thức Cron cần được giao cho công cụ tác vụ dưới dạng tác vụ liên tục
    /// </summary>
    /// <returns></returns>
    Task<List<BackgroundJobInfo>> GetAllPeriodTasksAsync(
        CancellationToken cancellationToken = default);
    /// <summary>
    /// Lấy danh sách tác vụ đang chờ vào hàng đợi
    /// </summary>
    /// <param name="maxResultCount"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<List<BackgroundJobInfo>> GetWaitingListAsync(
        int maxResultCount,
        CancellationToken cancellationToken = default);
    /// <summary>
    /// Lấy số lượng tác vụ sau khi lọc
    /// </summary>
    /// <param name="specification">Quy tắc truy vấn</param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<int> GetCountAsync(
        ISpecification<BackgroundJobInfo> specification,
        CancellationToken cancellationToken = default);
    /// <summary>
    /// Lấy danh sách tác vụ sau khi lọc
    /// </summary>
    /// <param name="specification">Quy tắc truy vấn</param>
    /// <param name="sorting"></param>
    /// <param name="maxResultCount"></param>
    /// <param name="skipCount"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<List<BackgroundJobInfo>> GetListAsync(
        ISpecification<BackgroundJobInfo> specification,
        string? sorting = $"{nameof(BackgroundJobInfo.CreationTime)} DESC",
        int maxResultCount = 10,
        int skipCount = 0,
        CancellationToken cancellationToken = default);
}
