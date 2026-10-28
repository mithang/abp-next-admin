using System.Threading.Tasks;

namespace LINGYUN.Abp.BackgroundTasks.Activities;
/// <summary>
/// Bộ lọc hành vi công việc
/// </summary>
public interface IJobActionFilter
{
    /// <summary>
    /// Có cho phép thao tác sau khi kích hoạt hay không
    /// </summary>
    /// <param name="context"></param>
    /// <returns></returns>
    Task<bool> CanAfterExecuted(JobEventContext context);
    /// <summary>
    /// Có cho phép thao tác trước khi kích hoạt hay không
    /// </summary>
    /// <param name="context"></param>
    /// <returns></returns>
    Task<bool> CanBeforeExecuted(JobEventContext context);
}
