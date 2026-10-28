# LINGYUN.Abp.RulesManagement

Mô-đun quản lý công cụ quy tắc, cung cấp chức năng quản lý quy trình làm việc và quy tắc dựa trên công cụ quy tắc.

## 1. Mô tả mô-đun

Mô-đun này được triển khai dựa trên RulesEngine, cung cấp khả năng quản lý bền vững quy tắc quy trình làm việc, quản lý bộ nhớ đệm và giao diện API. Chủ yếu bao gồm các mô-đun con sau:

### 1.1 Domain.Shared

* Định nghĩa các hằng số cơ sở như bản ghi quy trình làm việc, bản ghi quy tắc, bản ghi hành động
* Cung cấp định nghĩa enum cho loại hành động và các loại tương tự
* [Xem mô tả chi tiết](rules-engine/LINGYUN.Abp.RulesEngineManagement.Domain.Shared/README.md)

### 1.2 Domain

* Triển khai logic nghiệp vụ cốt lõi của kho lưu trữ quy trình làm việc
* Cung cấp triển khai kho lưu trữ quy trình làm việc dựa trên bộ nhớ đệm trong bộ nhớ
* Định nghĩa các mô hình miền như bản ghi quy tắc, bản ghi quy trình làm việc
* [Xem mô tả chi tiết](rules-engine/LINGYUN.Abp.RulesEngineManagement.Domain/README.md)

### 1.3 EntityFrameworkCore

* Cung cấp tầng truy cập dữ liệu triển khai dựa trên EF Core
* Triển khai ánh xạ cơ sở dữ liệu cho các thực thể như quy trình làm việc, quy tắc
* Triển khai giao diện kho lưu trữ (repository)
* [Xem mô tả chi tiết](rules-engine/LINGYUN.Abp.RulesEngineManagement.EntityFrameworkCore/README.md)

### 1.4 Application.Contracts

* Định nghĩa giao diện dịch vụ ứng dụng của quản lý công cụ quy tắc
* Định nghĩa đối tượng truyền dữ liệu (DTOs)
* Định nghĩa quyền
* [Xem mô tả chi tiết](rules-engine/LINGYUN.Abp.RulesEngineManagement.Application.Contracts/README.md)

### 1.5 Application

* Triển khai dịch vụ ứng dụng của bản ghi quy tắc và bản ghi quy trình làm việc
* Cung cấp cấu hình ánh xạ đối tượng tự động
* [Xem mô tả chi tiết](rules-engine/LINGYUN.Abp.RulesEngineManagement.Application/README.md)

### 1.6 HttpApi

* Cung cấp giao diện API theo phong cách RESTful
* Triển khai API thao tác CRUD cho quy tắc và quy trình làm việc
* [Xem mô tả chi tiết](rules-engine/LINGYUN.Abp.RulesEngineManagement.HttpApi/README.md)

## 2. Tính năng

* Quản lý quy trình làm việc
  * Hỗ trợ tạo, sửa, xóa, truy vấn quy trình làm việc
  * Cung cấp quản lý bộ nhớ đệm cho quy trình làm việc
  * Hỗ trợ truy vấn quy trình làm việc theo loại
  
* Quản lý quy tắc
  * Hỗ trợ tạo, sửa, xóa, truy vấn quy tắc
  * Hỗ trợ định nghĩa biểu thức quy tắc
  * Hỗ trợ liên kết quy tắc với quy trình làm việc
  
* Quản lý tham số
  * Hỗ trợ định nghĩa tham số quy trình làm việc
  * Hỗ trợ kiểm chứng giá trị tham số
  
* Quản lý hành động
  * Hỗ trợ định nghĩa hành động thành công/thất bại
  * Hỗ trợ ghi lại kết quả thực thi hành động

## 3. Cấu hình

### 3.1 Cấu hình bản ghi quy trình làm việc

* MaxNameLength: Độ dài tối đa của tên quy trình làm việc, mặc định 64
* MaxTypeFullNameLength: Độ dài tối đa của tên đầy đủ của loại, mặc định 255
* MaxInjectWorkflowsLength: Độ dài tối đa của quy trình làm việc được inject, mặc định (MaxNameLength + 1) * 5

### 3.2 Cấu hình bản ghi quy tắc

* MaxNameLength: Độ dài tối đa của tên quy tắc, mặc định 64
* MaxOperatorLength: Độ dài tối đa của toán tử, mặc định 30
* MaxErrorMessageLength: Độ dài tối đa của thông báo lỗi, mặc định 255
* MaxExpressionLength: Độ dài tối đa của biểu thức, mặc định int.MaxValue
* MaxSuccessEventLength: Độ dài tối đa của sự kiện thành công, mặc định 128

## 4. Quyền

* RulesEngineManagement.Rule
  * Quyền quản lý quy tắc
  * Bao gồm quyền tạo, sửa, xóa, truy vấn
  
* RulesEngineManagement.Workflow
  * Quyền quản lý quy trình làm việc
  * Bao gồm quyền tạo, sửa, xóa, truy vấn

## 5. Giao diện API

### 5.1 API bản ghi quy tắc

* Đường dẫn cơ sở: api/rules-engine-management/rules
* Cung cấp API thao tác CRUD cho bản ghi quy tắc
* Hỗ trợ API truy vấn phân trang

### 5.2 API bản ghi quy trình làm việc

* Đường dẫn cơ sở: api/rules-engine-management/workflows
* Cung cấp API thao tác CRUD cho bản ghi quy trình làm việc
* Hỗ trợ API truy vấn phân trang

## 6. Phụ thuộc

* Volo.Abp.Core
* LINGYUN.Abp.Rules.RulesEngine
* Microsoft.Extensions.Caching.Memory
* Volo.Abp.EntityFrameworkCore
* Volo.Abp.Ddd.Application
* Volo.Abp.AspNetCore.Mvc
