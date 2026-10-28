# LINGYUN.Platform.EntityFrameworkCore

Triển khai EntityFrameworkCore của module quản lý nền tảng, cung cấp chức năng truy cập và lưu trữ dữ liệu.

## Tính năng

* Triển khai mọi giao diện kho lưu trữ của quản lý nền tảng
* Hỗ trợ nhiều nhà cung cấp cơ sở dữ liệu
* Cấu hình ánh xạ quan hệ thực thể
* Định nghĩa ngữ cảnh cơ sở dữ liệu
* Hỗ trợ tối ưu truy vấn và tinh chỉnh hiệu năng

## Tham chiếu module

```csharp
[DependsOn(typeof(PlatformEntityFrameworkCoreModule))]
public class YouProjectModule : AbpModule
{
  // other
}
```

## Triển khai kho lưu trữ

* `EfCoreUserMenuRepository`: Triển khai kho lưu trữ menu người dùng
  * Hỗ trợ lấy menu khởi động của người dùng
  * Hỗ trợ truy vấn danh sách menu người dùng
  * Hỗ trợ xác thực quyền menu người dùng

* `EfCorePackageRepository`: Triển khai kho lưu trữ quản lý gói
  * Hỗ trợ truy vấn phiên bản gói
  * Hỗ trợ lọc theo đặc tả gói
  * Hỗ trợ tải chi tiết gói

* `EfCoreEnterpriseRepository`: Triển khai kho lưu trữ doanh nghiệp
  * Hỗ trợ truy vấn liên kết tenant
  * Hỗ trợ phân trang danh sách doanh nghiệp

## Ngữ cảnh cơ sở dữ liệu

* `IPlatformDbContext`: Giao diện ngữ cảnh cơ sở dữ liệu quản lý nền tảng
  * Định nghĩa DbSet của mọi thực thể
  * Hỗ trợ cô lập dữ liệu đa tenant

## Các mục cấu hình

```json
{
  "ConnectionStrings": {
    "Platform": "Server=localhost;Database=Platform;Trusted_Connection=True"
  }
}
```

## Thêm

Xem thêm thông tin tại [Platform](../README.md)
