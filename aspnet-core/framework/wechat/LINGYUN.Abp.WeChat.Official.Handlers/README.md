# LINGYUN.Abp.WeChat.Official.Handlers

Module xử lý tin nhắn tài khoản công khai WeChat, cung cấp triển khai cơ bản cho việc xử lý tin nhắn và sự kiện của tài khoản công khai WeChat.

## Tính năng

* Xử lý tin nhắn văn bản
* Xử lý tin nhắn hình ảnh
* Xử lý tin nhắn giọng nói
* Xử lý tin nhắn video
* Xử lý tin nhắn video ngắn
* Xử lý tin nhắn vị trí địa lý
* Xử lý tin nhắn liên kết
* Xử lý sự kiện theo dõi/hủy theo dõi
* Xử lý sự kiện quét mã QR có tham số
* Xử lý sự kiện báo cáo vị trí địa lý
* Xử lý sự kiện menu tùy chỉnh
* Xử lý sự kiện tin nhắn mẫu

## Tham chiếu module

```csharp
[DependsOn(typeof(AbpWeChatOfficialHandlersModule))]
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
      "Handlers": {
        "DefaultResponseType": "text",  // Loại phản hồi mặc định: text/image/voice/video/music/news
        "DefaultResponse": "",          // Nội dung phản hồi mặc định
        "EnableDefaultResponse": true   // Có bật phản hồi mặc định hay không
      }
    }
  }
}
```

## Trình xử lý tùy chỉnh

Để triển khai trình xử lý tin nhắn tùy chỉnh, cần kế thừa lớp cơ sở tương ứng:

* Tin nhắn văn bản：`WeChatOfficialTextMessageHandlerBase`
* Tin nhắn hình ảnh：`WeChatOfficialImageMessageHandlerBase`
* Tin nhắn giọng nói：`WeChatOfficialVoiceMessageHandlerBase`
* Tin nhắn video：`WeChatOfficialVideoMessageHandlerBase`
* Tin nhắn sự kiện：`WeChatOfficialEventMessageHandlerBase`

## Tài liệu thêm

* [Tài liệu module xử lý tin nhắn tài khoản công khai WeChat](README.EN.md)
