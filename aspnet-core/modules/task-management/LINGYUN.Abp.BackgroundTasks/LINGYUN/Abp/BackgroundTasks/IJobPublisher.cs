using System.Threading;
using System.Threading.Tasks;

namespace LINGYUN.Abp.BackgroundTasks;
/// <summary>
/// Giao diện phát hành tác vụ
/// </summary>
/// <remarks>
/// Kịch bản sử dụng: phát hành tác vụ tới bộ lập lịch tác vụ (phát hành tác vụ tới nút đang chạy hiện tại)
/// </remarks>
public interface IJobPublisher
{
    Task<bool> PublishAsync(JobInfo job, CancellationToken cancellationToken = default);
}
