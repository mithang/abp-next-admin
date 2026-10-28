# LINGYUN.Abp.Auditing.Application

Module tầng ứng dụng của nhật ký kiểm toán, cung cấp triển khai dịch vụ ứng dụng cho nhật ký kiểm toán.

[English](./README.EN.md)

## Tính năng

* Dịch vụ truy vấn nhật ký kiểm toán
* Dịch vụ quản lý nhật ký kiểm toán
* Dịch vụ truy vấn nhật ký bảo mật
* Tích hợp tính năng tự động ánh xạ

## Tham chiếu module

```csharp
[DependsOn(typeof(AbpAuditingApplicationModule))]
public class YouProjectModule : AbpModule
{
  // other
}
```

## Module phụ thuộc

* `LINGYUN.Abp.AuditLogging` - Module lõi nhật ký kiểm toán
* `LINGYUN.Abp.Logging` - Module cơ sở nhật ký
* `AbpAutoMapper` - Module tự động ánh xạ ABP

## Giao diện dịch vụ

* IAuditLogAppService - Dịch vụ ứng dụng nhật ký kiểm toán
  - GetAsync - Lấy nhật ký kiểm toán chỉ định
  - GetListAsync - Lấy danh sách nhật ký kiểm toán
  - DeleteAsync - Xóa nhật ký kiểm toán chỉ định
  - DeleteManyAsync - Xóa hàng loạt nhật ký kiểm toán

* ISecurityLogAppService - Dịch vụ ứng dụng nhật ký bảo mật
  - GetAsync - Lấy nhật ký bảo mật chỉ định
  - GetListAsync - Lấy danh sách nhật ký bảo mật
  - DeleteAsync - Xóa nhật ký bảo mật chỉ định
  - DeleteManyAsync - Xóa hàng loạt nhật ký bảo mật

## Cách dùng cơ bản

1. Tham chiếu module
2. Tiêm dịch vụ ứng dụng cần dùng
3. Gọi phương thức dịch vụ tương ứng

Ví dụ:
```csharp
public class YourService
{
    private readonly IAuditLogAppService _auditLogAppService;

    public YourService(IAuditLogAppService auditLogAppService)
    {
        _auditLogAppService = auditLogAppService;
    }

    public async Task<AuditLogDto> GetAuditLogAsync(Guid id)
    {
        return await _auditLogAppService.GetAsync(id);
    }
}
```
