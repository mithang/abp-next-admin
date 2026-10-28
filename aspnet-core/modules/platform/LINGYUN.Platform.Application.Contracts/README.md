# LINGYUN.Platform.Application.Contracts

Lớp hợp đồng dịch vụ ứng dụng của mô-đun quản lý nền tảng, định nghĩa giao diện dịch vụ ứng dụng, đối tượng DTO và định nghĩa quyền.

## Tính năng

* Giao diện quản lý menu
  * Thao tác CRUD menu
  * Quản lý menu người dùng
  * Quản lý menu vai trò
  * Chức năng menu yêu thích

* Giao diện quản lý gói
  * Thao tác CRUD gói
  * Quản lý phiên bản gói
  * Tải lên/tải xuống tệp gói

* Định nghĩa quyền
  * Nhóm quyền quản lý nền tảng
  * Quyền từ điển dữ liệu
  * Quyền quản lý menu
  * Quyền quản lý gói

## Tham chiếu mô-đun

```csharp
[DependsOn(typeof(PlatformApplicationContractsModule))]
public class YouProjectModule : AbpModule
{
  // other
}
```

## Giao diện dịch vụ ứng dụng

* `IMenuAppService`: Giao diện dịch vụ quản lý menu
* `IUserFavoriteMenuAppService`: Giao diện dịch vụ menu yêu thích của người dùng
* `IPackageAppService`: Giao diện dịch vụ quản lý gói

## Đối tượng truyền dữ liệu

* DTO liên quan đến menu
  * `MenuDto`: DTO menu
  * `MenuCreateDto`: DTO tạo menu
  * `MenuUpdateDto`: DTO cập nhật menu
  * `MenuItemDto`: DTO mục menu
  * `UserFavoriteMenuDto`: DTO menu yêu thích của người dùng

* DTO liên quan đến quản lý gói
  * `PackageDto`: DTO gói
  * `PackageCreateDto`: DTO tạo gói
  * `PackageUpdateDto`: DTO cập nhật gói
  * `PackageBlobDto`: DTO tệp gói

## Định nghĩa quyền

```json
{
  "Platform": {
    "Default": "Quản lý nền tảng",
    "DataDictionary": {
      "Default": "Quản lý từ điển dữ liệu",
      "Create": "Tạo",
      "Update": "Cập nhật",
      "Delete": "Xóa"
    },
    "Menu": {
      "Default": "Quản lý menu",
      "Create": "Tạo",
      "Update": "Cập nhật",
      "Delete": "Xóa"
    },
    "Package": {
      "Default": "Quản lý gói",
      "Create": "Tạo",
      "Update": "Cập nhật",
      "Delete": "Xóa"
    }
  }
}
```

## Thêm nữa

Xem thêm thông tin tại [Platform](../README.md)
