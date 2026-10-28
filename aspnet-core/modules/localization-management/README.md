# Localization Management

Mô-đun quản lý tài liệu bản địa hóa; vì đường dẫn dự án quá dài nên hệ thống Windows không hỗ trợ, thư mục dự án lấy tên viết tắt là lt

## Tính năng

* Hỗ trợ quản lý động tài nguyên bản địa hóa
* Hỗ trợ quản lý đa ngôn ngữ (thêm, xóa, sửa, tra cứu)
* Hỗ trợ quản lý tài nguyên (thêm, xóa, sửa, tra cứu)
* Hỗ trợ quản lý văn bản (thêm, xóa, sửa, tra cứu)
* Hỗ trợ bộ nhớ đệm trong bộ nhớ cho tài nguyên bản địa hóa
* Hỗ trợ đồng bộ bộ nhớ đệm phân tán
* Cung cấp giao diện RESTful API chuẩn
* Hỗ trợ tích hợp liền mạch với framework ABP

## Mô tả mô-đun

### Mô-đun cơ bản

* [LINGYUN.Abp.Localization.Persistence](../localization/LINGYUN.Abp.Localization.Persistence)					Mô-đun bền vững hóa bản địa hóa, triển khai giao diện IStaticLocalizationSaver để bền vững hóa tài nguyên tĩnh cục bộ vào cơ sở lưu trữ
* [LINGYUN.Abp.LocalizationManagement.Domain.Shared](./LINGYUN.Abp.LocalizationManagement.Domain.Shared)					Mô-đun dùng chung tầng miền, định nghĩa mã lỗi, bản địa hóa, cài đặt mô-đun
* [LINGYUN.Abp.LocalizationManagement.Domain](./LINGYUN.Abp.LocalizationManagement.Domain)								Mô-đun tầng miền, triển khai giao diện ILocalizationStore
* [LINGYUN.Abp.LocalizationManagement.EntityFrameworkCore](./LINGYUN.Abp.LocalizationManagement.EntityFrameworkCore)								Mô-đun tầng truy cập dữ liệu, tích hợp EfCore
* [LINGYUN.Abp.LocalizationManagement.Application.Contracts](./LINGYUN.Abp.LocalizationManagement.Application.Contracts)	Mô-đun dùng chung tầng dịch vụ ứng dụng, định nghĩa giao diện bên ngoài quản lý đối tượng bản địa hóa, quyền, chính sách giới hạn tính năng
* [LINGYUN.Abp.LocalizationManagement.Application](./LINGYUN.Abp.LocalizationManagement.Application)						Triển khai tầng dịch vụ ứng dụng, đã triển khai giao diện quản lý đối tượng bản địa hóa
* [LINGYUN.Abp.LocalizationManagement.HttpApi](./LINGYUN.Abp.LocalizationManagement.HttpApi)								Triển khai RestApi, đã triển khai giao diện RestApi độc lập ra bên ngoài

### Mô-đun cấp cao

Chưa có mô-đun cấp cao.

### Định nghĩa quyền

* LocalizationManagement.Resource						Đối tượng được ủy quyền có được phép truy cập tài nguyên hay không
* LocalizationManagement.Resource.Create		Đối tượng được ủy quyền có được phép tạo tài nguyên hay không
* LocalizationManagement.Resource.Update		Đối tượng được ủy quyền có được phép sửa tài nguyên hay không
* LocalizationManagement.Resource.Delete		Đối tượng được ủy quyền có được phép xóa tài nguyên hay không
* LocalizationManagement.Language						Đối tượng được ủy quyền có được phép truy cập ngôn ngữ hay không
* LocalizationManagement.Language.Create		Đối tượng được ủy quyền có được phép tạo ngôn ngữ hay không
* LocalizationManagement.Language.Update		Đối tượng được ủy quyền có được phép sửa ngôn ngữ hay không
* LocalizationManagement.Language.Delete		Đối tượng được ủy quyền có được phép xóa ngôn ngữ hay không
* LocalizationManagement.Text						    Đối tượng được ủy quyền có được phép truy cập tài liệu hay không
* LocalizationManagement.Text.Create				Đối tượng được ủy quyền có được phép tạo tài liệu hay không
* LocalizationManagement.Text.Update				Đối tượng được ủy quyền có được phép sửa tài liệu hay không
* LocalizationManagement.Text.Delete				Đối tượng được ủy quyền có được phép xóa tài liệu hay không

### Định nghĩa cấu hình

```json
{
  "LocalizationManagement": {
    "LocalizationCacheStampTimeOut": "00:02:00",  // Thời gian chờ của dấu thời gian bộ nhớ đệm bản địa hóa, mặc định 2 phút
    "LocalizationCacheStampExpiration": "00:30:00" // Thời gian hết hạn của bộ nhớ đệm bản địa hóa, mặc định 30 phút
  }
}
```

### Bảng cơ sở dữ liệu

Mô-đun này sử dụng các bảng cơ sở dữ liệu sau để lưu trữ dữ liệu bản địa hóa:

* Languages - Bảng ngôn ngữ
* Resources - Bảng tài nguyên
* Texts - Bảng văn bản

Có thể cấu hình tiền tố bảng và Schema thông qua `LocalizationModelBuilderConfigurationOptions`:

```csharp
public class LocalizationModelBuilderConfigurationOptions : AbpModelBuilderConfigurationOptions
{
    public LocalizationModelBuilderConfigurationOptions(
       string tablePrefix = "",
       string schema = null)
       : base(tablePrefix, schema)
    {
    }
}
```

### Giao diện API

Mô-đun này cung cấp các giao diện REST API sau:

* `/api/localization-management/languages` - API liên quan đến quản lý ngôn ngữ
* `/api/localization-management/resources` - API liên quan đến quản lý tài nguyên
* `/api/localization-management/texts` - API liên quan đến quản lý văn bản

## Mã lỗi

* Localization:001100 - Ngôn ngữ {CultureName} đã tồn tại
* Localization:001400 - Tên ngôn ngữ {CultureName} không tồn tại hoặc ngôn ngữ tích hợp sẵn không cho phép thao tác
* Localization:002100 - Tài nguyên {Name} đã tồn tại
* Localization:002400 - Tên tài nguyên {Name} không tồn tại hoặc tài nguyên tích hợp sẵn không cho phép thao tác

## Thông tin thêm

* [English documentation](./README.EN.md)

## Nhật ký cập nhật

### 2024.12
* Hoàn thiện tài liệu mô-đun
* Thêm hỗ trợ tài liệu tiếng Anh
