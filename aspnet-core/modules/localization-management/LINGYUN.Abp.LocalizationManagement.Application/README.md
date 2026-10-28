# LINGYUN.Abp.LocalizationManagement.Application

Mô-đun triển khai tầng dịch vụ ứng dụng quản lý bản địa hóa, cung cấp triển khai dịch vụ ứng dụng quản lý tài nguyên bản địa hóa.

## Tính năng

* Triển khai dịch vụ ứng dụng quản lý ngôn ngữ
* Triển khai dịch vụ ứng dụng quản lý tài nguyên
* Triển khai dịch vụ ứng dụng quản lý văn bản
* Hỗ trợ ánh xạ đối tượng AutoMapper
* Cung cấp thao tác CRUD chuẩn hóa

## Tham chiếu mô-đun

```csharp
[DependsOn(typeof(AbpLocalizationManagementApplicationModule))]
public class YouProjectModule : AbpModule
{
  // other
}
```

## Dịch vụ ứng dụng

* `LanguageAppService`: Dịch vụ ứng dụng quản lý ngôn ngữ
  - Tạo ngôn ngữ
  - Cập nhật ngôn ngữ
  - Xóa ngôn ngữ
  - Lấy danh sách ngôn ngữ
  - Lấy chi tiết ngôn ngữ

* `ResourceAppService`: Dịch vụ ứng dụng quản lý tài nguyên
  - Tạo tài nguyên
  - Cập nhật tài nguyên
  - Xóa tài nguyên
  - Lấy danh sách tài nguyên
  - Lấy chi tiết tài nguyên

* `TextAppService`: Dịch vụ ứng dụng quản lý văn bản
  - Tạo văn bản
  - Cập nhật văn bản
  - Xóa văn bản
  - Lấy danh sách văn bản
  - Lấy chi tiết văn bản

## Quyền

Tất cả dịch vụ ứng dụng đều tuân thủ yêu cầu quyền do mô-đun định nghĩa, xem định nghĩa quyền của mô-đun Domain.Shared.

## Thông tin thêm

* [English documentation](./README.EN.md)
