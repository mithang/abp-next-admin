# LINGYUN.Abp.Sms.Platform

Triển khai nền tảng xử lý thông điệp cho giao diện gửi SMS **ISmsSender** của framework ABP  

Thông qua giao diện dịch vụ nền tảng để thực hiện các chức năng quản lý, gửi và truy vấn thông điệp SMS  

## Cấu hình và sử dụng

Tham chiếu mô-đun theo nhu cầu

```csharp
[DependsOn(typeof(AbpSmsPlatformModule))]
public class YouProjectModule : AbpModule
{
  // other
}
```
## Mô tả các mục cấu hình

```json

{
  "RemoteServices": {
    "Platform": {
      "BaseUrl": "http://127.0.0.1:30025",
      "IdentityClient": "InternalServiceClient",
      "UseCurrentAccessToken": "False"
    }
  },
  "IdentityClients": {
    "InternalServiceClient": {
      "Authority": "http://127.0.0.1:44385",
      "ClientId": "InternalServiceClient",
      "ClientSecret": "1q2w3e*",
      "GrantType": "client_credentials",
      "RequireHttps": "False",
      "Scope": "lingyun-abp-application"
    }
  },
}

```

## Liên kết liên quan

* [Mô-đun dịch vụ nền tảng](../README.md)
* [Tích hợp gửi SMS](https://abp.io/docs/latest/framework/infrastructure/sms-sending)
* [Proxy giao diện động](https://abp.io/docs/latest/framework/api-development/dynamic-csharp-clients)

## Khác

