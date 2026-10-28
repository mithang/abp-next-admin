# LINGYUN.Abp.SettingManagement.Application

## Mô tả module

Module dịch vụ ứng dụng quản lý cài đặt, triển khai logic nghiệp vụ liên quan đến quản lý cài đặt.

### Module cơ sở

* LINGYUN.Abp.SettingManagement.Application.Contracts
* Volo.Abp.SettingManagement.Application
* Volo.Abp.Ddd.Application

### Định nghĩa chức năng

* Cung cấp phần triển khai dịch vụ ứng dụng quản lý cài đặt
  * SettingAppService - Phần triển khai dịch vụ quản lý cài đặt chung
  * UserSettingAppService - Phần triển khai dịch vụ quản lý cài đặt người dùng
  * SettingDefinitionAppService - Phần triển khai dịch vụ quản lý định nghĩa cài đặt
* Triển khai các giao diện dịch vụ ứng dụng sau
  * ISettingAppService
  * IUserSettingAppService
  * ISettingDefinitionAppService
* Cung cấp quản lý bộ nhớ đệm cài đặt
  * DynamicSettingDefinitionStoreCacheInvalidator - Xử lý vô hiệu hóa bộ nhớ đệm của kho định nghĩa cài đặt động

### Dịch vụ ứng dụng

* SettingAppService
  * GetAllForGlobalAsync - Lấy cài đặt toàn cục
  * GetAllForTenantAsync - Lấy cài đặt tenant
  * GetAllForUserAsync - Lấy cài đặt người dùng
  * GetAllGroupsAsync - Lấy tất cả nhóm cài đặt
  * UpdateAsync - Cập nhật cài đặt
* UserSettingAppService
  * GetAsync - Lấy cài đặt người dùng
  * UpdateAsync - Cập nhật cài đặt người dùng
  * DeleteAsync - Xóa cài đặt người dùng
* SettingDefinitionAppService
  * GetAsync - Lấy định nghĩa cài đặt
  * GetListAsync - Lấy danh sách định nghĩa cài đặt
  * CreateAsync - Tạo định nghĩa cài đặt
  * UpdateAsync - Cập nhật định nghĩa cài đặt
  * DeleteAsync - Xóa định nghĩa cài đặt

### Mã lỗi

* SettingManagement:010001 - Tên định nghĩa cài đặt đã tồn tại
* SettingManagement:010002 - Định nghĩa cài đặt không tồn tại
* SettingManagement:010003 - Định nghĩa cài đặt là tĩnh, không cho phép sửa đổi
* SettingManagement:010004 - Định nghĩa cài đặt là tĩnh, không cho phép xóa

### Cách sử dụng

1. Thêm phụ thuộc `AbpSettingManagementApplicationModule`

```csharp
[DependsOn(typeof(AbpSettingManagementApplicationModule))]
public class YouProjectModule : AbpModule
{
}
```

2. Tiêm và sử dụng dịch vụ cài đặt

```csharp
public class YourService
{
    private readonly ISettingAppService _settingAppService;
    private readonly IUserSettingAppService _userSettingAppService;

    public YourService(
        ISettingAppService settingAppService,
        IUserSettingAppService userSettingAppService)
    {
        _settingAppService = settingAppService;
        _userSettingAppService = userSettingAppService;
    }

    public async Task ManageSettingsAsync()
    {
        // Lấy cài đặt toàn cục
        var settings = await _settingAppService.GetAllForGlobalAsync();

        // Cập nhật cài đặt người dùng
        await _userSettingAppService.UpdateAsync(
            "SettingName",
            "NewValue");
    }
}
```

[Xem bản tiếng Anh](README.EN.md)
