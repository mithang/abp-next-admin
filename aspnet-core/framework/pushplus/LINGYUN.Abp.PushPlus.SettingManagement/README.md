# LINGYUN.Abp.PushPlus.SettingManagement

Mô-đun quản lý cài đặt PushPlus, cung cấp giao diện quản lý và API cho cấu hình PushPlus.

## Tính năng

* Cung cấp giao diện quản lý cấu hình PushPlus
* Hỗ trợ quản lý cấu hình toàn cục
* Hỗ trợ quản lý cấu hình tenant
* Hỗ trợ đa ngôn ngữ
* Tích hợp mô-đun quản lý cài đặt ABP

## Cài đặt

```bash
dotnet add package LINGYUN.Abp.PushPlus.SettingManagement
```

## Tham chiếu mô-đun

```csharp
[DependsOn(typeof(AbpPushPlusSettingManagementModule))]
public class YouProjectModule : AbpModule
{
  // other
}
```

## API

### Lấy cấu hình toàn cục

```http
GET /api/setting-management/push-plus/by-global
```

Ví dụ phản hồi:
```json
{
  "name": "PushPlus",
  "displayName": "Cấu hình PushPlus",
  "settings": [
    {
      "name": "PushPlus.Security.Token",
      "value": "your-token",
      "displayName": "Token",
      "description": "Token lấy từ nền tảng PushPlus"
    },
    {
      "name": "PushPlus.Security.SecretKey",
      "value": "your-secret",
      "displayName": "Khóa bí mật",
      "description": "Khóa bí mật lấy từ nền tảng PushPlus"
    }
  ]
}
```

### Lấy cấu hình tenant

```http
GET /api/setting-management/push-plus/by-current-tenant
```

Định dạng phản hồi giống cấu hình toàn cục.

## Quyền

* Abp.PushPlus.ManageSetting - Quyền quản lý cấu hình PushPlus

## Bản địa hóa

Mô-đun hỗ trợ các ngôn ngữ sau:
* Tiếng Trung giản thể
* Tiếng Anh

## Thông tin thêm

* [LINGYUN.Abp.PushPlus](../LINGYUN.Abp.PushPlus/README.md)
* [Quản lý cài đặt ABP](https://docs.abp.io/en/abp/latest/Settings)
