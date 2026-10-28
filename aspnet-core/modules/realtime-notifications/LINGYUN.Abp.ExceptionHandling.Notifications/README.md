# LINGYUN.Abp.ExceptionHandling.Notifications

Loại thông báo thời gian thực dựa trên **IExceptionSubscriber** ở tầng dưới của khung ABP, dùng để gửi thông tin ngoại lệ cho người dùng bằng thông báo thời gian thực.

## Tính năng

* Hỗ trợ thông báo ngoại lệ thời gian thực
* Hỗ trợ đa tenant
* Hỗ trợ mẫu thông báo
* Hỗ trợ thông báo cấp hệ thống
* Đã tích hợp mô-đun thông báo chung

## Cấu hình sử dụng

Trước khi sử dụng cần cấu hình **AbpExceptionHandlingOptions** để định nghĩa các ngoại lệ cần gửi thông báo.

```csharp
    [DependsOn(
        typeof(AbpNotificationsExceptionHandlingModule)
        )]
    public class YouProjectModule : AbpModule
    {
        public override void ConfigureServices(ServiceConfigurationContext context)
        {
            // Tùy chỉnh các ngoại lệ cần xử lý
            Configure<AbpExceptionHandlingOptions>(options =>
            {
                //  Thêm các loại ngoại lệ cần xử lý
                options.Handlers.Add<AbpException>();
            });
        }
    }
```

## Nội dung thông báo

Thông báo ngoại lệ chứa các thông tin sau:
* `header`: Thông tin đầu thông báo ngoại lệ
* `footer`: Thông tin cuối thông báo ngoại lệ
* `loglevel`: Mức nhật ký
* `stackTrace`: Thông tin ngăn xếp ngoại lệ

## Tên thông báo

Mô-đun sử dụng các tên thông báo sau:
* `NotificationsCommonNotificationNames.ExceptionHandling`: Tên thông báo xử lý ngoại lệ

## Mẫu thông báo

* Người gửi: System
* Mức thông báo: Error
* Hỗ trợ đa tenant: Có

## Mô-đun phụ thuộc

* `AbpExceptionHandlingModule`: Mô-đun xử lý ngoại lệ cơ bản
* `AbpNotificationsCommonModule`: Mô-đun thông báo chung

## Liên kết liên quan

* [Mô-đun xử lý ngoại lệ cơ bản](../../../framework/common/LINGYUN.Abp.ExceptionHandling/README.md)
* [Mô-đun thông báo ngoại lệ qua email](../../../framework/common/LINGYUN.Abp.ExceptionHandling.Emailing/README.md)

## Thêm nữa

Để biết thêm thông tin và ví dụ cấu hình, vui lòng tham khảo [tài liệu](https://github.com/colinin/abp-next-admin).
