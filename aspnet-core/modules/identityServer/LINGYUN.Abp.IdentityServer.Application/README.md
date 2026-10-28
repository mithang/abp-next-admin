# LINGYUN.Abp.IdentityServer.Application

Module dịch vụ ứng dụng IdentityServer, cung cấp phần triển khai tầng ứng dụng cho các chức năng quản lý tài nguyên IdentityServer4 liên quan.

## Tính năng

* Dịch vụ quản lý client
  * Quản lý khóa bí mật client
  * Quản lý phạm vi client
  * Quản lý loại cấp quyền client
  * Quản lý nguồn gốc cross-domain của client
  * Quản lý URI chuyển hướng client
  * Quản lý URI chuyển hướng đăng xuất client
  * Quản lý giới hạn nhà cung cấp danh tính của client
  * Quản lý claim của client
  * Quản lý thuộc tính client

* Dịch vụ quản lý tài nguyên API
  * Quản lý thuộc tính tài nguyên API
  * Quản lý khóa bí mật tài nguyên API
  * Quản lý phạm vi tài nguyên API
  * Quản lý claim của tài nguyên API

* Dịch vụ quản lý phạm vi API
  * Quản lý claim của phạm vi API
  * Quản lý thuộc tính phạm vi API

* Dịch vụ quản lý tài nguyên danh tính
  * Quản lý claim của tài nguyên danh tính
  * Quản lý thuộc tính tài nguyên danh tính

* Dịch vụ quản lý cấp quyền bền vững

## Tham chiếu module

```csharp
[DependsOn(
    typeof(AbpIdentityServerApplicationModule)
)]
public class YourModule : AbpModule
{
    // ...
}
```

## Module phụ thuộc

* `AbpIdentityServerApplicationContractsModule` - Module hợp đồng dịch vụ ứng dụng IdentityServer
* `AbpIdentityServerDomainModule` - Module miền IdentityServer
* `AbpDddApplicationModule` - Module cơ sở dịch vụ ứng dụng ABP DDD
* `AbpAutoMapperModule` - Module ánh xạ đối tượng ABP AutoMapper

## Cấu hình và sử dụng

Module triển khai các thao tác CRUD trên tài nguyên IdentityServer4, chủ yếu dùng để quản lý tài nguyên cấu hình của IdentityServer4.

Tài liệu liên quan:
* [Tài liệu IdentityServer4](https://identityserver4.readthedocs.io/)
* [Tài liệu ủy quyền ABP](https://docs.abp.io/en/abp/latest/Authorization)

[Xem tài liệu tiếng Anh](README.EN.md)
