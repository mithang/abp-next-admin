# LINGYUN.Abp.BackgroundTasks.Jobs

Mô-đun job thường dùng cho tác vụ nền (hàng đợi)  

## Danh sách job  

* [ConsoleJob](./LINGYUN/Abp/BackgroundTasks/Jobs/ConsoleJob):							Xuất ra console  
* [HttpRequestJob](./LINGYUN/Abp/BackgroundTasks/Jobs/HttpRequestJob):					Yêu cầu Http  
* [SendEmailJob](./LINGYUN/Abp/BackgroundTasks/Jobs/SendEmailJob):						Gửi email  
* [SendSmsJob](./LINGYUN/Abp/BackgroundTasks/Jobs/SendSmsJob):							Gửi SMS  
* [ServiceInvocationJob](./LINGYUN/Abp/BackgroundTasks/Jobs/ServiceInvocationJob):		Gọi giữa các dịch vụ (mở rộng của yêu cầu Http)  
* [SleepJob](./LINGYUN/Abp/BackgroundTasks/Jobs/SleepJob):								Tạm dừng, khiến job được thực thi trễ  

## Cấu hình và sử dụng

Mô-đun được tham chiếu theo nhu cầu

```csharp
[DependsOn(typeof(AbpBackgroundTasksJobsModule))]
public class YouProjectModule : AbpModule
{
  // other
}
```
