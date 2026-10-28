# LINGYUN.Abp.Tencent.SettingManagement

Mô-đun quản lý cấu hình dịch vụ Tencent Cloud, cung cấp giao diện quản lý cấu hình và API cho các dịch vụ Tencent Cloud.

## Tính năng

* Cung cấp giao diện quản lý cấu hình cho các dịch vụ Tencent Cloud
* Hỗ trợ quản lý cấu hình ở cấp toàn cục và cấp tenant
* Hỗ trợ cấu hình cho các dịch vụ Tencent Cloud sau:
  * Cấu hình cơ bản (khóa bí mật, vùng, v.v.)
  * Cấu hình kết nối (phương thức HTTP, thời gian chờ, proxy, v.v.)
  * Cấu hình dịch vụ SMS (ID ứng dụng, chữ ký mặc định, mẫu mặc định, v.v.)
  * Cấu hình QQ Connect (ID ứng dụng, khóa ứng dụng, v.v.)
* Quản lý quyền tích hợp sẵn
* Hỗ trợ bản địa hóa đa ngôn ngữ
* Hỗ trợ cấu hình cho mọi vùng khả dụng của Tencent Cloud

## Quyền

* `TencentCloud` - Nhóm quyền dịch vụ Tencent Cloud
  * `TencentCloud.Settings` - Quyền cấu hình dịch vụ Tencent Cloud

## API

### Lấy cấu hình toàn cục

```http
GET /api/setting-management/tencent/by-global
```

### Lấy cấu hình của tenant hiện tại

```http
GET /api/setting-management/tencent/by-current-tenant
```

## Cách dùng cơ bản

1. Thêm phụ thuộc mô-đun
```csharp
[DependsOn(typeof(AbpTencentCloudSettingManagementModule))]
public class YourModule : AbpModule
{
    // ...
}
```

2. Cấp quyền cấu hình
```csharp
public override void ConfigureServices(ServiceConfigurationContext context)
{
    Configure<AbpPermissionOptions>(options =>
    {
        options.GrantByDefault(TencentCloudSettingPermissionNames.Settings);
    });
}
```

## Mô tả các mục cấu hình

### Cấu hình cơ bản

```json
{
  "Settings": {
    "Abp.TencentCloud": {
      "EndPoint": "ap-guangzhou", // Vùng đặt tài nguyên, mặc định là Quảng Châu
      "SecretId": "SecretId Tencent Cloud của bạn", // Lấy từ bảng điều khiển Tencent Cloud
      "SecretKey": "SecretKey Tencent Cloud của bạn", // Lấy từ bảng điều khiển Tencent Cloud
      "DurationSecond": "600" // Thời lượng phiên, tính bằng giây
    }
  }
}
```

### Cấu hình kết nối

```json
{
  "Settings": {
    "Abp.TencentCloud.Connection": {
      "HttpMethod": "POST", // Phương thức yêu cầu, mặc định là POST
      "Timeout": "60", // Thời gian chờ kết nối, tính bằng giây
      "WebProxy": "", // Địa chỉ máy chủ proxy, tùy chọn
      "EndPoint": "" // Tên miền của dịch vụ cụ thể, ví dụ dịch vụ khu vực tài chính cần chỉ định
    }
  }
}
```

### Cấu hình dịch vụ SMS

```json
{
  "Settings": {
    "Abp.TencentCloud.Sms": {
      "AppId": "", // ID ứng dụng SMS, được tạo sau khi thêm ứng dụng trong bảng điều khiển SMS
      "DefaultSignName": "", // Chữ ký SMS mặc định
      "DefaultTemplateId": "" // ID mẫu SMS mặc định
    }
  }
}
```

### Cấu hình QQ Connect

```json
{
  "Settings": {
    "Abp.TencentCloud.QQConnect": {
      "AppId": "", // ID ứng dụng QQ Connect, lấy từ trung tâm quản lý QQ Connect
      "AppKey": "", // Khóa ứng dụng QQ Connect, lấy từ trung tâm quản lý QQ Connect
      "IsMobile": "false" // Có sử dụng kiểu giao diện di động hay không, mặc định là kiểu giao diện PC
    }
  }
}
```

## Các vùng khả dụng

Mô-đun hỗ trợ các vùng Tencent Cloud sau:

* Khu vực Trung Quốc
  * Khu vực Hoa Bắc (Bắc Kinh) - ap-beijing
  * Khu vực Tây Nam (Thành Đô) - ap-chengdu
  * Khu vực Tây Nam (Trùng Khánh) - ap-chongqing
  * Khu vực Hoa Nam (Quảng Châu) - ap-guangzhou
  * Khu vực Hồng Kông, Ma Cao và Đài Loan (Hồng Kông, Trung Quốc) - ap-hongkong
  * Khu vực Hoa Đông (Nam Kinh) - ap-nanjing
  * Khu vực Hoa Đông (Thượng Hải) - ap-shanghai
  * Khu vực Hoa Đông (Thượng Hải tài chính) - ap-shanghai-fsi
  * Khu vực Hoa Nam (Thâm Quyến tài chính) - ap-shenzhen-fsi

* Khu vực Châu Á - Thái Bình Dương
  * Băng Cốc - ap-bangkok
  * Jakarta - ap-jakarta
  * Mumbai - ap-mumbai
  * Seoul - ap-seoul
  * Singapore - ap-singapore
  * Tokyo - ap-tokyo

* Khu vực Châu Âu
  * Frankfurt - eu-frankfurt
  * Moskva - eu-moscow

* Khu vực Bắc Mỹ
  * Virginia - na-ashburn
  * Thung lũng Silicon - na-siliconvalley
  * Toronto - na-toronto

## Tài liệu khác

* [Quản lý khóa API Tencent Cloud](https://console.cloud.tencent.com/cam/capi)
* [Vùng và vùng khả dụng của Tencent Cloud](https://cloud.tencent.com/document/product/213/6091)

[English](./README.EN.md)
