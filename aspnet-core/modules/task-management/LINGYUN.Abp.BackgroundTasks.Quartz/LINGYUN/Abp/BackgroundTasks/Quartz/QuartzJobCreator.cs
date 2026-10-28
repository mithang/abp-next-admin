using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Abstractions;
using Quartz;
using System;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Timing;

namespace LINGYUN.Abp.BackgroundTasks.Quartz;

public class QuartzJobCreator : IQuartzJobCreator, ISingletonDependency
{
    public ILogger<QuartzJobCreator> Logger { protected get; set; }

    protected IClock Clock { get; }
    protected IQuartzKeyBuilder KeyBuilder { get; }
    protected IJobDefinitionManager JobDefinitionManager { get; }
    public QuartzJobCreator(
        IClock clock,
        IQuartzKeyBuilder keyBuilder,
        IJobDefinitionManager jobDefinitionManager)
    {
        Clock = clock;
        KeyBuilder = keyBuilder;
        JobDefinitionManager = jobDefinitionManager;

        Logger = NullLogger<QuartzJobCreator>.Instance;
    }

    public IJobDetail? CreateJob(JobInfo job)
    {
        var jobDefinition = JobDefinitionManager.GetOrNull(job.Type);
        var jobType = jobDefinition?.JobType ?? Type.GetType(job.Type);
        if (jobType == null)
        {
            //Logger.LogWarning($"The task: {job.Group} - {job.Name}: {job.Type} is not registered and cannot create an instance of the performer type.");
            //return null;

            // Tìm kiếm tác vụ cục bộ trong thời gian chạy
            jobType = typeof(QuartzJobSearchJobAdapter);
        }
        else if (!typeof(IJob).IsAssignableFrom(jobType))
        {
            var adapterType = typeof(QuartzJobSimpleAdapter<>);
            jobType = adapterType.MakeGenericType(jobType);
        }

        if (jobType == null)
        {
            return null;
        }

        // Đổi thành dùng JobId làm tên
        var jobBuilder = JobBuilder.Create(jobType)
                .WithIdentity(KeyBuilder.CreateJobKey(job))
                .WithDescription(job.Description);
        // Cần cho tác vụ đa nút
        jobBuilder.UsingJobData(nameof(JobInfo.NodeName), job.NodeName);
        // Cần cho việc truy vấn tác vụ
        jobBuilder.UsingJobData(nameof(JobInfo.Id), job.Id);
        // Cần trong một số kịch bản
        jobBuilder.UsingJobData(nameof(JobInfo.Name), job.Name);
        jobBuilder.UsingJobData(nameof(JobInfo.Type), job.Type);
        jobBuilder.UsingJobData(nameof(JobInfo.Group), job.Group);
        // Cần để tính phần tăng thêm
        jobBuilder.UsingJobData(nameof(JobInfo.TriggerCount), job.TriggerCount);
        // Cần cho tác vụ độc quyền
        jobBuilder.UsingJobData(nameof(JobInfo.LockTimeOut), job.LockTimeOut);
        // Các tham số tác vụ được truyền vào
        jobBuilder.UsingJobData(new JobDataMap(job.Args));
        if (job.TenantId.HasValue)
        {
            // Dùng cho kịch bản đa thuê bao
            jobBuilder.UsingJobData(nameof(JobInfo.TenantId), job.TenantId.ToString());
        }

        return jobBuilder.Build();
    }

    public ITrigger? CreateTrigger(JobInfo job)
    {
        var triggerBuilder = TriggerBuilder.Create();

        switch (job.JobType)
        {
            case JobType.Period:
                if (job.Cron.IsNullOrWhiteSpace() || !CronExpression.IsValidExpression(job.Cron))
                {
                    Logger.LogWarning($"The task: {job.Group} - {job.Name} periodic task Cron expression was invalid and the task trigger could not be created.");
                    return null;
                }
                if (job.CalcCanBeTriggered() == 0)
                {
                    Logger.LogWarning($"The task: {job.Group} - {job.Name} reached trigger peak and the task trigger could not be created.");
                    return null;
                }
                triggerBuilder
                    .WithIdentity(KeyBuilder.CreateTriggerKey(job))
                    .WithDescription(job.Description)
                    .EndAt(job.EndTime)
                    .ForJob(KeyBuilder.CreateJobKey(job))
                    .WithPriority((int)job.Priority)
                    .WithCronSchedule(job.Cron);
                if (job.BeginTime > Clock.Now)
                {
                    triggerBuilder = triggerBuilder.StartAt(job.BeginTime);
                }
                break;
            case JobType.Once:
            case JobType.Persistent:
            default:
                var maxCount = job.CalcCanBeTriggered();
                if (maxCount == 0)
                {
                    Logger.LogWarning($"The task: {job.Group} - {job.Name} reached trigger peak and the task trigger could not be created.");
                    return null;
                }

                // Quartz cần trừ đi một
                maxCount -= 1;
                if (maxCount < -1)
                {
                    maxCount = -1;
                }

                triggerBuilder
                    .WithIdentity(KeyBuilder.CreateTriggerKey(job))
                    .WithDescription(job.Description)
                    .EndAt(job.EndTime)
                    .ForJob(KeyBuilder.CreateJobKey(job))
                    .WithPriority((int)job.Priority);
                    
                // Thời gian khởi động lần đầu do BeginTime quyết định, không còn dùng Interval làm "khởi động trễ".
                // Interval chỉ trong tác vụ chu kỳ Persistent mới biểu thị "khoảng lặp lại".
                if (job.BeginTime > Clock.Now)
                {
                    triggerBuilder.StartAt(job.BeginTime);
                }
                else
                {
                    triggerBuilder.StartNow();
                }
                
                // Quy ước của Quartz. Khoảng lặp lại không được bằng 0
                // fix throw Quartz.SchedulerException: Repeat Interval cannot be zero.
                var scheduleBuilder = SimpleScheduleBuilder.Create();
                // TODO: Không được dùng cơ chế thử lại có sẵn của Quartz
                // scheduleBuilder.WithRepeatCount(maxCount);
                if (job.JobType == JobType.Persistent)
                {
                    scheduleBuilder.WithRepeatCount(maxCount);
                }
                scheduleBuilder.WithIntervalInSeconds(job.Interval > 0 ? job.Interval : 300);


                triggerBuilder.WithSchedule(scheduleBuilder);

                break;
        }

        return triggerBuilder.Build();
    }
}
