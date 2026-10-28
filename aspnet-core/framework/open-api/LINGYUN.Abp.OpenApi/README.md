# LINGYUN.Abp.OpenApi

Mô-đun xác thực OpenApi, cung cấp chức năng xác thực chữ ký API dựa trên AppKey/AppSecret cho ứng dụng ABP.

## Tính năng

* Hỗ trợ xác thực AppKey/AppSecret
* Hỗ trợ xác minh chữ ký yêu cầu
* Hỗ trợ chống tấn công phát lại (xác minh số ngẫu nhiên Nonce)
* Hỗ trợ xác minh dấu thời gian của yêu cầu
* Hỗ trợ danh sách trắng máy khách
* Hỗ trợ danh sách trắng địa chỉ IP
* Hỗ trợ thông báo lỗi đa ngôn ngữ

## Cài đặt

```bash
dotnet add package LINGYUN.Abp.OpenApi
```

## Tham chiếu mô-đun

```csharp
[DependsOn(typeof(AbpOpenApiModule))]
public class YouProjectModule : AbpModule
{
  // other
}
```

## Mục cấu hình

```json
{
  "OpenApi": {
    "IsEnabled": true,                   // Có bật kiểm tra chữ ký API hay không, mặc định: true
    "RequestNonceExpireIn": "00:10:00",  // Thời gian hết hạn của số ngẫu nhiên trong yêu cầu, mặc định: 10 phút
    "AppDescriptors": [                  // Danh sách cấu hình AppKey
      {
        "AppName": "Ứng dụng kiểm thử",           // Tên ứng dụng
        "AppKey": "AppKey của bạn",          // Định danh ứng dụng
        "AppSecret": "AppSecret của bạn",     // Khóa ứng dụng
        "AppToken": "Token tùy chọn",       // Mã thông báo ứng dụng tùy chọn
        "SignLifetime": 300              // Thời hạn hiệu lực của chữ ký (giây)
      }
    ]
  }
}
```

## Cách dùng cơ bản

1. Cấu hình AppKey/AppSecret
   * Thêm AppKey và AppSecret vào tệp cấu hình
   * Hoặc triển khai giao diện `IAppKeyStore` tùy chỉnh để quản lý AppKey

2. Bật xác thực OpenApi
   ```csharp
   public override void ConfigureServices(ServiceConfigurationContext context)
   {
       var configuration = context.Services.GetConfiguration();
       Configure<AbpOpenApiOptions>(configuration.GetSection("OpenApi"));
   }
   ```

3. Xác minh máy khách tùy chỉnh (tùy chọn)
   ```csharp
   public class CustomClientChecker : IClientChecker
   {
       public Task<bool> IsGrantAsync(string clientId, CancellationToken cancellationToken = default)
       {
           // Triển khai logic xác minh máy khách tùy chỉnh
           return Task.FromResult(true);
       }
   }
   ```

4. Xác minh địa chỉ IP tùy chỉnh (tùy chọn)
   ```csharp
   public class CustomIpAddressChecker : IIpAddressChecker
   {
       public Task<bool> IsGrantAsync(string ipAddress, CancellationToken cancellationToken = default)
       {
           // Triển khai logic xác minh địa chỉ IP tùy chỉnh
           return Task.FromResult(true);
       }
   }
   ```

## Mã lỗi

* AbpOpenApi:9100 - Định danh ứng dụng không hợp lệ
* AbpOpenApi:9101 - Không mang theo định danh ứng dụng
* AbpOpenApi:9110 - Chữ ký không hợp lệ
* AbpOpenApi:9111 - Không mang theo chữ ký
* AbpOpenApi:9210 - Yêu cầu đã hết thời gian chờ hoặc phiên đã hết hạn
* AbpOpenApi:9211 - Không mang theo định danh dấu thời gian
* AbpOpenApi:9220 - Yêu cầu được gửi lặp lại
* AbpOpenApi:9221 - Không mang theo số ngẫu nhiên
* AbpOpenApi:9300 - Máy khách không nằm trong phạm vi cho phép
* AbpOpenApi:9400 - IP máy khách không nằm trong phạm vi cho phép

## Thông tin thêm

* [Khung ABP](https://abp.io/)
