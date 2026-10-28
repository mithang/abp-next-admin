# LINGYUN.Abp.DataProtectionManagement.Application.Contracts

Mô-đun hợp đồng dịch vụ ứng dụng quản lý quyền dữ liệu, cung cấp giao diện dịch vụ ứng dụng và DTO cho quản lý quyền dữ liệu.

## Tính năng

* Giao diện dịch vụ ứng dụng quản lý quyền dữ liệu
* Định nghĩa DTO quyền dữ liệu
* Định nghĩa truy vấn quyền dữ liệu

## Giao diện dịch vụ ứng dụng

* `IDataProtectionAppService` - Giao diện dịch vụ ứng dụng quản lý quyền dữ liệu
  * `GetAsync` - Lấy quyền dữ liệu
  * `GetListAsync` - Lấy danh sách quyền dữ liệu
  * `CreateAsync` - Tạo quyền dữ liệu
  * `UpdateAsync` - Cập nhật quyền dữ liệu
  * `DeleteAsync` - Xóa quyền dữ liệu

## Định nghĩa DTO

* `DataProtectionDto` - DTO quyền dữ liệu
  * `Id` - Khóa chính
  * `Name` - Tên
  * `DisplayName` - Tên hiển thị
  * `Description` - Mô tả
  * `AllowProperties` - Danh sách thuộc tính được phép
  * `FilterGroup` - Nhóm quy tắc lọc

* `DataProtectionCreateDto` - DTO tạo quyền dữ liệu
* `DataProtectionUpdateDto` - DTO cập nhật quyền dữ liệu
* `DataProtectionGetListInput` - DTO đầu vào lấy danh sách quyền dữ liệu

## Liên kết liên quan

* [English document](./README.EN.md)
