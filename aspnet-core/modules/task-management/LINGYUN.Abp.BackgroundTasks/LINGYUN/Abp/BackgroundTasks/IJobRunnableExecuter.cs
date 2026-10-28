using System.Threading.Tasks;

namespace LINGYUN.Abp.BackgroundTasks;

/// <summary>
/// Định nghĩa giao diện bộ thực thi tác vụ
/// Có thể triển khai một số giới hạn thông qua nó (ví dụ: khóa phân tán)
/// </summary>
public interface IJobRunnableExecuter
{
    Task ExecuteAsync(JobRunnableContext context);
}
