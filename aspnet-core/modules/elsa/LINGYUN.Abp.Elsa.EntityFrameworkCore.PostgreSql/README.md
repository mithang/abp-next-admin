# LINGYUN.Abp.Elsa.EntityFrameworkCore.PostgreSql

Module nhà cung cấp cơ sở dữ liệu PostgreSql cho workflow Elsa

## Tính năng

* Cung cấp hỗ trợ cơ sở dữ liệu PostgreSql cho workflow Elsa
* Phụ thuộc vào `AbpElsaEntityFrameworkCoreModule` và `AbpEntityFrameworkCorePostgreSqlModule`
* Các tính năng sau được cấu hình sẵn:
  * Lưu trữ bền vững
  * Lưu trữ Webhooks
  * Lưu trữ cài đặt workflow

## Cấu hình sử dụng

```csharp
[DependsOn(
    typeof(AbpElsaEntityFrameworkCorePostgreSqlModule)
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
