# LINGYUN.Abp.BackgroundTasks.Quartz

Triển khai Quartz của mô-đun tác vụ nền (hàng đợi).  
Và thêm một listener để thông báo trạng thái tác vụ cho người quản lý  

## Cấu hình sử dụng

Mô-đun được tham chiếu theo nhu cầu, cấu hình cụ thể tham khảo mô-đun Volo.Abp.Quartz  

```csharp
[DependsOn(typeof(AbpBackgroundTasksQuartzModule))]
public class YouProjectModule : AbpModule
{
  // other
}
```
