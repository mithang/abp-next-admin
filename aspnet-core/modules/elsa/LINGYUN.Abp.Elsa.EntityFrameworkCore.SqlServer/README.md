# LINGYUN.Abp.Elsa.EntityFrameworkCore.SqlServer

Module nhà cung cấp cơ sở dữ liệu SqlServer cho workflow Elsa

## Tính năng

* Cung cấp hỗ trợ cơ sở dữ liệu SqlServer cho workflow Elsa
* Phụ thuộc vào `AbpElsaEntityFrameworkCoreModule` và `AbpEntityFrameworkCoreSqlServerModule`
* Các tính năng sau được cấu hình sẵn:
  * Lưu trữ bền vững
  * Lưu trữ Webhooks
  * Lưu trữ cài đặt workflow

## Cấu hình sử dụng

```csharp
[DependsOn(
    typeof(AbpElsaEntityFrameworkCoreSqlServerModule)
    )]
public class YouProjectModule : AbpModule
{
}
```

## Mục cấu hình

```json
{
    "Elsa": {
        "Persistence": true,     // Bật lưu trữ bền vững
        "Webhooks": true,       // Bật lưu trữ Webhooks
        "WorkflowSettings": true // Bật lưu trữ cài đặt workflow
    }
}
```

[English](./README.EN.md)
