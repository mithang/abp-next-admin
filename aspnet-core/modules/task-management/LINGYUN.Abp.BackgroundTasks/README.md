# LINGYUN.Abp.BackgroundTasks

Mô-đun tác vụ nền (hàng đợi), các background job và background worker do Abp cung cấp không hỗ trợ biểu thức Cron, cung cấp chức năng tác vụ nền (hàng đợi) có thể quản lý. 

Đã triển khai **Volo.Abp.BackgroundJobs.IBackgroundJobManager**, nghĩa là bạn cũng có thể thêm job mới qua giao diện background job của framework.  
Đã triển khai **Volo.Abp.BackgroundWorkers.IBackgroundWorkerManager**, nghĩa là bạn cũng có thể thêm job mới qua giao diện background worker của framework.  

## Loại tác vụ  

* JobType.Once:         Tác vụ một lần, loại này chỉ được thực thi một lần, phù hợp với các tình huống như thông báo email  
* JobType.Period:       Tác vụ định kỳ, loại tác vụ này quyết định cách chạy theo biểu thức Cron, phù hợp với các tình huống như phân tích báo cáo  
* JobType.Persistent:   Tác vụ liên tục, loại tác vụ này chạy theo số lần lặp và khoảng lặp đã cho, phù hợp với các tình huống như kiểm tra áp lực giao diện  

## Mô tả giao diện

* [IJobPublisher](/LINGYUN/Abp/BackgroundTasks/IJobPublisher.cs): Giao diện phát hành job, phát hành job đã chỉ định tới nút hiện tại  
* [IJobDispatcher](/LINGYUN/Abp/BackgroundTasks/IJobDispatcher.cs): Giao diện điều phối job, điều phối job đã chỉ định tới nút đã chỉ định  
* [IJobScheduler](/LINGYUN/Abp/BackgroundTasks/IJobScheduler.cs): Giao diện bộ lập lịch, quản lý bộ lập lịch job của nút đang chạy hiện tại  
* [IJobLockProvider](/LINGYUN/Abp/BackgroundTasks/IJobLockProvider.cs): Giao diện khóa job, khóa job đã chỉ định, ngăn chạy trùng lặp, thời gian khóa xem **LockTimeOut** của job  
* [IJobEventTrigger](/LINGYUN/Abp/BackgroundTasks/IJobEventTrigger.cs): Giao diện trình kích hoạt sự kiện job, giao diện lắng nghe trước và sau khi job chạy  
* [IJobStore](/LINGYUN/Abp/BackgroundTasks/IJobStore.cs): Giao diện lưu trữ bền vững job  

## Cấu hình sử dụng

Mô-đun được tham chiếu theo nhu cầu

```csharp
[DependsOn(typeof(AbpBackgroundTasksModule))]
public class YouProjectModule : AbpModule
{
  // other
}
```

```csharp
public class DemoClass
{
    protected IServiceProvider ServiceProvider { get; }

    public DemoClass(IServiceProvider serviceProvider)
    {
        ServiceProvider = serviceProvider;
    }

    public async Task Some()
    {
        var scheduler = ServiceProvider.GetRequiredService<IJobScheduler>();

        // Thêm tác vụ định kỳ (mỗi 5 giây một lần) vào hàng đợi
        await scheduler.QueueAsync(new JobInfo
        {
            Type = typeof(ConsoleJob).AssemblyQualifiedName,
            Args = new Dictionary<string, object>(),
            Name = "Test-Console-Period",
            Group = "Test",
            Description = "Test-Console",
            Id = Guid.NewGuid(),
            JobType = JobType.Period,
            Priority = Volo.Abp.BackgroundJobs.BackgroundJobPriority.Low,
            Cron = "0/5 * * * * ? ",
            TryCount = 10,
            Status = JobStatus.Running,
            // Định nghĩa trường này để xử lý đồng thời
            LockTimeOut = 120,
        });

        // Thêm tác vụ một lần vào hàng đợi, sẽ được thực thi sau 10 (Interval) giây
        await scheduler.QueueAsync(new JobInfo
        {
            Type = typeof(ConsoleJob).AssemblyQualifiedName,
            Args = new Dictionary<string, object>(),
            Name = "Test-Console-Once",
            Group = "Test",
            Description = "Test-Console",
            Id = Guid.NewGuid(),
            JobType = JobType.Once,
            Priority = Volo.Abp.BackgroundJobs.BackgroundJobPriority.Low,
            Interval = 10,
            TryCount = 10,
            Status = JobStatus.Running,
        });

        // Thêm tác vụ liên tục vào hàng đợi, sẽ được thực thi sau 10 (Interval) giây, tối đa 5 (MaxCount) lần
        await scheduler.QueueAsync(new JobInfo
        {
            Type = typeof(ConsoleJob).AssemblyQualifiedName,
            Args = new Dictionary<string, object>(),
            Name = "Test-Console-Persistent",
            Group = "Test",
            Description = "Test-Console",
            Id = Guid.NewGuid(),
            JobType = JobType.Persistent,
            Priority = Volo.Abp.BackgroundJobs.BackgroundJobPriority.Low,
            Interval = 10,
            TryCount = 10,
            MaxCount = 5,
            Status = JobStatus.Running,
        });

        // Tương tự, có thể thêm background job của framework vào bộ lập lịch job mà không cần thay đổi thói quen sử dụng
        var backgroundJobManager = ServiceProvider.GetRequiredService<IBackgroundJobManager>();
        await jobManager.EnqueueAsync(
            new SmsJobArgs
            {
                PhoneNumber = "13800138000",
                Message = "Từ background worker của framework"
            },
            BackgroundJobPriority.High,
            TimeSpan.FromSeconds(10));

        // Tương tự, có thể thêm background worker của framework vào bộ lập lịch job mà không cần thay đổi thói quen sử dụng
        var backgroundWorkManager = ServiceProvider.GetRequiredService<IBackgroundWorkerManager>();
        // Xuất ra console mỗi 20 giây
        await backgroundWorkManager.AddAsync(ServiceProvider.GetRequiredService<ConsoleWorker>());
    }
}

public class SmsJobArgs
{
    public string PhoneNumber { get; set; }
    public string Message { get; set; }
}

public class SmsJob : AsyncBackgroundJob<SmsJobArgs>, ITransientDependency
{
    public override Task ExecuteAsync(SmsJobArgs args)
    {
        Console.WriteLine($"Send sms message: {args.Message}");

        return Task.CompletedTask;
    }
}

public class ConsoleWorker : AsyncPeriodicBackgroundWorkerBase, ISingletonDependency
{
    public ConsoleWorker(AbpAsyncTimer timer, IServiceScopeFactory serviceScopeFactory)
        : base(timer, serviceScopeFactory)
    {
        timer.Period = 20000;
    }

    protected override Task DoWorkAsync(PeriodicBackgroundWorkerContext workerContext)
    {
        Console.WriteLine($"[{DateTime.Now:yyyy-MM-dd HH:mm:ss}] - ConsoleWorker Do Wrok.");
        return Task.CompletedTask;
    }
}
```
