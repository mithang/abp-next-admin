# LINGYUN.Abp.BackgroundTasks.DistributedLocking

Mô-đun khóa phân tán của mô-đun tác vụ nền (hàng đợi)  

See: [Distributed-Locking](https://docs.abp.io/en/abp/latest/Distributed-Locking)

## Cấu hình sử dụng

Mô-đun được tham chiếu theo nhu cầu

```csharp
[DependsOn(typeof(AbpBackgroundTasksDistributedLockingModule))]
public class YouProjectModule : AbpModule
{
  // other
}
```
