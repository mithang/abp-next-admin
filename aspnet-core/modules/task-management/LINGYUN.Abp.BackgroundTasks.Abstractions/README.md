# LINGYUN.Abp.BackgroundTasks.Abstractions

Lớp trừu tượng của mô-đun tác vụ nền (hàng đợi), định nghĩa một số cấu trúc và giao diện cơ bản  

## Tham số đặc tính  

* DisableJobActionAttribute		Đánh dấu đặc tính này không xử lý hành vi sau khi tác vụ được kích hoạt  
* DisableJobStatusAttribute		Đánh dấu đặc tính này không xử lý trạng thái tác vụ  
* DisableAuditingAttribute		Đánh dấu đặc tính này không ghi nhật ký tác vụ  

## Cấu hình sử dụng

Mô-đun được tham chiếu theo nhu cầu

```csharp
[DependsOn(typeof(AbpBackgroundTasksAbstractionsModule))]
public class YouProjectModule : AbpModule
{
  // other
}
```
