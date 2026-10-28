# LINGYUN.Platform.Domain

Lớp miền (domain layer) của mô-đun quản lý nền tảng, triển khai logic nghiệp vụ cốt lõi và mô hình miền cần thiết cho quản lý nền tảng.

## Tính năng

* Quản lý menu
  * Hỗ trợ cấu trúc menu nhiều cấp
  * Tùy chỉnh menu người dùng
  * Quyền menu theo vai trò
  * Chuyển đổi chuẩn hóa menu

* Quản lý layout
  * Thực thể view layout
  * Liên kết dữ liệu layout
  * Hỗ trợ nhiều framework

* Từ điển dữ liệu
  * Quản lý từ điển dữ liệu
  * Quản lý mục từ điển dữ liệu
  * Dữ liệu seed từ điển dữ liệu

* Quản lý gói
  * Kiểm soát phiên bản gói
  * Quản lý tệp gói
  * Tích hợp lưu trữ Blob
  * Quy tắc lọc gói

* Cổng doanh nghiệp
  * Quản lý thông tin doanh nghiệp
  * Lưu trữ dữ liệu doanh nghiệp

## Tham chiếu mô-đun

```csharp
[DependsOn(typeof(PlatformDomainModule))]
public class YouProjectModule : AbpModule
{
  // other
}
```

## Dịch vụ miền

* `DataDictionaryDataSeeder`: Dịch vụ dữ liệu seed từ điển dữ liệu
* `PackageBlobManager`: Dịch vụ quản lý tệp gói
* `DefaultStandardMenuConverter`: Dịch vụ chuyển đổi menu chuẩn

## Giao diện kho lưu trữ

* `IMenuRepository`: Giao diện kho lưu trữ menu
* `IUserMenuRepository`: Giao diện kho lưu trữ menu người dùng
* `IRoleMenuRepository`: Giao diện kho lưu trữ menu vai trò
* `ILayoutRepository`: Giao diện kho lưu trữ layout
* `IEnterpriseRepository`: Giao diện kho lưu trữ doanh nghiệp

## Thực thể

* `Menu`: Thực thể menu
* `UserMenu`: Thực thể menu người dùng
* `RoleMenu`: Thực thể menu vai trò
* `Layout`: Thực thể layout
* `Package`: Thực thể gói
* `Data`: Thực thể từ điển dữ liệu
* `DataItem`: Thực thể mục từ điển dữ liệu

## Thêm nữa

Để biết thêm thông tin, vui lòng tham khảo [Platform](../README.md)
