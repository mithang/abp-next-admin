# LINGYUN.Abp.DataProtectionManagement.HttpApi

Mô-đun HTTP API quản lý quyền dữ liệu, cung cấp giao diện REST API quản lý quyền dữ liệu.

## Chức năng

* REST API quản lý quyền dữ liệu
  * Tạo quyền dữ liệu
  * Cập nhật quyền dữ liệu
  * Xóa quyền dữ liệu
  * Truy vấn quyền dữ liệu

## Bộ điều khiển API

* `DataProtectionController` - Bộ điều khiển quyền dữ liệu
  * `GET /api/data-protection-management/data-protection/{id}` - Lấy quyền dữ liệu được chỉ định
  * `GET /api/data-protection-management/data-protection` - Lấy danh sách quyền dữ liệu
  * `POST /api/data-protection-management/data-protection` - Tạo quyền dữ liệu
  * `PUT /api/data-protection-management/data-protection/{id}` - Cập nhật quyền dữ liệu
  * `DELETE /api/data-protection-management/data-protection/{id}` - Xóa quyền dữ liệu

## Xác thực quyền

* Tất cả API đều cần xác thực
* Tạo quyền dữ liệu cần quyền `DataProtectionManagement.DataProtection.Create`
* Cập nhật quyền dữ liệu cần quyền `DataProtectionManagement.DataProtection.Update`
* Xóa quyền dữ liệu cần quyền `DataProtectionManagement.DataProtection.Delete`
* Truy vấn quyền dữ liệu cần quyền `DataProtectionManagement.DataProtection`

## Liên kết liên quan

* [English document](./README.EN.md)
