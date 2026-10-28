# LINGYUN.Abp.LocalizationManagement.Domain

Mô-đun tầng miền quản lý bản địa hóa, triển khai chức năng lưu trữ và quản lý tài nguyên bản địa hóa động。

## Tính năng

* Triển khai giao diện `ILocalizationStore`, cung cấp chức năng lưu trữ và truy xuất tài nguyên bản địa hóa
* Hỗ trợ quản lý ngôn ngữ (thêm, xóa, sửa, truy vấn)
* Hỗ trợ quản lý tài nguyên (thêm, xóa, sửa, truy vấn)
* Hỗ trợ quản lý văn bản (thêm, xóa, sửa, truy vấn)
* Hỗ trợ bộ nhớ đệm trong bộ nhớ cho tài nguyên bản địa hóa
* Hỗ trợ đồng bộ bộ nhớ đệm phân tán

## Tham chiếu mô-đun

```csharp
[DependsOn(typeof(AbpLocalizationManagementDomainModule))]
public class YouProjectModule : AbpModule
{
  // other
}
```

## Mục cấu hình

```json
{
  "LocalizationManagement": {
    "LocalizationCacheStampTimeOut": "00:02:00",  // Thời gian chờ dấu thời gian bộ nhớ đệm bản địa hóa, mặc định 2 phút
    "LocalizationCacheStampExpiration": "00:30:00" // Thời gian hết hạn bộ nhớ đệm bản địa hóa, mặc định 30 phút
  }
}
```

## Dịch vụ miền

* `LanguageManager`: Dịch vụ quản lý ngôn ngữ, cung cấp chức năng tạo, cập nhật, xóa ngôn ngữ, v.v.
* `ResourceManager`: Dịch vụ quản lý tài nguyên, cung cấp chức năng tạo, cập nhật, xóa tài nguyên, v.v.
* `TextManager`: Dịch vụ quản lý văn bản, cung cấp chức năng tạo, cập nhật, xóa văn bản, v.v.
* `LocalizationStore`: Dịch vụ lưu trữ bản địa hóa, triển khai giao diện `ILocalizationStore`
* `LocalizationStoreInMemoryCache`: Dịch vụ bộ nhớ đệm trong bộ nhớ cho tài nguyên bản địa hóa

## Thông tin thêm

* [English documentation](./README.EN.md)
