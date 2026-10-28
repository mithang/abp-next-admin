# LINGYUN.Abp.LocalizationManagement.Application.Contracts

Mô-đun hợp đồng tầng dịch vụ ứng dụng quản lý bản địa hóa, định nghĩa giao diện dịch vụ ứng dụng, đối tượng DTO và định nghĩa quyền của quản lý bản địa hóa.

## Tính năng

* Định nghĩa giao diện dịch vụ ứng dụng quản lý ngôn ngữ
* Định nghĩa giao diện dịch vụ ứng dụng quản lý tài nguyên
* Định nghĩa giao diện dịch vụ ứng dụng quản lý văn bản
* Định nghĩa quyền và phân quyền
* Cung cấp định nghĩa đối tượng DTO

## Tham chiếu mô-đun

```csharp
[DependsOn(typeof(AbpLocalizationManagementApplicationContractsModule))]
public class YouProjectModule : AbpModule
{
  // other
}
```

## Định nghĩa quyền

* LocalizationManagement.Resource - Đối tượng được ủy quyền có được phép truy cập tài nguyên hay không
* LocalizationManagement.Resource.Create - Đối tượng được ủy quyền có được phép tạo tài nguyên hay không
* LocalizationManagement.Resource.Update - Đối tượng được ủy quyền có được phép sửa tài nguyên hay không
* LocalizationManagement.Resource.Delete - Đối tượng được ủy quyền có được phép xóa tài nguyên hay không
* LocalizationManagement.Language - Đối tượng được ủy quyền có được phép truy cập ngôn ngữ hay không
* LocalizationManagement.Language.Create - Đối tượng được ủy quyền có được phép tạo ngôn ngữ hay không
* LocalizationManagement.Language.Update - Đối tượng được ủy quyền có được phép sửa ngôn ngữ hay không
* LocalizationManagement.Language.Delete - Đối tượng được ủy quyền có được phép xóa ngôn ngữ hay không
* LocalizationManagement.Text - Đối tượng được ủy quyền có được phép truy cập tài liệu hay không
* LocalizationManagement.Text.Create - Đối tượng được ủy quyền có được phép tạo tài liệu hay không
* LocalizationManagement.Text.Update - Đối tượng được ủy quyền có được phép sửa tài liệu hay không
* LocalizationManagement.Text.Delete - Đối tượng được ủy quyền có được phép xóa tài liệu hay không

## Giao diện dịch vụ ứng dụng

* `ILanguageAppService`: Giao diện dịch vụ ứng dụng quản lý ngôn ngữ
* `IResourceAppService`: Giao diện dịch vụ ứng dụng quản lý tài nguyên
* `ITextAppService`: Giao diện dịch vụ ứng dụng quản lý văn bản

## Thông tin thêm

* [English documentation](./README.EN.md)
