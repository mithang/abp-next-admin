# LINGYUN.Abp.WeChat.Work.Handlers

Mô-đun xử lý thông điệp của WeChat Work, cung cấp triển khai cơ bản cho việc xử lý thông điệp và sự kiện của WeChat Work.

## Tính năng

* Xử lý thông điệp văn bản
* Xử lý thông điệp hình ảnh
* Xử lý thông điệp thoại
* Xử lý thông điệp video
* Xử lý thông điệp vị trí
* Xử lý thông điệp liên kết
* Xử lý thông điệp sự kiện
* Mở rộng trình xử lý thông điệp tùy chỉnh

## Tham chiếu mô-đun

```csharp
[DependsOn(typeof(AbpWeChatWorkHandlersModule))]
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
      "Handlers": {
        "DefaultResponseType": "text",  // Loại phản hồi mặc định: text/image/voice/video/news
        "DefaultResponse": "",          // Nội dung phản hồi mặc định
        "EnableDefaultResponse": true   // Có bật phản hồi mặc định hay không
      }
    }
  }
}
```

## Trình xử lý tùy chỉnh

Để triển khai trình xử lý thông điệp tùy chỉnh, cần kế thừa lớp cơ sở tương ứng:

* Thông điệp văn bản: `WeChatWorkTextMessageHandlerBase`
* Thông điệp hình ảnh: `WeChatWorkImageMessageHandlerBase`
* Thông điệp thoại: `WeChatWorkVoiceMessageHandlerBase`
* Thông điệp video: `WeChatWorkVideoMessageHandlerBase`
* Thông điệp vị trí: `WeChatWorkLocationMessageHandlerBase`
* Thông điệp liên kết: `WeChatWorkLinkMessageHandlerBase`
* Thông điệp sự kiện: `WeChatWorkEventMessageHandlerBase`

## Trình xử lý sự kiện

Các trình xử lý sự kiện tích hợp sẵn:

* Trình xử lý sự kiện menu ứng dụng
* Trình xử lý sự kiện vào ứng dụng
* Trình xử lý sự kiện báo cáo vị trí địa lý
* Trình xử lý sự kiện hoàn thành tác vụ bất đồng bộ
* Trình xử lý sự kiện liên hệ bên ngoài
* Trình xử lý sự kiện thay đổi danh bạ

## Tài liệu thêm

* [Tài liệu mô-đun xử lý thông điệp của WeChat Work](README.EN.md)
