# LINGYUN.Abp.WeChat.Work.Common

Mô-đun chung của WeChat Work, cung cấp triển khai chức năng cơ bản cho việc phát triển ứng dụng WeChat Work.

## Tính năng

* Khung xử lý thông điệp thống nhất
* Cơ chế mã hóa/giải mã thông điệp thống nhất
* Cơ chế xử lý sự kiện thống nhất
* Giao diện gọi API thống nhất
* Cơ chế xử lý lỗi thống nhất
* Quản lý AccessToken
* Quản lý JsApi Ticket

## Tham chiếu mô-đun

```csharp
[DependsOn(typeof(AbpWeChatWorkCommonModule))]
public class YouProjectModule : AbpModule
{
  // other
}
```

## Mục cấu hình

```json
{
  "WeChat": {
    "Work": {
      "Common": {
        "MessageHandlerFactory": {
          "MessageResolvers": [],           // Danh sách trình phân tích thông điệp
          "MessageHandlers": []             // Danh sách trình xử lý thông điệp
        },
        "AccessToken": {
          "CacheExpiration": 7200,         // Thời gian lưu đệm AccessToken (giây)
          "CacheKey": "WeChat:Work:AccessToken:{0}" // Mẫu khóa lưu đệm AccessToken
        },
        "JsApiTicket": {
          "CacheExpiration": 7200,         // Thời gian lưu đệm JsApi Ticket (giây)
          "CacheKey": "WeChat:Work:JsApiTicket:{0}" // Mẫu khóa lưu đệm JsApi Ticket
        }
      }
    }
  }
}
```

## Xử lý thông điệp

* Hỗ trợ xử lý thông điệp văn bản
* Hỗ trợ xử lý thông điệp hình ảnh
* Hỗ trợ xử lý thông điệp thoại
* Hỗ trợ xử lý thông điệp video
* Hỗ trợ xử lý thông điệp vị trí
* Hỗ trợ xử lý thông điệp liên kết
* Hỗ trợ xử lý thông điệp sự kiện

## Xử lý sự kiện

* Hỗ trợ sự kiện menu ứng dụng
* Hỗ trợ sự kiện vào ứng dụng
* Hỗ trợ sự kiện báo cáo vị trí địa lý
* Hỗ trợ sự kiện hoàn thành tác vụ bất đồng bộ
* Hỗ trợ sự kiện liên hệ bên ngoài
* Hỗ trợ sự kiện thay đổi danh bạ

## Tài liệu thêm

* [Tài liệu mô-đun chung của WeChat Work](README.EN.md)
