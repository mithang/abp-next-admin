# LINGYUN.Abp.BackgroundTasks.EventBus

Mô-đun sự kiện phân tán của mô-đun tác vụ nền (hàng đợi); mô-đun tích hợp giúp ứng dụng có khả năng xử lý sự kiện công việc  

## Cấu hình sử dụng

Mô-đun được tham chiếu theo nhu cầu

```csharp
[DependsOn(typeof(AbpBackgroundTasksEventBusModule))]
public class YouProjectModule : AbpModule
{
  // other
}
```
