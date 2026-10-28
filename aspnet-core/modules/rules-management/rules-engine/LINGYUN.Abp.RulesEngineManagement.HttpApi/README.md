# LINGYUN.Abp.RulesEngineManagement.HttpApi

## 1. Giới thiệu

Tầng HTTP API của mô-đun quản lý công cụ quy tắc, cung cấp giao diện API dựa trên RESTful。

## 2. Chức năng

* Đã triển khai giao diện HTTP API cho bản ghi quy tắc
* Đã triển khai giao diện HTTP API cho bản ghi quy trình làm việc
* Cung cấp cấu hình tuyến cho giao diện API

## 3. Giao diện API

### 3.1 API bản ghi quy tắc

* RuleRecordController
  * Đường dẫn cơ sở: api/rules-engine-management/rules
  * Cung cấp API thao tác CRUD cho bản ghi quy tắc
  * Hỗ trợ API truy vấn phân trang
  * Đã triển khai xác minh quyền

### 3.2 API bản ghi quy trình làm việc

* WorkflowRecordController
  * Đường dẫn cơ sở: api/rules-engine-management/workflows
  * Cung cấp API thao tác CRUD cho bản ghi quy trình làm việc
  * Hỗ trợ API truy vấn phân trang
  * Đã triển khai xác minh quyền

## 4. Phụ thuộc

* Volo.Abp.AspNetCore.Mvc
* LINGYUN.Abp.RulesEngineManagement.Application.Contracts

[Nhấn để xem tài liệu tiếng Anh](README.EN.md)
