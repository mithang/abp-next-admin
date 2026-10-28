# LINGYUN.Abp.SettingManagement.Application.Contracts

## Mô tả mô-đun

Mô-đun hợp đồng dịch vụ ứng dụng quản lý cài đặt, cung cấp định nghĩa giao diện và DTO liên quan đến quản lý cài đặt.

### Mô-đun cơ sở  

* Volo.Abp.SettingManagement.Application.Contracts
* Volo.Abp.Ddd.Application.Contracts

### Định nghĩa chức năng  

* Cung cấp định nghĩa giao diện dịch vụ ứng dụng quản lý cài đặt
  * ISettingAppService - Dịch vụ quản lý cài đặt chung
  * IUserSettingAppService - Dịch vụ quản lý cài đặt người dùng
  * IReadonlySettingAppService - Dịch vụ cài đặt chỉ đọc
* Cung cấp định nghĩa DTO liên quan đến cài đặt
  * SettingGroupDto - DTO nhóm cài đặt
  * SettingDto - DTO cài đặt
  * SettingDetailsDto - DTO chi tiết cài đặt
  * UpdateSettingDto - DTO cập nhật cài đặt
* Cung cấp định nghĩa quyền liên quan đến quản lý cài đặt

### Định nghĩa quyền

* SettingManagement.ManageHostFeatures - Quản lý tính năng máy chủ
* SettingManagement.ManageFeatures - Quản lý tính năng
* SettingManagement.Settings - Quản lý cài đặt
* SettingManagement.Settings.Update - Cập nhật cài đặt
* SettingManagement.Settings.ManageGroup - Quản lý nhóm cài đặt

### Định nghĩa cấu hình  

* SettingManagementMergeOptions
  * EnableCustomize - Có bật cài đặt tùy chỉnh hay không
  * EnableHost - Có bật cài đặt máy chủ hay không
  * EnableTenant - Có bật cài đặt tenant hay không
  * EnableUser - Có bật cài đặt người dùng hay không

### Cách sử dụng

1. Thêm phụ thuộc `AbpSettingManagementApplicationContractsModule`

```csharp
[DependsOn(typeof(AbpSettingManagementApplicationContractsModule))]
public class YouProjectModule : AbpModule
{
}
```

2. Tiêm và sử dụng dịch vụ cài đặt

```csharp
public class YourService
{
    private readonly ISettingAppService _settingAppService;

    public YourService(ISettingAppService settingAppService)
    {
        _settingAppService = settingAppService;
    }

    public async Task ManageSettingsAsync()
    {
        // Lấy nhóm cài đặt
        var groups = await _settingAppService.GetAllGroupsAsync();
        
        // Cập nhật cài đặt
        await _settingAppService.UpdateAsync("GroupName", new UpdateSettingsDto
        {
            Settings = new List<UpdateSettingDto>
            {
                new UpdateSettingDto
                {
                    Name = "SettingName",
                    Value = "NewValue"
                }
            }
        });
    }
}
```

[Quay lại thư mục](../../../README.md)
