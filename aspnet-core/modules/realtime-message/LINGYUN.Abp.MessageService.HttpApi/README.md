# LINGYUN.Abp.MessageService.HttpApi

Mô-đun HTTP API của dịch vụ tin nhắn.

## Tính năng

* Cung cấp giao diện HTTP API cho dịch vụ tin nhắn
* Hỗ trợ bản địa hóa chú thích dữ liệu MVC
* Tự động đăng ký bộ điều khiển API

## Mô-đun phụ thuộc

* [LINGYUN.Abp.MessageService.Application.Contracts](../LINGYUN.Abp.MessageService.Application.Contracts/README.md)
* `AbpAspNetCoreMvcModule`

## Cấu hình và sử dụng

1. Trước tiên, cần cài đặt LINGYUN.Abp.MessageService.HttpApi vào dự án của bạn:

```bash
dotnet add package LINGYUN.Abp.MessageService.HttpApi
```

2. Thêm `AbpMessageServiceHttpApiModule` vào danh sách phụ thuộc của mô-đun của bạn:

```csharp
[DependsOn(typeof(AbpMessageServiceHttpApiModule))]
public class YourModule : AbpModule
{
}
```

## Thêm

[English document](README.EN.md)
