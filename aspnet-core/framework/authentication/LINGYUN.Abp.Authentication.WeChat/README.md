# LINGYUN.Abp.Authentication.WeChat

Mô-đun xác thực tài khoản công khai WeChat, tích hợp chức năng đăng nhập bằng tài khoản công khai WeChat vào ứng dụng ABP.

## Tính năng

* Xác thực OAuth2.0 tài khoản công khai WeChat
* Hỗ trợ lấy thông tin cơ bản của người dùng WeChat (biệt danh, giới tính, khu vực, ảnh đại diện, v.v.)
* Hỗ trợ cơ chế UnionId, liên thông hệ thống tài khoản giữa tài khoản công khai và mini program
* Hỗ trợ xác minh tin nhắn từ máy chủ WeChat
* Hỗ trợ tích hợp với hệ thống danh tính ABP

## Tham chiếu mô-đun

```csharp
[DependsOn(typeof(AbpAuthenticationWeChatModule))]
public class YouProjectModule : AbpModule
{
  // other
}
```

## Mục cấu hình

```json
{
  "Authentication": {
    "WeChat": {
      "AppId": "AppId tài khoản công khai WeChat của bạn",
      "AppSecret": "AppSecret tài khoản công khai WeChat của bạn",
      "ClaimsIssuer": "WeChat", // Tùy chọn, mặc định là WeChat
      "CallbackPath": "/signin-wechat", // Tùy chọn, mặc định là /signin-wechat
      "Scope": ["snsapi_login", "snsapi_userinfo"], // Tùy chọn, mặc định bao gồm snsapi_login và snsapi_userinfo
      "QrConnect": {
        "Enabled": false, // Có bật đăng nhập quét mã trên PC hay không
        "Endpoint": "https://open.weixin.qq.com/connect/qrconnect" // Địa chỉ đăng nhập quét mã trên PC
      }
    }
  }
}
```

## Cách dùng cơ bản

1. Cấu hình tham số tài khoản công khai WeChat
   * Đăng ký tài khoản công khai trên nền tảng công khai WeChat để lấy AppId và AppSecret
   * Cấu hình AppId và AppSecret trong appsettings.json

2. Thêm đăng nhập WeChat
   ```csharp
   public override void ConfigureServices(ServiceConfigurationContext context)
   {
       context.Services.AddAuthentication()
           .AddWeChat(); // Thêm hỗ trợ đăng nhập WeChat
   }
   ```

3. Bật xác minh tin nhắn máy chủ WeChat (tùy chọn)
   ```csharp
   public void Configure(IApplicationBuilder app)
   {
       app.UseWeChatSignature(); // Bật middleware xác minh tin nhắn máy chủ WeChat
   }
   ```

## Thông tin người dùng lấy được

* OpenId - Định danh duy nhất của người dùng WeChat
* UnionId - Định danh duy nhất trên nền tảng mở WeChat (cần liên kết nền tảng mở)
* NickName - Biệt danh người dùng
* Sex - Giới tính người dùng
* Country - Quốc gia
* Province - Tỉnh
* City - Thành phố
* AvatarUrl - URL ảnh đại diện người dùng
* Privilege - Thông tin đặc quyền người dùng

## Thông tin thêm

* [Tài liệu phát triển nền tảng công khai WeChat](https://developers.weixin.qq.com/doc/offiaccount/Getting_Started/Overview.html)
* [Tài liệu xác thực ABP](https://docs.abp.io/en/abp/latest/Authentication)
