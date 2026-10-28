# LINGYUN.Abp.BackgroundTasks.Notifications

Sự kiện thông báo sau khi tác vụ nền thực thi

## Cấu hình sử dụng

Module được tham chiếu theo nhu cầu

```csharp
[DependsOn(typeof(AbpBackgroundTasksNotificationsModule))]
public class YouProjectModule : AbpModule
{
  // other
}
```

## Tham số Action

** Tham số định dạng nội dung thông báo, sau khi tác vụ hoàn thành sẽ gửi thông báo thời gian thực

* push-provider		tùy chọn, nhà cung cấp đẩy thông báo do người dùng chỉ định;
* use-template		tùy chọn, tên mẫu dùng để định dạng nội dung thông báo
* content			tùy chọn, nội dung thông báo (bắt buộc nếu chưa chỉ định tên mẫu)
* culture			tùy chọn, vùng văn hóa của mẫu khi sử dụng mẫu
