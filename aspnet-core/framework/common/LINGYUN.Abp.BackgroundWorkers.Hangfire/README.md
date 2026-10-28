# LINGYUN.Abp.BackgroundWorkers.Hangfire

[English](README.EN.md) | Tiếng Trung giản thể

## 1. Giới thiệu

`LINGYUN.Abp.BackgroundWorkers.Hangfire` là một module background worker của ABP được triển khai dựa trên Hangfire. Nó cung cấp một cách đáng tin cậy để quản lý và thực thi các tác vụ nền chạy dài, hỗ trợ tự động khởi động, dừng và thực thi định kỳ.

## 2. Tính năng

* Hỗ trợ tự động khởi động và dừng background worker
* Hỗ trợ tác vụ nền thực thi định kỳ
* Tích hợp liền mạch với hệ thống background worker của ABP
* Hỗ trợ quản lý trạng thái worker
* Hỗ trợ dependency injection

## 3. Cài đặt

```bash
dotnet add package LINGYUN.Abp.BackgroundWorkers.Hangfire
```

## 4. Cách sử dụng

1. Thêm `AbpBackgroundWorkersHangfireModule` vào phụ thuộc module:

```csharp
[DependsOn(typeof(AbpBackgroundWorkersHangfireModule))]
public class YourModule : AbpModule
{
}
```

2. Tạo background worker:

```csharp
public class YourBackgroundWorker : AsyncPeriodicBackgroundWorkerBase
{
    public YourBackgroundWorker(
        AbpAsyncTimer timer,
        IServiceScopeFactory serviceScopeFactory) 
        : base(timer, serviceScopeFactory)
    {
        Timer.Period = 5000; // Thực thi mỗi 5 giây
    }

    protected override async Task DoWorkAsync(PeriodicBackgroundWorkerContext workerContext)
    {
        // Triển khai logic tác vụ nền của bạn tại đây
        await Task.CompletedTask;
    }
}
```

3. Đăng ký background worker:

```csharp
public override void ConfigureServices(ServiceConfigurationContext context)
{
    context.Services.AddTransient<YourBackgroundWorker>();
    Configure<AbpBackgroundWorkerOptions>(options =>
    {
        options.IsEnabled = true; // Bật background worker
    });
}
```

## 5. Các mục cấu hình

### 5.1 Cấu hình worker

* `AbpBackgroundWorkerOptions.IsEnabled`: Có bật background worker hay không. Giá trị mặc định: `true`

## 6. Các phụ thuộc

* Volo.Abp.BackgroundWorkers
* LINGYUN.Abp.BackgroundJobs.Hangfire

## 7. Tài liệu và tài nguyên

* [Tài liệu chính thức Hangfire](https://docs.hangfire.io/)
* [Tài liệu framework ABP](https://docs.abp.io/)
