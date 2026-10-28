# LINGYUN.Abp.Authentication.QQ

Module xác thực QQ Connect, tích hợp chức năng đăng nhập QQ vào ứng dụng ABP.

## Tính năng

* Xác thực QQ OAuth2.0
* Hỗ trợ đăng nhập trên thiết bị di động và PC
* Lấy thông tin cơ bản của người dùng QQ (biệt danh, giới tính, ảnh đại diện, v.v.)
* Hỗ trợ tích hợp với hệ thống danh tính ABP

## Tham chiếu module

```csharp
[DependsOn(typeof(AbpAuthenticationQQModule))]
public class YouProjectModule : AbpModule
{
  // other
}
```

## Mục cấu hình

```json
{
  "Authentication": {
    "QQ": {
      "AppId": "AppId QQ Connect của bạn",
      "AppKey": "AppKey QQ Connect của bạn",
      "IsMobile": false, // Có bật trang đăng nhập trên thiết bị di động hay không
      "ClaimsIssuer": "connect.qq.com", // Tùy chọn, mặc định là connect.qq.com
      "CallbackPath": "/signin-qq", // Tùy chọn, mặc định là /signin-qq
      "Scope": ["get_user_info"] // Tùy chọn, mặc định là get_user_info
    }
  }
}
```

## Cách dùng cơ bản

1. Cấu hình tham số QQ Connect
   * Đăng ký ứng dụng trên nền tảng QQ Connect, lấy AppId và AppKey
   * Cấu hình AppId và AppKey trong appsettings.json

2. Thêm đăng nhập QQ
   ```csharp
   public override void ConfigureServices(ServiceConfigurationContext context)
   {
       context.Services.AddAuthentication()
           .AddQQConnect(); // Thêm hỗ trợ đăng nhập QQ
   }
   ```

## Thông tin người dùng lấy được

* OpenId - Định danh duy nhất của người dùng QQ
* NickName - Biệt danh người dùng
* Gender - Giới tính người dùng
* AvatarUrl - URL ảnh đại diện người dùng

## Thông tin thêm

* [Tài liệu QQ Connect](https://wiki.connect.qq.com/)
* [Tài liệu xác thực ABP](https://docs.abp.io/en/abp/latest/Authentication)
