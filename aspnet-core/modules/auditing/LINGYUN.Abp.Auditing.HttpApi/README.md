# LINGYUN.Abp.Auditing.HttpApi

Mô-đun HTTP API nhật ký kiểm toán, cung cấp giao diện REST API của nhật ký kiểm toán.

[English](./README.EN.md)

## Tính năng

* Giao diện REST API nhật ký kiểm toán
* Giao diện REST API nhật ký bảo mật
* Hỗ trợ kiểm soát phiên bản API
* Tích hợp tài liệu Swagger

## Tham chiếu mô-đun

```csharp
[DependsOn(typeof(AbpAuditingHttpApiModule))]
public class YouProjectModule : AbpModule
{
  // other
}
```

## Giao diện API

### Nhật ký kiểm toán

* GET /api/audit-logging/audit-logs/{id} - Lấy nhật ký kiểm toán được chỉ định
* GET /api/audit-logging/audit-logs - Lấy danh sách nhật ký kiểm toán
* DELETE /api/audit-logging/audit-logs/{id} - Xóa nhật ký kiểm toán được chỉ định
* DELETE /api/audit-logging/audit-logs/batch - Xóa hàng loạt nhật ký kiểm toán

### Nhật ký bảo mật

* GET /api/audit-logging/security-logs/{id} - Lấy nhật ký bảo mật được chỉ định
* GET /api/audit-logging/security-logs - Lấy danh sách nhật ký bảo mật
* DELETE /api/audit-logging/security-logs/{id} - Xóa nhật ký bảo mật được chỉ định
* DELETE /api/audit-logging/security-logs/batch - Xóa hàng loạt nhật ký bảo mật

## Cách dùng cơ bản

1. Tham chiếu mô-đun
2. Cấu hình quyền (nếu cần)
3. Gọi giao diện API tương ứng qua HTTP client

## Tài liệu API

Sau khi khởi động ứng dụng, có thể xem tài liệu API đầy đủ qua Swagger UI:
* /swagger - Giao diện Swagger UI
* /swagger/v1/swagger.json - Tài liệu đặc tả OpenAPI
