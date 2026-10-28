# LINGYUN.Abp.EntityChange.HttpApi

Mô-đun HTTP API theo dõi và khôi phục thay đổi thực thể.

## Tính năng

* Cung cấp HTTP API truy vấn thay đổi thực thể
* Cung cấp HTTP API khôi phục thực thể
* Hỗ trợ bản địa hóa đa ngôn ngữ

## Cách sử dụng cơ bản

```csharp
[DependsOn(typeof(AbpEntityChangeHttpApiModule))]
public class YouProjectModule : AbpModule
{
    public override void ConfigureServices(ServiceConfigurationContext context)
    {
        // ...
    }
}
```

## Điểm cuối API

* `EntityChangeController`: Bộ điều khiển thay đổi thực thể
  * GET `/api/entity-changes`: Lấy danh sách lịch sử thay đổi thực thể

* `EntityRestoreController`: Bộ điều khiển khôi phục thực thể
  * PUT `/api/entity-restore`: Khôi phục một thực thể về phiên bản chỉ định
  * PUT `/api/{EntityId}/entity-restore`: Khôi phục thực thể có ID chỉ định
  * PUT `/api/{EntityId}/v/{EntityChangeId}/entity-restore`: Khôi phục thực thể có ID chỉ định về phiên bản chỉ định
  * PUT `/api/entites-restore`: Khôi phục hàng loạt thực thể về phiên bản chỉ định

## Bản địa hóa

Mô-đun sử dụng `AbpEntityChangeResource` làm tài nguyên bản địa hóa, hỗ trợ hiển thị đa ngôn ngữ.

[English](./README.EN.md)
