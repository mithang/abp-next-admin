# LINGYUN.Abp.SettingManagement.HttpApi

## Mô tả mô-đun

Mô-đun HTTP API quản lý cài đặt, cung cấp giao diện API RESTful quản lý cài đặt.

### Mô-đun cơ sở

* LINGYUN.Abp.SettingManagement.Application.Contracts
* Volo.Abp.AspNetCore.Mvc

### Định nghĩa chức năng

* Cung cấp bộ điều khiển API quản lý cài đặt
  * SettingController - Bộ điều khiển quản lý cài đặt chung
  * UserSettingController - Bộ điều khiển quản lý cài đặt người dùng
  * SettingDefinitionController - Bộ điều khiển quản lý định nghĩa cài đặt

### Giao diện API

* /api/setting-management/settings
  * GET /by-global - Lấy cài đặt toàn cục
  * GET /by-tenant - Lấy cài đặt tenant
  * GET /by-user - Lấy cài đặt người dùng
  * GET /groups - Lấy tất cả nhóm cài đặt
  * PUT /{providerName}/{providerKey} - Cập nhật cài đặt
* /api/setting-management/users
  * GET - Lấy cài đặt người dùng
  * PUT - Cập nhật cài đặt người dùng
  * DELETE - Xóa cài đặt người dùng
* /api/setting-management/definitions
  * GET - Lấy danh sách định nghĩa cài đặt
  * POST - Tạo định nghĩa cài đặt
  * PUT - Cập nhật định nghĩa cài đặt
  * DELETE - Xóa định nghĩa cài đặt
  * GET /{name} - Lấy định nghĩa cài đặt chỉ định

### Yêu cầu quyền

* SettingManagement.Settings
  * Update - Cập nhật cài đặt
  * ManageGroup - Quản lý nhóm cài đặt
* SettingManagement.ManageFeatures
  * ManageHostFeatures - Quản lý tính năng máy chủ

### Cách sử dụng

1. Thêm phụ thuộc `AbpSettingManagementHttpApiModule`

```csharp
[DependsOn(typeof(AbpSettingManagementHttpApiModule))]
public class YouProjectModule : AbpModule
{
}
```

2. Sử dụng giao diện API

```csharp
public class YourService
{
    private readonly HttpClient _httpClient;

    public YourService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task ManageSettingsAsync()
    {
        // Lấy cài đặt toàn cục
        var response = await _httpClient.GetAsync("/api/setting-management/settings/by-global");
        var settings = await response.Content.ReadFromJsonAsync<ListResultDto<SettingGroupDto>>();

        // Cập nhật cài đặt người dùng
        await _httpClient.PutAsJsonAsync("/api/setting-management/users", new UpdateSettingDto
        {
            Name = "SettingName",
            Value = "NewValue"
        });
    }
}
```

[Xem bản tiếng Anh](README.EN.md)
