# LINGYUN.Abp.ExceptionHandling

Dựa trên **IExceptionSubscriber** ở tầng thấp của framework ABP để mở rộng lần hai, dùng để tùy chỉnh phương thức thông báo ngoại lệ

## Tính năng

* Cung cấp cơ chế xử lý và thông báo ngoại lệ thống nhất
* Hỗ trợ trình xử lý ngoại lệ tùy chỉnh
* Hỗ trợ lọc thông báo ngoại lệ
* Hỗ trợ tích hợp với các mô-đun thông báo khác (như email, thông báo thời gian thực, v.v.)

## Cấu hình và sử dụng

Trước khi sử dụng chỉ cần cấu hình **AbpExceptionHandlingOptions** để định nghĩa các ngoại lệ cần gửi thông báo.

```csharp
    [DependsOn(
        typeof(AbpExceptionHandlingModule)
        )]
    public class YouProjectModule : AbpModule
    {
        public override void ConfigureServices(ServiceConfigurationContext context)
        {
            // Tùy chỉnh các ngoại lệ cần xử lý
            Configure<AbpExceptionHandlingOptions>(options =>
            {
                // Thêm loại ngoại lệ cần xử lý
                options.Handlers.Add<AbpException>();
            });
        }
    }
```

## Mô tả các mục cấu hình

* `Handlers`: Danh sách trình xử lý ngoại lệ, dùng để định nghĩa các loại ngoại lệ cần xử lý
* `HasNotifierError`: Kiểm tra xem ngoại lệ có cần gửi thông báo hay không

## Mô-đun mở rộng

* [LINGYUN.Abp.ExceptionHandling.Emailing](../LINGYUN.Abp.ExceptionHandling.Emailing/README.md): Mô-đun thông báo ngoại lệ qua email
* [LINGYUN.Abp.ExceptionHandling.Notifications](../../../modules/realtime-notifications/LINGYUN.Abp.ExceptionHandling.Notifications/README.md): Mô-đun thông báo ngoại lệ thời gian thực

## Thêm

Để biết thêm thông tin và ví dụ cấu hình, vui lòng tham khảo [tài liệu](https://github.com/colinin/abp-next-admin)。