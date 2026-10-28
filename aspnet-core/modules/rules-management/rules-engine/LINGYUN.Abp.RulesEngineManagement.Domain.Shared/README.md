# LINGYUN.Abp.RulesEngineManagement.Domain.Shared

## 1. Giới thiệu

Tầng miền dùng chung của mô-đun quản lý công cụ quy tắc, bao gồm các định nghĩa hằng số, kiểu liệt kê v.v. cần cho việc quản lý công cụ quy tắc.

## 2. Chức năng

* Định nghĩa các hằng số liên quan đến bản ghi quy trình làm việc
* Định nghĩa các hằng số liên quan đến bản ghi quy tắc
* Định nghĩa các hằng số liên quan đến bản ghi hành động
* Định nghĩa các hằng số liên quan đến bản ghi tham số
* Định nghĩa liệt kê loại hành động

## 3. Cấu hình hằng số

### 3.1 Hằng số bản ghi quy trình làm việc

* MaxNameLength: độ dài tối đa của tên quy trình làm việc, mặc định 64
* MaxTypeFullNameLength: độ dài tối đa của tên đầy đủ của loại, mặc định 255
* MaxInjectWorkflowsLength: độ dài tối đa của quy trình làm việc được chèn, mặc định là (MaxNameLength + 1) * 5

### 3.2 Hằng số bản ghi quy tắc

* MaxNameLength: độ dài tối đa của tên quy tắc, mặc định 64
* MaxOperatorLength: độ dài tối đa của toán tử, mặc định 30
* MaxErrorMessageLength: độ dài tối đa của thông báo lỗi, mặc định 255
* MaxInjectWorkflowsLength: độ dài tối đa của quy trình làm việc được chèn, mặc định là (MaxNameLength + 1) * 5
* MaxExpressionLength: độ dài tối đa của biểu thức, mặc định là int.MaxValue
* MaxSuccessEventLength: độ dài tối đa của sự kiện thành công, mặc định 128

### 3.3 Liệt kê loại hành động

* Success = 0: Thành công
* Failure = 1: Thất bại

## 4. Phụ thuộc

* Volo.Abp.Validation
* LINGYUN.Abp.Rules.RulesEngine

[Nhấn để xem tài liệu tiếng Anh](README.EN.md)
