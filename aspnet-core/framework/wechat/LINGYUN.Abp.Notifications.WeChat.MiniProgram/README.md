# LINGYUN.Abp.Notifications.WeChat.MiniProgram

Mô-đun thông báo tin nhắn WeChat Mini Program, cung cấp chức năng gửi tin nhắn đăng ký cho người dùng qua WeChat Mini Program.

## Tính năng

* Hỗ trợ gửi tin nhắn đăng ký của WeChat Mini Program
* Hỗ trợ quản lý mẫu tin nhắn
* Hỗ trợ cấu hình dữ liệu tin nhắn động
* Tích hợp hệ thống thông báo ABP

## Tham chiếu mô-đun

```csharp
[DependsOn(typeof(AbpNotificationsWeChatMiniProgramModule))]
public class YouProjectModule : AbpModule
{
  // other
}
```

## Mục cấu hình

```json
{
  "WeChat": {
    "MiniProgram": {
      "Notifications": {
        "DefaultTemplateId": "",           // ID mẫu mặc định
        "DefaultPage": "pages/index/index", // Trang chuyển hướng mặc định
        "DefaultState": "formal",          // Loại Mini Program chuyển hướng mặc định, developer là bản phát triển; trial là bản dùng thử; formal là bản chính thức
        "DefaultLang": "zh_CN"             // Ngôn ngữ mặc định
      }
    }
  }
}
```

## Tài liệu khác

* [Tài liệu thông báo tin nhắn WeChat Mini Program](README.EN.md)
