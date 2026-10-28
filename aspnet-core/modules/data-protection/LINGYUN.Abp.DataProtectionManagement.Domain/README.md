# LINGYUN.Abp.DataProtectionManagement.Domain

Module miền quản lý quyền dữ liệu, cung cấp logic nghiệp vụ cốt lõi cho việc quản lý quyền dữ liệu.

## Chức năng

* Quản lý quyền dữ liệu
  * Tạo quyền dữ liệu
  * Cập nhật quyền dữ liệu
  * Xóa quyền dữ liệu
  * Truy vấn quyền dữ liệu
* Quản lý tài nguyên quyền dữ liệu
  * Định nghĩa tài nguyên
  * Nhóm tài nguyên
  * Thuộc tính tài nguyên
* Quản lý quy tắc quyền dữ liệu
  * Định nghĩa quy tắc
  * Nhóm quy tắc
  * Toán tử quy tắc

## Dịch vụ miền

* `IDataProtectionManager` - Dịch vụ quản lý quyền dữ liệu
  * `CreateAsync` - Tạo quyền dữ liệu
  * `UpdateAsync` - Cập nhật quyền dữ liệu
  * `DeleteAsync` - Xóa quyền dữ liệu
  * `GetAsync` - Lấy quyền dữ liệu
  * `GetListAsync` - Lấy danh sách quyền dữ liệu

## Thực thể

* `DataProtection` - Thực thể quyền dữ liệu
  * `Id` - Khóa chính
  * `Name` - Tên
  * `DisplayName` - Tên hiển thị
  * `Description` - Mô tả
  * `AllowProperties` - Danh sách thuộc tính được phép
  * `FilterGroup` - Nhóm quy tắc lọc

## Kho lưu trữ

* `IDataProtectionRepository` - Giao diện kho lưu trữ quyền dữ liệu
  * `GetListAsync` - Lấy danh sách quyền dữ liệu
  * `FindByNameAsync` - Tìm quyền dữ liệu theo tên
  * `GetCountAsync` - Lấy số lượng quyền dữ liệu

## Liên kết liên quan

* [English document](./README.EN.md)
