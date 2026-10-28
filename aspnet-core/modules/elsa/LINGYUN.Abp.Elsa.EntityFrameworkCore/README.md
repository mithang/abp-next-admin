# LINGYUN.Abp.Elsa.EntityFrameworkCore

Mô-đun tích hợp EntityFrameworkCore cho quy trình làm việc Elsa

## Tính năng

* Cung cấp tích hợp EntityFrameworkCore cho quy trình làm việc Elsa
* Phụ thuộc vào `AbpElsaModule` và `AbpEntityFrameworkCoreModule`

## Cấu hình sử dụng

```csharp
[DependsOn(
    typeof(AbpElsaEntityFrameworkCoreModule)
    )]
public class YouProjectModule : AbpModule
{
}
```

## Nhà cung cấp cơ sở dữ liệu

Mô-đun này là mô-đun cơ sở không phụ thuộc vào nhà cung cấp cơ sở dữ liệu, bạn cần chọn mô-đun tương ứng dưới đây theo cơ sở dữ liệu thực tế đang sử dụng:

* [SqlServer](../LINGYUN.Abp.Elsa.EntityFrameworkCore.SqlServer/README.md)
* [PostgreSql](../LINGYUN.Abp.Elsa.EntityFrameworkCore.PostgreSql/README.md)
* [MySql](../LINGYUN.Abp.Elsa.EntityFrameworkCore.MySql/README.md)

[English](./README.EN.md)
