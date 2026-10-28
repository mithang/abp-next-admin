# LINGYUN.Abp.EntityChange.Application

Mô-đun triển khai tầng ứng dụng cho việc theo dõi và khôi phục thay đổi thực thể.

## Chức năng

* Triển khai dịch vụ truy vấn thay đổi thực thể
* Triển khai dịch vụ khôi phục thực thể
* Cung cấp cấu hình ánh xạ tự động cho thay đổi thực thể

## Cách dùng cơ bản

```csharp
[DependsOn(typeof(AbpEntityChangeApplicationModule))]
public class YouProjectModule : AbpModule
{
    public override void ConfigureServices(ServiceConfigurationContext context)
    {
        // ...
    }
}
```

## Triển khai dịch vụ

* `EntityRestoreAppService<TEntity, TKey>`: triển khai dịch vụ khôi phục thực thể
  * `RestoreEntityAsync`: khôi phục một thực thể về phiên bản chỉ định thông qua nhật ký kiểm toán
  * `RestoreEntitesAsync`: khôi phục hàng loạt thực thể về phiên bản chỉ định thông qua nhật ký kiểm toán
  * Hỗ trợ cấu hình chính sách quyền khôi phục thông qua `RestorePolicy`

## Ánh xạ đối tượng

Mô-đun sử dụng AutoMapper để triển khai ánh xạ tự động cho các đối tượng sau:
* `EntityPropertyChange` -> `EntityPropertyChangeDto`
* `EntityChange` -> `EntityChangeDto`

[English](./README.EN.md)
