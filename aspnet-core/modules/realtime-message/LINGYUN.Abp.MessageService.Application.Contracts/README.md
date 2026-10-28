# LINGYUN.Abp.MessageService.Application.Contracts

Module hợp đồng tầng ứng dụng của dịch vụ tin nhắn.

## Tính năng

* Định nghĩa các giao diện tầng ứng dụng của dịch vụ tin nhắn
* Định nghĩa các DTO của dịch vụ tin nhắn
* Cung cấp tài nguyên đa ngôn ngữ
* Hỗ trợ hệ thống file ảo

## Module phụ thuộc

* [LINGYUN.Abp.MessageService.Domain.Shared](../LINGYUN.Abp.MessageService.Domain.Shared/README.md)

## Cấu hình và sử dụng

1. Trước tiên, cần cài đặt LINGYUN.Abp.MessageService.Application.Contracts vào dự án của bạn:

```bash
dotnet add package LINGYUN.Abp.MessageService.Application.Contracts
```

2. Thêm `AbpMessageServiceApplicationContractsModule` vào danh sách phụ thuộc của module của bạn:

```csharp
[DependsOn(typeof(AbpMessageServiceApplicationContractsModule))]
public class YourModule : AbpModule
{
}
```

## Xem thêm

[English document](README.EN.md)
