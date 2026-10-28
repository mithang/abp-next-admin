# LINGYUN.Abp.WeChat

Mô-đun cơ sở WeChat, cung cấp chức năng và cấu hình cơ sở cho việc phát triển ứng dụng WeChat.

## Tính năng

* Quản lý cấu hình cơ sở WeChat
* Giao diện gọi API WeChat thống nhất
* Quản lý AccessToken WeChat
* Cơ chế xử lý lỗi thống nhất

## Tham chiếu mô-đun

```csharp
[DependsOn(typeof(AbpWeChatModule))]
public class YouProjectModule : AbpModule
{
  // other
}
```

## Mục cấu hình

```json
{
  "WeChat": {
    "BaseUrl": "https://api.weixin.qq.com",  // Địa chỉ cơ sở API WeChat
    "DefaultTimeout": 30000,                  // Thời gian chờ mặc định (mili giây)
    "RetryCount": 3,                         // Số lần thử lại
    "RetryMilliseconds": 1000                // Khoảng thời gian thử lại (mili giây)
  }
}
```

## Cấu hình Settings

* `WeChat.BaseUrl` : Địa chỉ cơ sở API WeChat
* `WeChat.DefaultTimeout` : Thời gian chờ mặc định
* `WeChat.RetryCount` : Số lần thử lại
* `WeChat.RetryMilliseconds` : Khoảng thời gian thử lại

## Tài liệu thêm

* [Tài liệu mô-đun cơ sở WeChat](README.EN.md)
