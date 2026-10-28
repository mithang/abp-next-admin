# LINGYUN.Abp.ExceptionHandling.Emailing

Loại thông báo email dựa trên **IExceptionSubscriber** ở tầng dưới cùng của framework ABP

## Tính năng

* Hỗ trợ thông báo email khi có ngoại lệ
* Hỗ trợ mẫu email tùy chỉnh
* Hỗ trợ nội dung email đa ngôn ngữ
* Hỗ trợ gửi thông tin ngăn xếp (stack trace)
* Hỗ trợ ánh xạ loại ngoại lệ với hộp thư nhận

## Cấu hình sử dụng

Trước khi sử dụng cần cấu hình **AbpExceptionHandlingOptions** để định nghĩa các ngoại lệ cần gửi thông báo
Sau đó cấu hình **AbpEmailExceptionHandlingOptions** để định nghĩa cách thông báo cho từng loại ngoại lệ cụ thể

```csharp
    [DependsOn(
        typeof(AbpEmailingExceptionHandlingModule)
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
            // Tùy chỉnh các loại ngoại lệ cần gửi thông báo email
            Configure<AbpEmailExceptionHandlingOptions>(options =>
            {
                // Có gửi thông tin ngăn xếp hay không
                options.SendStackTrace = true;
                // Email nhận mặc định khi chưa chỉ định người nhận ngoại lệ
                options.DefaultReceiveEmail = "colin.in@foxmail.com";
                //  Chỉ định một loại ngoại lệ nào đó gửi đến email nào
                options.HandReceivedException<AbpException>("colin.in@foxmail.com");
            });
        }
    }
```

## Giải thích các mục cấu hình

* `SendStackTrace`: Có bao gồm thông tin ngăn xếp ngoại lệ trong email hay không
* `DefaultTitle`: Tiêu đề email mặc định
* `DefaultContentHeader`: Phần đầu nội dung email mặc định
* `DefaultContentFooter`: Phần cuối nội dung email mặc định
* `DefaultReceiveEmail`: Hộp thư nhận ngoại lệ mặc định
* `Handlers`: Từ điển ánh xạ loại ngoại lệ với hộp thư nhận

## Tài nguyên bản địa hóa

Module chứa tài nguyên bản địa hóa của các ngôn ngữ sau:
* en
* zh-Hans

## Liên kết liên quan

* [Module xử lý ngoại lệ cơ bản](../LINGYUN.Abp.ExceptionHandling/README.md)
* [Module thông báo ngoại lệ thời gian thực](../../../modules/realtime-notifications/LINGYUN.Abp.ExceptionHandling.Notifications/README.md)

## Thêm nữa

Để biết thêm thông tin và ví dụ cấu hình, vui lòng xem [tài liệu](https://github.com/colinin/abp-next-admin)。
