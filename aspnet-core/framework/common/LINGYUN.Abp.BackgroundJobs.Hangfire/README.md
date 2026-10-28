# LINGYUN.Abp.BackgroundJobs.Hangfire

[English](README.EN.md) | Tiếng Việt

## 1. Giới thiệu

`LINGYUN.Abp.BackgroundJobs.Hangfire` là mô-đun tác vụ nền (background job) của ABP được triển khai dựa trên [Hangfire](https://www.hangfire.io/). Nó cung cấp một framework thực thi tác vụ nền đáng tin cậy, hỗ trợ thực thi tác vụ tức thời, tác vụ trì hoãn và tác vụ định kỳ.

## 2. Tính năng

* Hỗ trợ thực thi tác vụ tức thời
* Hỗ trợ thực thi tác vụ trì hoãn
* Hỗ trợ tác vụ định kỳ (sử dụng biểu thức Cron)
* Tích hợp liền mạch với hệ thống tác vụ nền của ABP
* Hỗ trợ theo dõi trạng thái thực thi tác vụ
* Hỗ trợ cơ chế thử lại tác vụ

## 3. Cài đặt

```bash
dotnet add package LINGYUN.Abp.BackgroundJobs.Hangfire
```

## 4. Cách sử dụng

1. Thêm `AbpBackgroundJobsHangfireModule` vào các phụ thuộc của mô-đun:

```csharp
[DependsOn(typeof(AbpBackgroundJobsHangfireModule))]
public class YourModule : AbpModule
{
}
```

2. Cấu hình tác vụ nền:

```csharp
public override void ConfigureServices(ServiceConfigurationContext context)
{
    Configure<AbpBackgroundJobOptions>(options =>
    {
        options.IsJobExecutionEnabled = true; // Bật thực thi tác vụ
    });
}
```

3. Sử dụng tác vụ nền:

```csharp
public class YourService
{
    private readonly IBackgroundJobManager _backgroundJobManager;

    public YourService(IBackgroundJobManager backgroundJobManager)
    {
        _backgroundJobManager = backgroundJobManager;
    }

    public async Task CreateJobAsync()
    {
        // Tạo tác vụ tức thời
        await _backgroundJobManager.EnqueueAsync(new YourArgs());

        // Tạo tác vụ trì hoãn
        await _backgroundJobManager.EnqueueAsync(
            new YourArgs(),
            delay: TimeSpan.FromMinutes(5)
        );

        // Tạo tác vụ định kỳ
        await _backgroundJobManager.EnqueueAsync(
            "0 0 * * *", // Biểu thức Cron: thực thi lúc 0 giờ mỗi ngày
            new YourArgs()
        );
    }
}
```

## 5. Mục cấu hình

### 5.1 Cấu hình tác vụ

* `AbpBackgroundJobOptions.IsJobExecutionEnabled`: Có bật thực thi tác vụ hay không. Giá trị mặc định: `true`

## 6. Phụ thuộc

* Volo.Abp.BackgroundJobs
* Hangfire.Core
* Hangfire.AspNetCore

## 7. Tài liệu và tài nguyên

* [Tài liệu chính thức của Hangfire](https://docs.hangfire.io/)
* [Tài liệu framework ABP](https://docs.abp.io/)
