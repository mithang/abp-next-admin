# LINGYUN.Abp.RulesEngineManagement.Application.Contracts

## 1. Giới thiệu

Tầng hợp đồng dịch vụ ứng dụng của mô-đun quản lý công cụ quy tắc, định nghĩa các giao diện, DTO v.v. cần cho việc quản lý công cụ quy tắc.

## 2. Chức năng

* Định nghĩa giao diện dịch vụ ứng dụng quản lý công cụ quy tắc
* Định nghĩa đối tượng truyền dữ liệu (DTOs)
* Định nghĩa quyền

## 3. Giao diện dịch vụ ứng dụng

* IRuleRecordAppService
  * Cung cấp giao diện thao tác CRUD cho bản ghi quy tắc
  * Hỗ trợ truy vấn quy tắc theo tên
  * Hỗ trợ truy vấn phân trang
  
* IWorkflowRecordAppService
  * Cung cấp giao diện thao tác CRUD cho bản ghi quy trình làm việc
  * Hỗ trợ truy vấn quy trình làm việc theo tên và loại
  * Hỗ trợ truy vấn phân trang

## 4. Đối tượng truyền dữ liệu

### 4.1 DTOs bản ghi quy tắc

* RuleRecordDto
* CreateRuleRecordDto
* UpdateRuleRecordDto
* RuleRecordGetListInput

### 4.2 DTOs bản ghi quy trình làm việc

* WorkflowRecordDto
* CreateWorkflowRecordDto
* UpdateWorkflowRecordDto
* WorkflowRecordGetListInput

### 4.3 DTOs bản ghi tham số

* ParamRecordDto
* CreateParamRecordDto
* UpdateParamRecordDto

### 4.4 DTOs bản ghi hành động

* ActionRecordDto
* CreateActionRecordDto
* UpdateActionRecordDto

## 5. Định nghĩa quyền

* RulesEngineManagement.Rule
  * Quyền quản lý quy tắc
  * Bao gồm quyền tạo, sửa, xóa, truy vấn
  
* RulesEngineManagement.Workflow
  * Quyền quản lý quy trình làm việc
  * Bao gồm quyền tạo, sửa, xóa, truy vấn

## 6. Phụ thuộc

* Volo.Abp.Ddd.Application.Contracts
* LINGYUN.Abp.RulesEngineManagement.Domain.Shared

[Nhấn để xem tài liệu tiếng Anh](README.EN.md)
