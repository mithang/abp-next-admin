using Hangfire;
using JetBrains.Annotations;
using LINGYUN.Abp.BackgroundJobs.Hangfire;
using System.Threading.Tasks;

namespace Volo.Abp.BackgroundJobs;

public static class IBackgroundJobManagerExtensions
{
    /// <summary>
    /// Công việc nền vào hàng đợi định kỳ
    /// </summary>
    /// <typeparam name="TArgs">Kiểu tham số công việc</typeparam>
    /// <param name="backgroundJobManager">Trình quản lý công việc nền</param>
    /// <param name="cron">Biểu thức Cron</param>
    /// <param name="args">Tham số công việc</param>
    /// <returns></returns>
    public static Task EnqueueAsync<TArgs>(
        this IBackgroundJobManager backgroundJobManager,
        [NotNull] string cron,
        TArgs args
    )
    {
        Check.NotNullOrWhiteSpace(cron, nameof(cron));
        Check.NotNull(args, nameof(args));

        var jobName = BackgroundJobNameAttribute.GetName<TArgs>();

        RecurringJob.AddOrUpdate<HangfireJobExecutionAdapter<TArgs>>(jobName, adapter => adapter.ExecuteAsync(args), cron);

        return Task.CompletedTask;
    }
}
