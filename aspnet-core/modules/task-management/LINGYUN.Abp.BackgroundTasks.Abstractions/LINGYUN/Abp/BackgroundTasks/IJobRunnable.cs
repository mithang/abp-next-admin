using System.Threading.Tasks;

namespace LINGYUN.Abp.BackgroundTasks;

/// <summary>
/// Lớp tác vụ cần triển khai giao diện này
/// </summary>
public interface IJobRunnable
{
    Task ExecuteAsync(JobRunnableContext context);
}
