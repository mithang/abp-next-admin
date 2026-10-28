# LINGYUN.Abp.Authentication - Mô-đun xác thực

Mô-đun này cung cấp chức năng xác thực đăng nhập mạng xã hội của bên thứ ba, hiện hỗ trợ đăng nhập QQ và tài khoản công khai WeChat, đồng thời tích hợp sâu với hệ thống danh tính ABP.

## Tổng quan mô-đun

Mô-đun xác thực gồm hai mô-đun con chính:

1. **Mô-đun xác thực QQ Connect**

   - Hỗ trợ xác thực QQ OAuth2.0
   - Phù hợp đăng nhập trên thiết bị di động và PC
   - Lấy thông tin cơ bản của người dùng (biệt danh, giới tính, ảnh đại diện, v.v.)

2. **Mô-đun xác thực tài khoản công khai WeChat**
   - Hỗ trợ xác thực tài khoản công khai WeChat OAuth2.0
   - Lấy thông tin chi tiết của người dùng (biệt danh, giới tính, khu vực, ảnh đại diện, v.v.)
   - Hỗ trợ cơ chế UnionId, liên thông hệ thống tài khoản giữa tài khoản công khai và chương trình mini

## Tính năng

- Đăng nhập bằng tài khoản mạng xã hội của bên thứ ba
- Lấy thông tin cơ bản của người dùng
- Tích hợp liền mạch với hệ thống danh tính ABP
- Tùy chọn cấu hình linh hoạt
- Hỗ trợ nhiều kịch bản đăng nhập (thiết bị di động, PC)

## Bắt đầu nhanh

### Tham chiếu mô-đun

```csharp
[DependsOn(
    typeof(AbpAuthenticationQQModule),
    typeof(AbpAuthenticationWeChatModule)
)]
public class YourProjectModule : AbpModule
{
    // Các cấu hình khác
}
```

### Ví dụ cấu hình

Cấu hình tham số đăng nhập của bên thứ ba trong `appsettings.json`:

```json
{
  "Authentication": {
    "QQ": {
      "AppId": "AppId QQ Connect của bạn",
      "AppKey": "AppKey QQ Connect của bạn"
    },
    "WeChat": {
      "AppId": "AppId tài khoản công khai WeChat của bạn",
      "AppSecret": "AppSecret tài khoản công khai WeChat của bạn"
    }
  }
}
```

### Thêm hỗ trợ đăng nhập

```csharp
public override void ConfigureServices(ServiceConfigurationContext context)
{
    context.Services.AddAuthentication()
        .AddQQConnect()   // Thêm đăng nhập QQ
        .AddWeChat();     // Thêm đăng nhập WeChat
}
```

## Thông tin người dùng được hỗ trợ

### Thông tin lấy được khi đăng nhập QQ

- OpenId - Định danh duy nhất của người dùng QQ
- NickName - Biệt danh của người dùng
- Gender - Giới tính của người dùng
- AvatarUrl - URL ảnh đại diện của người dùng

### Thông tin lấy được khi đăng nhập WeChat

- OpenId - Định danh duy nhất của người dùng WeChat
- UnionId - Định danh duy nhất trên nền tảng mở WeChat
- NickName - Biệt danh của người dùng
- Sex - Giới tính của người dùng
- Country, Province, City - Thông tin địa lý
- AvatarUrl - URL ảnh đại diện của người dùng

## Tài liệu tham khảo

- [Tài liệu QQ Connect](https://wiki.connect.qq.com/)
- [Tài liệu phát triển nền tảng tài khoản công khai WeChat](https://developers.weixin.qq.com/doc/offiaccount/Getting_Started/Overview.html)
- [Tài liệu xác thực ABP](https://docs.abp.io/en/abp/latest/Authentication)

## Giấy phép

Tuân theo giấy phép mã nguồn mở của dự án
