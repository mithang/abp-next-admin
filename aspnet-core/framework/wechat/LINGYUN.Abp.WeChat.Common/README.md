# LINGYUN.Abp.WeChat.Common

Mô-đun chung WeChat, cung cấp triển khai chức năng cơ bản dùng chung cho dòng sản phẩm WeChat.

## Tính năng

* Khung xử lý thông điệp thống nhất
* Cơ chế mã hóa/giải mã thông điệp thống nhất
* Cơ chế xử lý sự kiện thống nhất
* Giao diện gọi API thống nhất
* Cơ chế xử lý lỗi thống nhất

## Tham chiếu mô-đun

```csharp
[DependsOn(typeof(AbpWeChatCommonModule))]
public class YouProjectModule : AbpModule
{
}
```

## Mục cấu hình

```json
{
  "WeChat": {
    "Common": {
      "MessageHandlerFactory": {
        "MessageResolvers": [],           // Danh sách trình phân giải thông điệp
        "MessageHandlers": []             // Danh sách trình xử lý thông điệp
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
* Hỗ trợ xử lý thông điệp sự kiện
* Hỗ trợ mở rộng trình xử lý thông điệp tùy chỉnh

## Tài liệu thêm

* [Tài liệu mô-đun chung WeChat](README.EN.md)

### Nhật ký thay đổi 
