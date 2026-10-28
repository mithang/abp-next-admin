# LINGYUN.Abp.DataProtection.Abstractions

Mô-đun trừu tượng quyền dữ liệu, cung cấp định nghĩa giao diện và các kiểu cơ sở liên quan đến quyền dữ liệu.

## Chức năng

* `IDataProtected` - Giao diện quyền dữ liệu, đánh dấu thực thể cần kiểm soát quyền dữ liệu
* `DataProtectedAttribute` - Thuộc tính quyền dữ liệu, đánh dấu phương thức hoặc lớp cần kiểm soát quyền dữ liệu
* `DisableDataProtectedAttribute` - Thuộc tính vô hiệu hóa quyền dữ liệu, đánh dấu phương thức hoặc lớp không kiểm soát quyền dữ liệu

## Các loại thao tác dữ liệu

* `DataAccessOperation.Read` - Thao tác truy vấn
* `DataAccessOperation.Write` - Thao tác cập nhật
* `DataAccessOperation.Delete` - Thao tác xóa

## Lọc dữ liệu

* `DataAccessFilterLogic` - Logic lọc dữ liệu
  * `And` - Và
  * `Or` - Hoặc
* `DataAccessFilterRule` - Quy tắc lọc dữ liệu
  * `Field` - Tên trường
  * `Value` - Giá trị trường
  * `Operate` - Toán tử
  * `IsLeft` - Có phải dấu ngoặc trái hay không

## Liên kết liên quan

* [English document](./README.EN.md)
