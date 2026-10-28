# LINGYUN.Abp.Saas.Domain

Mô-đun tầng miền SaaS, định nghĩa các mô hình miền cốt lõi, giao diện kho lưu trữ và dịch vụ miền cho tenant và phiên bản.

## Chức năng cốt lõi

* Thực thể tenant (Tenant): bao gồm thông tin cơ bản, trạng thái, thời gian hết hạn của tenant, v.v.
* Thực thể phiên bản (Edition): bao gồm thông tin cơ bản của phiên bản
* Chuỗi kết nối tenant (TenantConnectionString): quản lý kết nối cơ sở dữ liệu của tenant
* Trình quản lý tenant (TenantManager): xử lý logic nghiệp vụ liên quan đến tenant
* Trình quản lý phiên bản (EditionManager): xử lý logic nghiệp vụ liên quan đến phiên bản
* Dữ liệu mẫu (EditionDataSeeder): cung cấp khởi tạo dữ liệu phiên bản mặc định

## Sự kiện miền

* Sự kiện tạo, cập nhật, xóa tenant
* Sự kiện tạo, cập nhật, xóa phiên bản
* Sự kiện thay đổi chuỗi kết nối tenant

## Quản lý bộ nhớ đệm

* Bộ nhớ đệm tenant: lưu đệm thông tin tenant, cải thiện hiệu năng truy vấn
* Bộ nhớ đệm phiên bản: lưu đệm thông tin phiên bản, cải thiện hiệu năng truy vấn

## Thêm

[English](README.EN.md)
