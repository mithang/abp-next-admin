# LINGYUN.Abp.WxPusher.SettingManagement

Mô-đun quản lý cài đặt WxPusher, cung cấp chức năng quản lý các cài đặt liên quan đến WxPusher.

[English](./README.EN.md)

## Tính năng

* Hỗ trợ quản lý cài đặt WxPusher
  * Quản lý AppToken
  * Quản lý cài đặt bảo mật
* Kiểm soát quyền
  * Dựa trên hệ thống quyền ABP
  * Quyền quản lý cài đặt chi tiết
* Hỗ trợ đa tenant
  * Hỗ trợ cài đặt toàn cục
  * Hỗ trợ cài đặt cấp tenant
* Hỗ trợ bản địa hóa
  * Hỗ trợ giao diện đa ngôn ngữ
  * Hỗ trợ mô tả cài đặt đã bản địa hóa

## Cài đặt

```bash
dotnet add package LINGYUN.Abp.WxPusher.SettingManagement
```

## Tham chiếu mô-đun

```csharp
[DependsOn(typeof(AbpWxPusherSettingManagementModule))]
public class YouProjectModule : AbpModule
{
    // other
}
```

## Cấu hình quyền

### 1. Định nghĩa quyền

* `WxPusher`: Nhóm quyền WxPusher
* `WxPusher.ManageSetting`: Quyền quản lý cài đặt WxPusher

### 2. Cấu hình ủy quyền

```csharp
public class YourAuthorizationProvider : AuthorizationProvider
{
    public override void Define(IAuthorizationDefinitionContext context)
    {
        var wxPusher = context.GetPermissionOrNull(WxPusherSettingPermissionNames.GroupName)
            ?? context.AddGroup(WxPusherSettingPermissionNames.GroupName);

        wxPusher.AddPermission(WxPusherSettingPermissionNames.ManageSetting);
    }
}
```

## Cách sử dụng

### 1. Lấy cài đặt

```csharp
public class YourService
{
    private readonly IWxPusherSettingAppService _wxPusherSettingAppService;

    public YourService(IWxPusherSettingAppService wxPusherSettingAppService)
    {
        _wxPusherSettingAppService = wxPusherSettingAppService;
    }

    public async Task GetSettingsAsync()
    {
        // Lấy cài đặt toàn cục
        var globalSettings = await _wxPusherSettingAppService.GetAllForGlobalAsync();

        // Lấy cài đặt tenant hiện tại
        var tenantSettings = await _wxPusherSettingAppService.GetAllForCurrentTenantAsync();
    }
}
```

### 2. Giao diện API

* `GET /api/setting-management/wxpusher/by-global`: Lấy cài đặt toàn cục
* `GET /api/setting-management/wxpusher/by-current-tenant`: Lấy cài đặt tenant hiện tại

## Lưu ý

1. Cần cấu hình quyền chính xác mới có thể quản lý cài đặt.
2. Các thông tin nhạy cảm như AppToken cần được bảo quản cẩn thận.
3. Trong môi trường đa tenant cần chú ý phạm vi tác dụng của cài đặt.

## Vị trí mã nguồn

[LINGYUN.Abp.WxPusher.SettingManagement](https://github.com/colinin/abp-next-admin/tree/master/aspnet-core/framework/wx-pusher/LINGYUN.Abp.WxPusher.SettingManagement)
