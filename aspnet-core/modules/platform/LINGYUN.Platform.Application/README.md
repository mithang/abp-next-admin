# LINGYUN.Platform.Application

Lớp triển khai dịch vụ ứng dụng của module quản lý nền tảng, triển khai mọi chức năng do giao diện dịch vụ ứng dụng định nghĩa.

## Tính năng

* Dịch vụ menu yêu thích của người dùng
  * Tạo menu yêu thích
  * Cập nhật menu yêu thích
  * Xóa menu yêu thích
  * Truy vấn danh sách menu yêu thích
  * Quản lý menu yêu thích của người dùng khác

* Cấu hình ánh xạ đối tượng
  * Ánh xạ tự động từ thực thể sang DTO
  * Hỗ trợ quy tắc ánh xạ tùy chỉnh
  * Hỗ trợ ánh xạ thuộc tính bổ sung

* Xác thực quyền
  * Xác thực quyền dựa trên chính sách
  * Tích hợp hệ thống ủy quyền ABP
  * Kiểm soát quyền chi tiết

## Tham chiếu module

```csharp
[DependsOn(typeof(PlatformApplicationModule))]
public class YouProjectModule : AbpModule
{
  // other
}
```

## Triển khai dịch vụ ứng dụng

* `UserFavoriteMenuAppService`: Triển khai dịch vụ menu yêu thích của người dùng
  * Hỗ trợ người dùng tùy chỉnh biểu tượng menu
  * Hỗ trợ người dùng tùy chỉnh màu menu
  * Hỗ trợ người dùng tùy chỉnh tên hiển thị (alias) của menu
  * Hỗ trợ quản lý menu đa framework

## Ánh xạ đối tượng

```csharp
public class PlatformApplicationMappingProfile : Profile
{
    public PlatformApplicationMappingProfile()
    {
        CreateMap<PackageBlob, PackageBlobDto>();
        CreateMap<Package, PackageDto>();
        CreateMap<DataItem, DataItemDto>();
        CreateMap<Data, DataDto>();
        CreateMap<Menu, MenuDto>();
        CreateMap<Layout, LayoutDto>();
        CreateMap<UserFavoriteMenu, UserFavoriteMenuDto>();
    }
}
```

## Dịch vụ cơ sở

* `PlatformApplicationServiceBase`: Lớp cơ sở của dịch vụ ứng dụng quản lý nền tảng
  * Cung cấp chức năng chung và phương thức hỗ trợ
  * Xử lý ngoại lệ thống nhất
  * Xác thực quyền thống nhất

## Thêm nữa

Xem thêm thông tin tại [Platform](../README.md)
