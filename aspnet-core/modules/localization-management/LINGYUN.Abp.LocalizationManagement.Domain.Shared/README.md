# LINGYUN.Abp.LocalizationManagement.Domain.Shared

Mô-đun chia sẻ tầng lĩnh vực quản lý bản địa hóa, định nghĩa mã lỗi, tài nguyên bản địa hóa, hằng số và các nội dung chia sẻ khác.

## Tính năng

* Định nghĩa các hằng số liên quan đến quản lý bản địa hóa
* Định nghĩa mã lỗi bản địa hóa
* Cung cấp tệp tài nguyên bản địa hóa
* Hỗ trợ thông báo lỗi đa ngôn ngữ

## Tham chiếu mô-đun

```csharp
[DependsOn(typeof(AbpLocalizationManagementDomainSharedModule))]
public class YouProjectModule : AbpModule
{
  // other
}
```

## Mã lỗi

* Localization:001100 - Ngôn ngữ {CultureName} đã tồn tại
* Localization:001400 - Tên ngôn ngữ {CultureName} không tồn tại hoặc ngôn ngữ tích hợp sẵn không cho phép thao tác
* Localization:002100 - Tài nguyên {Name} đã tồn tại
* Localization:002400 - Tên tài nguyên {Name} không tồn tại hoặc tài nguyên tích hợp sẵn không cho phép thao tác

## Tài nguyên bản địa hóa

Mô-đun định nghĩa các tài nguyên bản địa hóa sau:

* DisplayName:Enable - Bật
* DisplayName:CreationTime - Thời gian tạo
* DisplayName:LastModificationTime - Thời gian sửa đổi
* DisplayName:SaveAndNext - Lưu và bước tiếp theo
* Permissions:LocalizationManagement - Quản lý bản địa hóa
* Permissions:Language - Quản lý ngôn ngữ
* Permissions:Resource - Quản lý tài nguyên
* Permissions:Text - Quản lý tài liệu
* v.v...

## Thêm thông tin

* [English documentation](./README.EN.md)
