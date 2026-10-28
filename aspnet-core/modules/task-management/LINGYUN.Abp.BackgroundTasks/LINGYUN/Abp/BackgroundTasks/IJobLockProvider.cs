using System.Threading.Tasks;

namespace LINGYUN.Abp.BackgroundTasks;

/// <summary>
/// Nhà cung cấp khóa công việc
/// </summary>
public interface IJobLockProvider
{
    Task<bool> TryLockAsync(
        string jobKey,
        int lockSeconds);

    Task<bool> TryReleaseAsync(
        string jobKey);
}
