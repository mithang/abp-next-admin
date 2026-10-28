# LINGYUN.Abp.WeChat.Official

Mô-đun tích hợp SDK tài khoản chính thức WeChat, cung cấp hỗ trợ chức năng cần thiết cho việc phát triển tài khoản chính thức WeChat.

## Tính năng

* Xác thực OAuth2.0 tài khoản chính thức WeChat
* Quản lý menu tùy chỉnh
* Gửi tin nhắn mẫu
* Quản lý tài nguyên
* Quản lý người dùng
* Tin nhắn dịch vụ khách hàng
* Tích hợp thanh toán WeChat
* Mã hóa/giải mã tin nhắn
* Xử lý sự kiện

## Tham chiếu mô-đun

```csharp
[DependsOn(typeof(AbpWeChatOfficialModule))]
public class YouProjectModule : AbpModule
{
  // other
}
```

## Mục cấu hình

```json
{
  "WeChat": {
    "Official": {
      "AppId": "",                // AppId tài khoản chính thức
      "AppSecret": "",           // AppSecret tài khoản chính thức
      "Token": "",               // Token tin nhắn tài khoản chính thức
      "EncodingAESKey": "",      // Khóa mã hóa tin nhắn tài khoản chính thức
      "IsSandBox": false,        // Có phải môi trường sandbox hay không
      "Url": ""                  // URL máy chủ tài khoản chính thức
    }
  }
}
```

#### Lưu ý

Trong cấu hình động có một vấn đề đã biết: https://github.com/abpframework/abp/issues/6318  
Vì vậy bắt buộc phải xây dựng lại một phương thức thay đổi động AbpWeChatOfficialOptions, vui lòng sử dụng AbpWeChatOfficialOptionsFactory.CreateAsync()

## Cấu hình Settings

* `WeChat.Official.AppId`: AppId tài khoản chính thức
* `WeChat.Official.AppSecret`: AppSecret tài khoản chính thức
* `WeChat.Official.Token`: Token tin nhắn tài khoản chính thức
* `WeChat.Official.EncodingAESKey`: Khóa mã hóa tin nhắn tài khoản chính thức
* `WeChat.Official.IsSandBox`: Có phải môi trường sandbox hay không
* `WeChat.Official.Url`: URL máy chủ tài khoản chính thức

## Tài liệu khác

* [Tài liệu mô-đun tài khoản chính thức WeChat](README.EN.md)
