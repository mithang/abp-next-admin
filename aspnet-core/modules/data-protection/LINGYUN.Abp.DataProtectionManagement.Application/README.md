# LINGYUN.Abp.DataProtectionManagement.Application

Mô-đun dịch vụ ứng dụng quản lý quyền dữ liệu, cung cấp triển khai dịch vụ ứng dụng quản lý quyền dữ liệu.

## Tính năng

* Dịch vụ ứng dụng quản lý quyền dữ liệu
  * Tạo quyền dữ liệu
  * Cập nhật quyền dữ liệu
  * Xóa quyền dữ liệu
  * Truy vấn quyền dữ liệu
* Cấu hình ánh xạ tự động
* Xác thực quyền

## Triển khai dịch vụ ứng dụng

* `DataProtectionAppService` - Dịch vụ ứng dụng quyền dữ liệu
  * Triển khai giao diện `IDataProtectionAppService`
  * Cung cấp các thao tác CRUD quyền dữ liệu
  * Bao gồm xác thực quyền
  * Bao gồm xác thực dữ liệu

## Cấu hình ánh xạ tự động

* `DataProtectionManagementApplicationAutoMapperProfile` - Tệp cấu hình ánh xạ tự động
  * `DataProtection` -> `DataProtectionDto`
  * `DataProtectionCreateDto` -> `DataProtection`
  * `DataProtectionUpdateDto` -> `DataProtection`

## Xác thực quyền

* Tạo quyền dữ liệu cần quyền `DataProtectionManagement.DataProtection.Create`
* Cập nhật quyền dữ liệu cần quyền `DataProtectionManagement.DataProtection.Update`
* Xóa quyền dữ liệu cần quyền `DataProtectionManagement.DataProtection.Delete`
* Truy vấn quyền dữ liệu cần quyền `DataProtectionManagement.DataProtection`

## Liên kết liên quan

* [English document](./README.EN.md)
