# LINGYUN.Abp.MessageService.Domain.Shared

Module chia sẻ tầng miền của dịch vụ tin nhắn.

## Tính năng

* Định nghĩa cơ sở hạ tầng của dịch vụ tin nhắn
* Cung cấp tài nguyên đa ngôn ngữ
* Định nghĩa bản địa hóa ngoại lệ
* Định nghĩa mã lỗi

## Module phụ thuộc

* `AbpLocalizationModule`

## Cấu hình và sử dụng

1. Trước tiên, cần cài đặt LINGYUN.Abp.MessageService.Domain.Shared vào dự án của bạn:

```bash
dotnet add package LINGYUN.Abp.MessageService.Domain.Shared
```

2. Thêm `AbpMessageServiceDomainSharedModule` vào danh sách phụ thuộc của module của bạn:

```csharp
[DependsOn(typeof(AbpMessageServiceDomainSharedModule))]
public class YourModule : AbpModule
{
}
```

## Xem thêm

[English document](README.EN.md)
