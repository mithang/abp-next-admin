# LINGYUN.Abp.AspNetCore.Mvc.Wrapper

Module triển khai MVC dạng wrapper, dùng để đóng gói thống nhất kết quả phản hồi của ASP.NET Core MVC.

[English](./README.EN.md)

## Tính năng

* Tự động đóng gói kết quả phản hồi MVC
* Hỗ trợ quy tắc đóng gói tùy chỉnh
* Hỗ trợ đóng gói kết quả ngoại lệ
* Hỗ trợ thông báo lỗi đã bản địa hóa
* Hỗ trợ mô tả đóng gói tài liệu API
* Hỗ trợ bỏ qua đóng gói đối với bộ điều khiển, không gian tên và kiểu trả về cụ thể

## Cài đặt

```bash
dotnet add package LINGYUN.Abp.AspNetCore.Mvc.Wrapper
```

## Cấu hình sử dụng

```csharp
[DependsOn(typeof(AbpAspNetCoreMvcWrapperModule))]
public class YouProjectModule : AbpModule
{
    public override void ConfigureServices(ServiceConfigurationContext context)
    {
        Configure<AbpWrapperOptions>(options =>
        {
            // Bật wrapper
            options.IsEnabled = true;
            
            // Bỏ qua kiểu trả về cụ thể
            options.IgnoreReturnTypes.Add<IRemoteStreamContent>();
            
            // Bỏ qua bộ điều khiển cụ thể
            options.IgnoreControllers.Add<AbpApiDefinitionController>();
            
            // Bỏ qua tiền tố URL cụ thể
            options.IgnorePrefixUrls.Add("/connect");
            
            // Tùy chỉnh thông báo kết quả rỗng
            options.MessageWithEmptyResult = (serviceProvider) =>
            {
                var localizer = serviceProvider.GetRequiredService<IStringLocalizer<AbpMvcWrapperResource>>();
                return localizer["Wrapper:NotFound"];
            };
        });
    }
}
```

## Giải thích các mục cấu hình

* `IsEnabled`: Có bật wrapper hay không
* `IsWrapUnauthorizedEnabled`: Có đóng gói phản hồi chưa được ủy quyền hay không
* `HttpStatusCode`: Mã trạng thái HTTP của phản hồi đã đóng gói
* `IgnoreReturnTypes`: Danh sách kiểu trả về bỏ qua đóng gói
* `IgnoreControllers`: Danh sách bộ điều khiển bỏ qua đóng gói
* `IgnoreNamespaces`: Danh sách không gian tên bỏ qua đóng gói
* `IgnorePrefixUrls`: Danh sách tiền tố URL bỏ qua đóng gói
* `IgnoreExceptions`: Danh sách kiểu ngoại lệ bỏ qua đóng gói
* `ErrorWithEmptyResult`: Kết quả rỗng có trả về thông tin lỗi hay không
* `CodeWithEmptyResult`: Mã lỗi của kết quả rỗng
* `MessageWithEmptyResult`: Thông báo lỗi của kết quả rỗng
* `CodeWithSuccess`: Mã khi thành công

## Cách dùng nâng cao

### 1. Dùng attribute để đánh dấu bỏ qua đóng gói

```csharp
[IgnoreWrapResult]
public class TestController : AbpController
{
    // Mọi Action trong bộ điều khiển này đều sẽ không bị đóng gói
}

public class TestController : AbpController
{
    [IgnoreWrapResult]
    public IActionResult Test()
    {
        // Action này sẽ không bị đóng gói
    }
}
```

### 2. Điều khiển đóng gói qua header của yêu cầu

* Thêm header `_AbpDontWrapResult` có thể tắt đóng gói
* Thêm header `_AbpWrapResult` có thể bắt buộc bật đóng gói

## Vị trí mã nguồn

[LINGYUN.Abp.AspNetCore.Mvc.Wrapper](https://github.com/colinin/abp-next-admin/tree/master/aspnet-core/framework/mvc/LINGYUN.Abp.AspNetCore.Mvc.Wrapper)
