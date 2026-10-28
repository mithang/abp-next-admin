# LINGYUN.Abp.BackgroundTasks.Activities

Mô-đun xử lý hành vi của mô-đun tác vụ nền (hàng đợi)    

## Tham số giao diện  

* IJobActionStore				Triển khai giao diện này để lấy hành vi quản lý tác vụ  
* JobActionDefinitionProvider	Triển khai giao diện này để tùy chỉnh hành vi tác vụ  
* JobExecutedProvider			Triển khai giao diện này để mở rộng hành vi tác vụ  

## Cấu hình sử dụng

Mô-đun được tham chiếu theo nhu cầu

```csharp
[DependsOn(typeof(AbpBackgroundTasksActivitiesModule))]
public class YouProjectModule : AbpModule
{
  // other
}
```
