# LINGYUN.Abp.Http.Client.Wrapper

Mô-đun bao bọc (wrapper) cho HTTP client, dùng để tự động thêm header yêu cầu bao bọc vào các yêu cầu HTTP client.

[English](./README.EN.md)

## Tính năng

* Tự động thêm header yêu cầu bao bọc
* Tích hợp với ABP HTTP client
* Hỗ trợ cấu hình toàn cục công tắc bao bọc

## Cài đặt

```bash
dotnet add package LINGYUN.Abp.Http.Client.Wrapper
```

## Cấu hình sử dụng

```csharp
[DependsOn(typeof(AbpHttpClientWrapperModule))]
public class YouProjectModule : AbpModule
{
    public override void ConfigureServices(ServiceConfigurationContext context)
    {
        Configure<AbpWrapperOptions>(options =>
        {
            // Bật bao bọc
            options.IsEnabled = true;
        });
    }
}
```

## Nguyên lý hoạt động

Khi bật bao bọc (`AbpWrapperOptions.IsEnabled = true`), mô-đun sẽ tự động thêm header yêu cầu `_AbpWrapResult` cho mọi yêu cầu HTTP client.
Khi tắt bao bọc (`AbpWrapperOptions.IsEnabled = false`), mô-đun sẽ tự động thêm header yêu cầu `_AbpDontWrapResult` cho mọi yêu cầu HTTP client.

Nhờ vậy, kết quả yêu cầu của HTTP client được đảm bảo nhất quán với cấu hình bao bọc phía máy chủ.

## Vị trí mã nguồn

[LINGYUN.Abp.Http.Client.Wrapper](https://github.com/colinin/abp-next-admin/tree/master/aspnet-core/framework/common/LINGYUN.Abp.Http.Client.Wrapper)
