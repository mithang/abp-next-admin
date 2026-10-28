# LINGYUN.Abp.WeChat.Work

Mô-đun tích hợp WeChat doanh nghiệp, cung cấp hỗ trợ chức năng cần thiết cho việc phát triển ứng dụng WeChat doanh nghiệp.

## Tính năng

* Xác thực danh tính WeChat doanh nghiệp
* Quản lý danh bạ
* Đẩy tin nhắn
* Quản lý tài nguyên
* Liên hệ khách hàng
* Quản lý ứng dụng
* Xác thực danh tính
* Thanh toán doanh nghiệp
* Hóa đơn điện tử

## Tham chiếu mô-đun

```csharp
[DependsOn(typeof(AbpWeChatWorkModule))]
public class YouProjectModule : AbpModule
{
  // other
}
```

## Cấu hình

```json
{
  "WeChat": {
    "Work": {
      "CorpId": "",               // ID doanh nghiệp
      "AgentId": 0,              // ID ứng dụng
      "Secret": "",              // Khóa bí mật ứng dụng
      "Token": "",               // Token tin nhắn
      "EncodingAESKey": "",      // Khóa mã hóa tin nhắn
      "ApiUrl": "https://qyapi.weixin.qq.com" // Địa chỉ API
    }
  }
}
```

## Cấu hình Settings

* `WeChat.Work.CorpId`: ID doanh nghiệp
* `WeChat.Work.AgentId`: ID ứng dụng
* `WeChat.Work.Secret`: Khóa bí mật ứng dụng
* `WeChat.Work.Token`: Token tin nhắn
* `WeChat.Work.EncodingAESKey`: Khóa mã hóa tin nhắn
* `WeChat.Work.ApiUrl`: Địa chỉ API

## Tài liệu khác

* [Tài liệu mô-đun tích hợp WeChat doanh nghiệp](README.EN.md)
