# LINGYUN.Abp.MultiTenancy.Saas

Module quản lý SaaS đa tenant, cung cấp quản lý tenant, quản lý phiên bản (edition) và các chức năng khác.

## Tính năng

* Quản lý tenant: tạo, sửa, xoá tenant, quản lý chuỗi kết nối của tenant
* Quản lý phiên bản: tạo, sửa, xoá phiên bản, quản lý tính năng của phiên bản
* Quản lý hết hạn tenant: hỗ trợ cài đặt thời gian hết hạn tenant, cảnh báo hết hạn, thu hồi tài nguyên khi hết hạn
* Quản lý tính năng tenant: hỗ trợ gán quyền tính năng cho tenant

## Cấu hình sử dụng

### Cấu hình module

```json
{
  "AbpSaas": {
    "Tenants": {
      "RecycleStrategy": "1",           // Chiến lược thu hồi tài nguyên: 0-Giữ lại, 1-Thu hồi
      "ExpirationReminderDays": "15",   // Số ngày cảnh báo hết hạn, phạm vi 1-30 ngày
      "ExpiredRecoveryTime": "15"       // Thời gian thu hồi khi hết hạn, phạm vi 1-30 ngày
    }
  }
}
```

### Cấu hình quyền

* AbpSaas.Editions
  * AbpSaas.Editions.Create: Tạo phiên bản
  * AbpSaas.Editions.Update: Cập nhật phiên bản
  * AbpSaas.Editions.Delete: Xoá phiên bản
  * AbpSaas.Editions.ManageFeatures: Quản lý tính năng phiên bản

* AbpSaas.Tenants
  * AbpSaas.Tenants.Create: Tạo tenant
  * AbpSaas.Tenants.Update: Cập nhật tenant
  * AbpSaas.Tenants.Delete: Xoá tenant
  * AbpSaas.Tenants.ManageFeatures: Quản lý tính năng tenant
  * AbpSaas.Tenants.ManageConnectionStrings: Quản lý chuỗi kết nối tenant

## Thêm

[English](README.EN.md)
