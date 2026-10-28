# LINGYUN.Abp.EntityChange.Application.Contracts

Mô-đun hợp đồng tầng ứng dụng cho việc theo dõi và khôi phục thay đổi thực thể.

## Tính năng

* Cung cấp giao diện truy vấn thay đổi thực thể
* Cung cấp giao diện khôi phục thực thể
* Cung cấp các đối tượng DTO liên quan đến thay đổi thực thể
* Cung cấp tài nguyên bản địa hóa đa ngôn ngữ

## Cách dùng cơ bản

```csharp
[DependsOn(typeof(AbpEntityChangeApplicationContractsModule))]
public class YouProjectModule : AbpModule
{
    public override void ConfigureServices(ServiceConfigurationContext context)
    {
        // ...
    }
}
```

## API

* `IEntityChangeAppService`: Giao diện dịch vụ truy vấn thay đổi thực thể
  * `GetListAsync`: Lấy danh sách lịch sử thay đổi thực thể

* `IEntityRestoreAppService`: Giao diện dịch vụ khôi phục thực thể
  * `RestoreEntityAsync`: Khôi phục một thực thể về phiên bản chỉ định
  * `RestoreEntitesAsync`: Khôi phục hàng loạt thực thể về phiên bản chỉ định

## Bản địa hóa

Mô-đun cung cấp tài nguyên bản địa hóa cho các ngôn ngữ sau:
* en
* zh-Hans

Tài nguyên bản địa hóa nằm trong thư mục `/LINGYUN/Abp/EntityChange/Localization/Resources`.

[English](./README.EN.md)
