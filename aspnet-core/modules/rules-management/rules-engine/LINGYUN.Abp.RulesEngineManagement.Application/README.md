# LINGYUN.Abp.RulesEngineManagement.Application

## 1. Giới thiệu

Tầng triển khai dịch vụ ứng dụng của mô-đun quản lý công cụ quy tắc, triển khai logic nghiệp vụ quản lý công cụ quy tắc.

## 2. Tính năng

* Đã triển khai dịch vụ ứng dụng của bản ghi quy tắc
* Đã triển khai dịch vụ ứng dụng của bản ghi quy trình làm việc
* Cung cấp cấu hình ánh xạ tự động cho quản lý công cụ quy tắc

## 3. Triển khai dịch vụ ứng dụng

### 3.1 Dịch vụ ứng dụng bản ghi quy tắc

* RuleRecordAppService
  * Đã triển khai giao diện IRuleRecordAppService
  * Cung cấp thao tác CRUD cho bản ghi quy tắc
  * Đã triển khai chức năng truy vấn bản ghi quy tắc
  * Hỗ trợ truy vấn phân trang
  * Đã triển khai xác thực quyền

### 3.2 Dịch vụ ứng dụng bản ghi quy trình làm việc

* WorkflowRecordAppService
  * Đã triển khai giao diện IWorkflowRecordAppService
  * Cung cấp thao tác CRUD cho bản ghi quy trình làm việc
  * Đã triển khai chức năng truy vấn bản ghi quy trình làm việc
  * Hỗ trợ truy vấn phân trang
  * Đã triển khai xác thực quyền

## 4. Ánh xạ đối tượng

* RulesEngineManagementApplicationAutoMapperProfile
  * Đã cấu hình ánh xạ tự động giữa DTO và thực thể
  * Bao gồm mọi cấu hình ánh xạ liên quan đến quản lý công cụ quy tắc

## 5. Phụ thuộc

* Volo.Abp.AutoMapper
* Volo.Abp.Ddd.Application
* LINGYUN.Abp.RulesEngineManagement.Application.Contracts
* LINGYUN.Abp.RulesEngineManagement.Domain

[Nhấn để xem tài liệu tiếng Anh](README.EN.md)
