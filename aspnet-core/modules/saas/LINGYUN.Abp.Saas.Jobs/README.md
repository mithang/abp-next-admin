# LINGYUN.Abp.Saas.Jobs

Mô-đun tác vụ nền SaaS, cung cấp triển khai tác vụ nền giám sát và quản lý tài nguyên tenant.

## Tính năng

* Tác vụ giám sát mức sử dụng tenant (TenantUsageMonitoringJob)
  * Giám sát tình hình sử dụng tài nguyên của tenant
  * Xử lý cảnh báo tenant sắp hết hạn
  * Xử lý thu hồi tài nguyên của tenant đã hết hạn

## Hướng dẫn cấu hình

### Cấu hình tác vụ

```json
{
  "Hangfire": {
    "TenantUsageMonitoring": {
      "CronExpression": "0 0 * * *",  // chạy mỗi ngày một lần
      "Queue": "default",              // hàng đợi tác vụ
      "Enabled": true                  // có bật hay không
    }
  }
}
```

### Tham số tác vụ

* Saas:AdminEmail: địa chỉ email quản trị viên, dùng để nhận thông báo cảnh báo
* Saas:TenantId: định danh tenant

## Thêm

[English](README.EN.md)
