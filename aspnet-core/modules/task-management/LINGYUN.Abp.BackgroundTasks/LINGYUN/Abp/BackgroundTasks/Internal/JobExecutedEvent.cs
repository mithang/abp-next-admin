using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System;
using System.Threading;
using System.Threading.Tasks;
using Volo.Abp.DependencyInjection;

namespace LINGYUN.Abp.BackgroundTasks.Internal;

public class JobExecutedEvent : JobEventBase<JobExecutedEvent>, ITransientDependency
{
    protected override Task<bool> CanAfterExecuted(JobEventContext context)
    {
        if (context.EventData.Type.IsDefined(typeof(DisableJobStatusAttribute), true))
        {
            Logger.LogDebug("The job change event could not be processed because the job marked the DisableJobStatus attribute!");
            return Task.FromResult(false);
        }
        return base.CanAfterExecuted(context);
    }

    protected override async Task OnJobAfterExecutedAsync(JobEventContext context)
    {
        var store = context.ServiceProvider.GetRequiredService<IJobStore>();
        var job = await store.FindAsync(context.EventData.Key, context.EventData.CancellationToken);
        if (job == null)
        {
            Logger.LogWarning("Cannot process job change event because job with key {Id} could not be found!", context.EventData.Key);
            return;
        }

        job.TriggerCount += 1;
        job.TenantId = context.EventData.TenantId;
        job.LastRunTime = context.EventData.RunTime;
        job.NextRunTime = context.EventData.NextRunTime;
        job.Result = context.EventData.Result ?? "OK";
        job.Status = JobStatus.Running;

        // Sau khi job gặp ngoại lệ thì có thể thử lại
        if (context.EventData.Exception != null)
        {
            job.TryCount += 1;
            job.IsAbandoned = false;
            job.Result = GetExceptionMessage(context.EventData.Exception);

            // Job định kỳ không cần thay đổi chính sách thử lại
            if (job.JobType != JobType.Period)
            {
                // Đánh dấu job là đang chạy, job sẽ được vòng lặp thăm dò đưa trở lại hàng đợi
                job.Status = JobStatus.FailedRetry;
                // Sau nhiều lần gặp ngoại lệ cần tính lại mức ưu tiên
                if (job.TryCount <= (job.MaxTryCount / 2) &&
                    job.TryCount > (job.MaxTryCount / 3))
                {
                    job.Priority = JobPriority.BelowNormal;
                }
                else if (job.TryCount > (job.MaxTryCount / 1.5))
                {
                    job.Priority = JobPriority.Low;
                }

                // Điều chỉnh thời gian chờ
                if (job.Interval <= 0)
                {
                    job.Interval = 50;
                }

                var retryInterval = job.Interval * 1.5;
                job.Interval = Convert.ToInt32(retryInterval);
            }

            // Khi chưa đặt số lần thử lại tối đa thì sẽ không đánh dấu dừng
            if (job.MaxTryCount > 0 && job.TryCount >= job.MaxTryCount)
            {
                job.Status = JobStatus.Stopped;
                job.IsAbandoned = true;
                job.NextRunTime = null;
                await RemoveJobQueueAsync(context, job, context.EventData.CancellationToken);
            }
            else
            {
                // Job định kỳ đã có trong hàng đợi, cần bỏ qua
                if (job.JobType != JobType.Period)
                {
                    // Job thất bại cần được node hiện tại lập lịch
                    await ScheduleJobAsync(context, job, context.EventData.CancellationToken);
                }
            }
        }
        else
        {
            // Thành công một lần thì đặt lại số lần thử lại
            job.TryCount = 0;
            var jobCompleted = false;

            // Số lần thử đạt giới hạn thì đánh dấu đã hoàn thành
            if (job.Status == JobStatus.FailedRetry &&
                job.TryCount >= job.MaxTryCount)
            {
                jobCompleted = true;
            }

            // Tất cả các job đạt giới hạn thì đánh dấu đã hoàn thành
            if (job.MaxCount > 0 && job.TriggerCount >= job.MaxCount)
            {
                jobCompleted = true;
            }

            // Job dùng một lần sau khi thực thi một lần thì đánh dấu đã hoàn thành
            if (job.JobType == JobType.Once)
            {
                jobCompleted = true;
            }

            if (jobCompleted)
            {
                job.Status = JobStatus.Completed;
                job.NextRunTime = null;

                await RemoveJobQueueAsync(context, job, context.EventData.CancellationToken);
            }
        }

        await store.StoreAsync(job, context.EventData.CancellationToken);
    }

    private async Task RemoveJobQueueAsync(JobEventContext context, JobInfo jobInfo, CancellationToken cancellationToken = default)
    {
        var jobScheduler = context.ServiceProvider.GetRequiredService<IJobScheduler>();
        await jobScheduler.RemoveAsync(jobInfo, cancellationToken);
    }

    private async Task ScheduleJobAsync(JobEventContext context, JobInfo jobInfo, CancellationToken cancellationToken = default)
    {
        var jobScheduler = context.ServiceProvider.GetRequiredService<IJobScheduler>();
        await jobScheduler.QueueAsync(jobInfo, cancellationToken);
    }

    private string GetExceptionMessage(Exception exception)
    {
        if (exception.InnerException != null)
        {
            return GetExceptionMessage(exception.InnerException);
        }

        return exception.Message;
    }
}
