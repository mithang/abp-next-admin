# LINGYUN.Abp.RulesEngineManagement.Domain

## 1. Giới thiệu

Lớp miền (domain layer) của module quản lý rules engine, triển khai logic nghiệp vụ cốt lõi của rules engine, bao gồm lưu trữ workflow, bản ghi quy tắc, bản ghi hành động, v.v.

## 2. Tính năng

* Lưu trữ workflow
  * Hỗ trợ lưu trữ workflow dựa trên bộ nhớ đệm (in-memory cache)
  * Cung cấp chức năng lấy và truy vấn workflow
  * Hỗ trợ lấy danh sách workflow theo loại
  
* Bản ghi quy tắc
  * Định nghĩa thực thể bản ghi quy tắc
  * Cung cấp giao diện kho (repository) bản ghi quy tắc
  * Hỗ trợ các thao tác CRUD trên quy tắc
  
* Bản ghi quy tắc của workflow
  * Định nghĩa thực thể bản ghi quy tắc của workflow
  * Hỗ trợ liên kết workflow với quy tắc
  
* Bản ghi tham số
  * Định nghĩa thực thể bản ghi tham số
  * Hỗ trợ quản lý tham số của workflow
  
* Bản ghi hành động
  * Định nghĩa thực thể bản ghi hành động
  * Hỗ trợ ghi lại hành động thành công/thất bại

## 3. Dịch vụ miền

* WorkflowStore
  * Triển khai giao diện IWorkflowStore
  * Cung cấp quản lý bộ nhớ đệm cho workflow
  * Hỗ trợ truy vấn và ánh xạ workflow

## 4. Giao diện kho (Repository)

* IRuleRecordRepository
  * Cung cấp các thao tác CRUD trên bản ghi quy tắc
  * Hỗ trợ truy vấn quy tắc theo tên
  
* IWorkflowRecordRepository
  * Cung cấp các thao tác CRUD trên bản ghi workflow
  * Hỗ trợ truy vấn workflow theo tên và loại

## 5. Phụ thuộc

* Volo.Abp.Domain
* LINGYUN.Abp.Rules.RulesEngine
* Microsoft.Extensions.Caching.Memory

[Nhấn để xem tài liệu tiếng Anh](README.EN.md)
