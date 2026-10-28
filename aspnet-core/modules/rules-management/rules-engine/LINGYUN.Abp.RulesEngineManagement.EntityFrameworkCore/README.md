# LINGYUN.Abp.RulesEngineManagement.EntityFrameworkCore

## 1. Giới thiệu

Triển khai EntityFrameworkCore của mô-đun quản lý rules engine, cung cấp lớp truy cập dữ liệu dựa trên EF Core.

## 2. Tính năng

* Đã triển khai DbContext của mô-đun quản lý rules engine
* Cung cấp cấu hình ánh xạ cơ sở dữ liệu cho các thực thể
* Đã triển khai giao diện kho lưu trữ

## 3. Triển khai cơ sở dữ liệu

### 3.1 DbContext

* RulesEngineManagementDbContext
  * Đã triển khai giao diện IRulesEngineManagementDbContext
  * Bao gồm định nghĩa DbSet của tất cả các thực thể
  * Hỗ trợ đa tenant

### 3.2 Triển khai kho lưu trữ

* EfCoreRuleRecordRepository
  * Đã triển khai giao diện IRuleRecordRepository
  * Cung cấp thao tác CRUD cho bản ghi quy tắc
  * Hỗ trợ truy vấn quy tắc theo tên

* EfCoreWorkflowRecordRepository
  * Đã triển khai giao diện IWorkflowRecordRepository
  * Cung cấp thao tác CRUD cho bản ghi quy trình làm việc
  * Hỗ trợ truy vấn quy trình làm việc theo tên và loại

### 3.3 Ánh xạ thực thể

* Ánh xạ bản ghi quy trình làm việc
  * Đã cấu hình khóa chính, chỉ mục
  * Đã cấu hình giới hạn độ dài trường
  * Đã cấu hình quan hệ liên kết

* Ánh xạ bản ghi quy tắc
  * Đã cấu hình khóa chính, chỉ mục
  * Đã cấu hình giới hạn độ dài trường
  * Đã cấu hình quan hệ liên kết

* Ánh xạ bản ghi tham số
  * Đã cấu hình khóa chính
  * Đã cấu hình giới hạn độ dài trường

* Ánh xạ bản ghi hành động
  * Đã cấu hình khóa chính
  * Đã cấu hình giới hạn độ dài trường

## 4. Phụ thuộc

* Volo.Abp.EntityFrameworkCore
* LINGYUN.Abp.RulesEngineManagement.Domain

[Xem tài liệu tiếng Anh](README.EN.md)
