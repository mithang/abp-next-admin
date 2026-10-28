# LINGYUN.Platform.HttpApi

Lớp HTTP API của module quản lý nền tảng, cung cấp các API theo phong cách RESTful.

## Tính năng

* API quản lý menu
  * Lấy menu của người dùng hiện tại
  * Lấy danh sách menu của người dùng
  * Lấy danh sách menu của vai trò
  * Thao tác CRUD menu
  * Quản lý menu yêu thích của người dùng

* API quản lý bố cục
  * Thao tác CRUD bố cục
  * Lấy danh sách tất cả bố cục

* API từ điển dữ liệu
  * Thao tác CRUD từ điển dữ liệu
  * Quản lý mục từ điển dữ liệu

* API quản lý gói
  * Thao tác CRUD gói
  * Tải lên/tải xuống tệp gói
  * Lấy gói phiên bản mới nhất

## Tham chiếu module

```csharp
[DependsOn(typeof(PlatformHttpApiModule))]
public class YouProjectModule : AbpModule
{
  // other
}
```

## Bộ điều khiển API

* `MenuController`: Bộ điều khiển quản lý menu
  * `GET /api/platform/menus/by-current-user`: Lấy menu của người dùng hiện tại
  * `GET /api/platform/menus/by-user`: Lấy menu của người dùng được chỉ định
  * `GET /api/platform/menus/by-role`: Lấy menu của vai trò
  * `POST /api/platform/menus`: Tạo menu
  * `PUT /api/platform/menus/{id}`: Cập nhật menu
  * `DELETE /api/platform/menus/{id}`: Xóa menu

* `UserFavoriteMenuController`: Bộ điều khiển menu yêu thích của người dùng
  * `GET /api/platform/menus/favorites/my-favorite-menus`: Lấy menu yêu thích của tôi
  * `POST /api/platform/menus/favorites/my-favorite-menus`: Tạo menu yêu thích
  * `PUT /api/platform/menus/favorites/my-favorite-menus/{MenuId}`: Cập nhật menu yêu thích
  * `DELETE /api/platform/menus/favorites/my-favorite-menus`: Xóa menu yêu thích

* `PackageController`: Bộ điều khiển quản lý gói
  * `GET /api/platform/packages/{Name}/latest`: Lấy gói phiên bản mới nhất
  * `POST /api/platform/packages/{id}/blob`: Tải lên tệp gói
  * `GET /api/platform/packages/{id}/blob/{Name}`: Tải xuống tệp gói
  * `DELETE /api/platform/packages/{id}/blob/{Name}`: Xóa tệp gói

## Mục cấu hình

```json
{
  "App": {
    "CorsOrigins": "https://*.YourDomain.com,http://localhost:4200"
  }
}
```

## Thêm

Xem thêm thông tin tại [Platform](../README.md)
