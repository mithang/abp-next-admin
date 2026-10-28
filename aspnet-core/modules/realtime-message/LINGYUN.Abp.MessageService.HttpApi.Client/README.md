# LINGYUN.Abp.MessageService.HttpApi.Client

Mô-đun máy khách HTTP API của dịch vụ tin nhắn.

## Tính năng

* Cung cấp proxy máy khách HTTP cho dịch vụ tin nhắn
* Tự động đăng ký dịch vụ proxy máy khách HTTP

## Mô-đun phụ thuộc

* [LINGYUN.Abp.MessageService.Application.Contracts](../LINGYUN.Abp.MessageService.Application.Contracts/README.md)
* `AbpHttpClientModule`

## Cấu hình và sử dụng

1. Trước tiên, cần cài đặt LINGYUN.Abp.MessageService.HttpApi.Client vào dự án của bạn:

```bash
dotnet add package LINGYUN.Abp.MessageService.HttpApi.Client
```

2. Thêm `AbpMessageServiceHttpApiClientModule` vào danh sách phụ thuộc của mô-đun của bạn:

```csharp
[DependsOn(typeof(AbpMessageServiceHttpApiClientModule))]
public class YourModule : AbpModule
{
}
```

3. Cấu hình địa chỉ dịch vụ từ xa:

```json
{
  "RemoteServices": {
    "AbpMessageService": {
      "BaseUrl": "http://your-service-url"
    }
  }
}
```

## Thêm

[English document](README.EN.md)
