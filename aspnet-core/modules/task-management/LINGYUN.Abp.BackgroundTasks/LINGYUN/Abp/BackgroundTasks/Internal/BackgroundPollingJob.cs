using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using System;
using System.Linq;
using System.Threading.Tasks;
using Volo.Abp.Auditing;
using Volo.Abp.MultiTenancy;

namespace LINGYUN.Abp.BackgroundTasks.Internal;

[DisableAuditing]
[DisableJobAction]
public class BackgroundPollingJob : IJobRunnable
{
    public async virtual Task ExecuteAsync(JobRunnableContext context)
    {
        var options = context.ServiceProvider.GetRequiredService<IOptions<AbpBackgroundTasksOptions>>().Value;
        var store = context.ServiceProvider.GetRequiredService<IJobStore>();
        var currentTenant = context.ServiceProvider.GetRequiredService<ICurrentTenant>();

        context.TryGetMultiTenantId(out var tenantId);

        using (currentTenant.Change(tenantId))
        {
            var waitingJobs = await store.GetWaitingListAsync(
                options.MaxJobFetchCount, context.CancellationToken);

            if (!waitingJobs.Any())
            {
                return;
            }

            /* changes: 2023-04-06
             * Giao diện thăm dò tác vụ sẽ thăm dò tác vụ của mọi node
             * Thiết kế trước đây là phát hành tới bộ lập lịch tác vụ thông qua IJobPublisher
             * Còn tác vụ đang chạy mà không phải tác vụ của node hiện tại sẽ bị bỏ qua, khiến tác vụ thực tế không bao giờ được thực thi
             * 
             * Cách cải tiến là tạo mới một giao diện IJobDispatcher, các tác vụ không thuộc node hiện tại được thăm dò sẽ được lập lịch qua nó
             * Còn bên triển khai là bộ lập lịch tác vụ sự kiện phân tán, chỉ node đích mới nhận tác vụ và khởi động
             * 
             */

            // Phát hành tác vụ của node hiện tại
            var scheduleJobs = waitingJobs.Where(job => string.Equals(job.NodeName, options.NodeName) || job.NodeName.IsNullOrWhiteSpace());
            var jobPublisher = context.ServiceProvider.GetRequiredService<IJobPublisher>();
            foreach (var job in scheduleJobs)
            {
                await jobPublisher.PublishAsync(job, context.CancellationToken);
            }

            // Lập lịch tác vụ không thuộc node hiện tại
            var dispatchJobs = waitingJobs.Where(job => !job.NodeName.IsNullOrWhiteSpace() && !string.Equals(job.NodeName, options.NodeName));
            if (dispatchJobs.Any())
            {
                var jobDispatcher = context.ServiceProvider.GetRequiredService<IJobDispatcher>();
                foreach (var jobByGroup in dispatchJobs.GroupBy(job => job.NodeName))
                {
                    await jobDispatcher.DispatchAsync(
                        jobByGroup,
                        jobByGroup.Key,
                        tenantId);
                }
            }
        }
    }
}
