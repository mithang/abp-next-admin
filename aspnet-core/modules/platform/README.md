# LINGYUN.Platform

Mô-đun quản lý nền tảng, cung cấp một bộ đầy đủ các chức năng quản lý nền tảng, bao gồm quản lý menu, quản lý bố cục, từ điển dữ liệu, quản lý gói, v.v.

## Tính năng

* Quản lý menu
  * Cấu trúc menu đa cấp
  * Tùy chỉnh menu người dùng
  * Quyền menu theo vai trò
  * Chức năng menu yêu thích
  * Menu động tạo sẵn

* Quản lý bố cục
  * Thực thể chế độ xem bố cục
  * Liên kết dữ liệu bố cục
  * Hỗ trợ đa khung

* Từ điển dữ liệu
  * Quản lý từ điển dữ liệu
  * Quản lý mục từ điển dữ liệu
  * Dữ liệu seed từ điển dữ liệu

* Quản lý gói
  * Kiểm soát phiên bản gói
  * Quản lý tệp gói
  * Tích hợp lưu trữ Blob
  * Quy tắc lọc gói

* Tích hợp VueVbenAdmin
  * Cài đặt giao diện
  * Cài đặt bố cục
  * Cài đặt menu
  * Cài đặt thanh tiêu đề
  * Cài đặt nhiều tab

## Cấu trúc dự án

* `LINGYUN.Platform.Domain.Shared`: Tầng miền dùng chung
* `LINGYUN.Platform.Domain`: Tầng miền
* `LINGYUN.Platform.EntityFrameworkCore`: Tầng truy cập dữ liệu
* `LINGYUN.Platform.Application.Contracts`: Tầng hợp đồng dịch vụ ứng dụng
* `LINGYUN.Platform.Application`: Tầng triển khai dịch vụ ứng dụng
* `LINGYUN.Platform.HttpApi`: Tầng HTTP API
* `LINGYUN.Platform.HttpApi.Client`: Tầng proxy HTTP API
* `LINGYUN.Platform.Settings.VueVbenAdmin`: Mô-đun cài đặt khung frontend VueVbenAdmin

## Bắt đầu nhanh

1. Tham chiếu mô-đun
```csharp
[DependsOn(
    typeof(PlatformDomainModule),
    typeof(PlatformApplicationModule),
    typeof(PlatformHttpApiModule),
    typeof(PlatformSettingsVueVbenAdminModule)
)]
public class YouProjectModule : AbpModule
{
    // other
}
```

2. Cấu hình cơ sở dữ liệu
```json
{
  "ConnectionStrings": {
    "Platform": "Server=localhost;Database=Platform;Trusted_Connection=True"
  }
}
```

3. Cập nhật cơ sở dữ liệu
```bash
dotnet ef database update
```

## Lưu ý

1. Quản lý menu động
   * Mô-đun mặc định đã khởi tạo sẵn các menu liên quan đến vue-admin
   * Có thể tạo sẵn dữ liệu menu qua giao diện `IDataSeedContributor`
   * Bố cục (path) và menu (component) không cần thêm tiền tố @/

2. Di trú cơ sở dữ liệu
   * Hãy thực hiện di trú cơ sở dữ liệu trước khi chạy dịch vụ nền tảng
   * Sử dụng lệnh `dotnet ef database update` để cập nhật cấu trúc cơ sở dữ liệu

## Thông tin thêm

* [Tầng miền dùng chung](./LINGYUN.Platform.Domain.Shared/README.md)
* [Tầng miền](./LINGYUN.Platform.Domain/README.md)
* [Tầng truy cập dữ liệu](./LINGYUN.Platform.EntityFrameworkCore/README.md)
* [Tầng hợp đồng dịch vụ ứng dụng](./LINGYUN.Platform.Application.Contracts/README.md)
* [Tầng triển khai dịch vụ ứng dụng](./LINGYUN.Platform.Application/README.md)
* [Tầng HTTP API](./LINGYUN.Platform.HttpApi/README.md)
* [Mô-đun cài đặt VueVbenAdmin](./LINGYUN.Platform.Settings.VueVbenAdmin/README.md)
