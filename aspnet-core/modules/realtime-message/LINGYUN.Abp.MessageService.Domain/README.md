# LINGYUN.Abp.MessageService.Domain

Module lớp lĩnh vực của dịch vụ tin nhắn.

## Tính năng

* Triển khai logic lĩnh vực của dịch vụ tin nhắn
* Tích hợp tính năng mở rộng đối tượng
* Tích hợp tính năng bộ nhớ đệm
* Tích hợp tính năng thông báo
* Hỗ trợ tự động ánh xạ
* Hỗ trợ đa ngôn ngữ

## Module phụ thuộc

* `AbpAutoMapperModule`
* `AbpCachingModule`
* `AbpNotificationsModule`
* [LINGYUN.Abp.MessageService.Domain.Shared](../LINGYUN.Abp.MessageService.Domain.Shared/README.md)

## Cấu hình sử dụng

1. Trước tiên, cần cài đặt LINGYUN.Abp.MessageService.Domain vào dự án của bạn:

```bash
dotnet add package LINGYUN.Abp.MessageService.Domain
```

2. Thêm `AbpMessageServiceDomainModule` vào danh sách phụ thuộc của module của bạn:

```csharp
[DependsOn(typeof(AbpMessageServiceDomainModule))]
public class YourModule : AbpModule
{
}
```

## Thêm

[Tài liệu tiếng Anh](README.EN.md)
