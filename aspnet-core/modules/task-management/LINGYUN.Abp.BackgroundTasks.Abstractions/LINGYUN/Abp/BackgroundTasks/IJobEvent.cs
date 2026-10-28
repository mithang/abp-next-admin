using System.Threading.Tasks;

namespace LINGYUN.Abp.BackgroundTasks;

/// <summary>
/// Giao diện sự kiện tác vụ được gắn
/// </summary>
public interface IJobEvent
{
    /// <summary>
    /// Sự kiện trước khi tác vụ khởi động
    /// </summary>
    /// <param name="jobEventData"></param>
    /// <returns></returns>
    Task OnJobBeforeExecuted(JobEventContext context);
    /// <summary>
    /// Sự kiện sau khi tác vụ hoàn thành
    /// </summary>
    /// <param name="jobEventData"></param>
    /// <returns></returns>
    Task OnJobAfterExecuted(JobEventContext context);
}
