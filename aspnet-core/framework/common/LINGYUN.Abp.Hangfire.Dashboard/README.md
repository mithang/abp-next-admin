# LINGYUN.Abp.Hangfire.Dashboard

[English](README.EN.md) | Tiếng Việt

## 1. Giới thiệu

`LINGYUN.Abp.Hangfire.Dashboard` là một mô-đun ABP dùng để tích hợp bảng điều khiển (dashboard) Hangfire, nó cung cấp một giao diện Web thân thiện với người dùng để giám sát và quản lý các tác vụ nền Hangfire. Mô-đun này hỗ trợ kiểm soát quyền và xác thực, đảm bảo quyền truy cập an toàn vào bảng điều khiển.

## 2. Tính năng

* Tích hợp bảng điều khiển Hangfire
* Kiểm soát truy cập dựa trên hệ thống quyền của ABP
* Hỗ trợ tải bảng điều khiển qua iframe
* Hỗ trợ xác thực bằng mã truy cập (access token)
* Cơ chế bộ nhớ đệm (cache) cho quyền của bảng điều khiển

## 3. Cài đặt

```bash
dotnet add package LINGYUN.Abp.Hangfire.Dashboard
```

## 4. Cách sử dụng

1. Thêm `AbpHangfireDashboardModule` vào các phụ thuộc của mô-đun:

```csharp
[DependsOn(typeof(AbpHangfireDashboardModule))]
public class YourModule : AbpModule
{
}
```

2. Cấu hình middleware:

```csharp
public override void OnApplicationInitialization(ApplicationInitializationContext context)
{
    var app = context.GetApplicationBuilder();
    
    // Thêm middleware xác thực Hangfire
    app.UseHangfireAuthorication();
}
```

3. Cấu hình tùy chọn của bảng điều khiển:

```csharp
public override void ConfigureServices(ServiceConfigurationContext context)
{
    PreConfigure<DashboardOptions>(options =>
    {
        options.Authorization = new[]
        {
            new DashboardAuthorizationFilter("YourPermissionName")
        };
    });
}
```

## 5. Xác thực và phân quyền

### 5.1 Phương thức xác thực

Mô-đun hỗ trợ các phương thức xác thực sau:
* Truyền mã truy cập qua tham số URL: `?access_token=your_token`
* Truyền mã truy cập qua Cookie
* Truyền mã truy cập qua Header Authorization

### 5.2 Bộ nhớ đệm quyền

Kết quả kiểm tra quyền sẽ được lưu vào bộ nhớ đệm trong 5 phút để cải thiện hiệu năng.

## 6. Phụ thuộc

* Volo.Abp.Authorization
* Volo.Abp.Hangfire
* Microsoft.Extensions.Caching.Memory

## 7. Tài liệu và tài nguyên

* [Tài liệu chính thức của Hangfire](https://docs.hangfire.io/)
* [Tài liệu framework ABP](https://docs.abp.io/)
