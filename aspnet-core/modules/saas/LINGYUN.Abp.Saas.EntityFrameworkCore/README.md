# LINGYUN.Abp.Saas.EntityFrameworkCore

Mô-đun SaaS EntityFrameworkCore, triển khai tầng truy cập dữ liệu cho tenant và phiên bản.

## Tính năng

* Cấu hình ánh xạ thực thể
  * Ánh xạ thực thể tenant
  * Ánh xạ thực thể phiên bản
  * Ánh xạ thực thể chuỗi kết nối tenant

* Triển khai kho lưu trữ
  * EfCoreTenantRepository: triển khai kho lưu trữ tenant
  * EfCoreEditionRepository: triển khai kho lưu trữ phiên bản

* Bảng cơ sở dữ liệu
  * AbpEditions: bảng phiên bản
  * AbpTenants: bảng tenant
  * AbpTenantConnectionStrings: bảng chuỗi kết nối tenant

## Hướng dẫn cấu hình

Có thể sửa tiền tố bảng cơ sở dữ liệu và Schema bằng cấu hình:

```json
{
  "AbpSaas": {
    "EntityFrameworkCore": {
      "TablePrefix": "Abp",  // Tiền tố bảng cơ sở dữ liệu
      "Schema": null         // Schema cơ sở dữ liệu
    }
  }
}
```

## Xem thêm

[English](README.EN.md)
