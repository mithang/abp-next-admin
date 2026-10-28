# LINGYUN.Abp.EventBus.CAP

Tích hợp CAP cho bus sự kiện phân tán

#### Lưu ý

* Giao diện bộ xử lý sự kiện tùy chỉnh ICustomDistributedEventSubscriber chưa được triển khai, các sự kiện phân tán hiện tại chỉ có thể được CustomDistributedEventSubscriber phát hiện khi khởi động  

* Do CAP không hỗ trợ nhiều consumer cho cùng một tham số sự kiện, trong giao diện ConsumerServiceSelector sẽ tạo một Group mới thông qua tên đầy đủ của lớp consumer

## Cấu hình và sử dụng

```csharp
[DependsOn(typeof(AbpCAPEventBusModule))]
public class YouProjectModule : AbpModule
{
  // other
}

## Lịch sử thay đổi

【2021-03-14】 Bổ sung hỗ trợ đa tenant
