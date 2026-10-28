# LINGYUN.Abp.MessageService.Application

Mô-đun tầng ứng dụng của dịch vụ thông điệp.

## Tính năng

* Triển khai giao diện tầng ứng dụng của dịch vụ thông điệp
* Triển khai logic nghiệp vụ của dịch vụ thông điệp
* Hỗ trợ ánh xạ đối tượng tự động

## Mô-đun phụ thuộc

* [LINGYUN.Abp.MessageService.Application.Contracts](../LINGYUN.Abp.MessageService.Application.Contracts/README.md)
* [LINGYUN.Abp.MessageService.Domain](../LINGYUN.Abp.MessageService.Domain/README.md)

## Cấu hình và sử dụng

1. Trước tiên, cần cài đặt LINGYUN.Abp.MessageService.Application vào dự án của bạn:

```bash
dotnet add package LINGYUN.Abp.MessageService.Application
```

2. Thêm `AbpMessageServiceApplicationModule` vào danh sách phụ thuộc của mô-đun của bạn:

```csharp
[DependsOn(typeof(AbpMessageServiceApplicationModule))]
public class YourModule : AbpModule
{
}
```

## Thêm

[English document](README.EN.md)
