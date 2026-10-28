# LINGYUN.Abp.IM.SignalR

Mô-đun nhắn tin tức thời được triển khai dựa trên SignalR.

## Tính năng

* Nhà cung cấp trình gửi thông điệp được triển khai dựa trên SignalR
* Tích hợp mô-đun ABP SignalR
* Hỗ trợ đa ngôn ngữ

## Mô-đun phụ thuộc

* [LINGYUN.Abp.IM](../LINGYUN.Abp.IM/README.md)
* `AbpAspNetCoreSignalRModule`

## Cấu hình và sử dụng

1. Trước tiên, cần cài đặt LINGYUN.Abp.IM.SignalR vào dự án của bạn:

```bash
dotnet add package LINGYUN.Abp.IM.SignalR
```

2. Thêm `AbpIMSignalRModule` vào danh sách phụ thuộc của mô-đun của bạn:

```csharp
[DependsOn(typeof(AbpIMSignalRModule))]
public class YourModule : AbpModule
{
}
```

## Thêm

[English document](README.EN.md)
