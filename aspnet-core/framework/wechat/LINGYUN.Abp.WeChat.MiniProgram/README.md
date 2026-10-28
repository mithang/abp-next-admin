# LINGYUN.Abp.WeChat.MiniProgram

Mô-đun tích hợp SDK Mini Program WeChat, cung cấp hỗ trợ chức năng cần thiết cho việc phát triển Mini Program WeChat.

## Tính năng

* Xác thực đăng nhập Mini Program WeChat
* Tạo mã Mini Program
* Gửi tin nhắn đăng ký
* Thống kê dữ liệu Mini Program
* Phát trực tiếp Mini Program
* Tích hợp thanh toán Mini Program
* Tin nhắn dịch vụ thống nhất

## Tham chiếu mô-đun

```csharp
[DependsOn(typeof(AbpWeChatMiniProgramModule))]
public class YouProjectModule : AbpModule
{
  // other
}
```

## Các mục cấu hình

```json
{
  "WeChat": {
    "MiniProgram": {
      "AppId": "",                // AppId của Mini Program
      "AppSecret": "",           // AppSecret của Mini Program
      "Token": "",               // Token tin nhắn Mini Program
      "EncodingAESKey": "",      // Khóa mã hóa tin nhắn Mini Program
      "IsDebug": false,          // Có bật chế độ gỡ lỗi hay không
      "DefaultEnvironment": "release" // Môi trường mặc định, các giá trị tùy chọn: develop (bản phát triển), trial (bản trải nghiệm), release (bản chính thức)
    }
  }
}
```

#### Lưu ý

Trong cấu hình động có một vấn đề đã biết: https://github.com/abpframework/abp/issues/6318  
Do đó cần phải xây dựng lại một phương thức thay đổi động AbpWeChatMiniProgramOptions, vui lòng sử dụng AbpWeChatMiniProgramOptionsFactory.CreateAsync()

## Cấu hình Settings

* `WeChat.MiniProgram.AppId`: AppId của Mini Program
* `WeChat.MiniProgram.AppSecret`: AppSecret của Mini Program
* `WeChat.MiniProgram.Token`: Token tin nhắn Mini Program
* `WeChat.MiniProgram.EncodingAESKey`: Khóa mã hóa tin nhắn Mini Program
* `WeChat.MiniProgram.IsDebug`: Có bật chế độ gỡ lỗi hay không
* `WeChat.MiniProgram.DefaultEnvironment`: Môi trường mặc định

## Tài liệu khác

* [Tài liệu mô-đun Mini Program WeChat](README.EN.md)
