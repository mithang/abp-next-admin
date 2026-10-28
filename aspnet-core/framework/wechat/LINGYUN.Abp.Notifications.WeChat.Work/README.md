# LINGYUN.Abp.Notifications.WeChat.Work

Mô-đun thông báo tin nhắn ứng dụng WeChat Doanh nghiệp, cung cấp chức năng gửi tin nhắn tới người dùng thông qua ứng dụng WeChat Doanh nghiệp.

## Tính năng

* Hỗ trợ gửi tin nhắn ứng dụng WeChat Doanh nghiệp
* Hỗ trợ tin nhắn văn bản
* Hỗ trợ tin nhắn hình ảnh
* Hỗ trợ tin nhắn thoại
* Hỗ trợ tin nhắn video
* Hỗ trợ tin nhắn tệp
* Hỗ trợ tin nhắn đồ họa-văn bản
* Hỗ trợ tin nhắn thẻ mẫu
* Tích hợp hệ thống thông báo ABP

## Tham chiếu mô-đun

```csharp
[DependsOn(typeof(AbpNotificationsWeChatWorkModule))]
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
      "Notifications": {
        "DefaultAgentId": 0,            // ID ứng dụng mặc định
        "DefaultToParty": "",           // Danh sách ID phòng ban nhận tin nhắn mặc định
        "DefaultToTag": "",             // Danh sách ID thẻ nhận tin nhắn mặc định
        "DefaultSafe": 0,               // Mặc định cho biết có phải tin nhắn bảo mật hay không, 0 nghĩa là có thể chia sẻ ra ngoài, 1 nghĩa là không thể chia sẻ và nội dung hiển thị watermark
        "DefaultEnableIdTrans": 0,      // Mặc định cho biết có bật chuyển đổi id hay không, 0 nghĩa là không, 1 nghĩa là có
        "DefaultEnableDuplicateCheck": 0, // Mặc định cho biết có bật kiểm tra tin nhắn trùng lặp hay không, 0 nghĩa là không, 1 nghĩa là có
        "DefaultDuplicateCheckInterval": 1800 // Mặc định cho biết khoảng thời gian kiểm tra tin nhắn trùng lặp, mặc định là 1800 giây
      }
    }
  }
}
```

## Tài liệu khác

* [Tài liệu thông báo tin nhắn ứng dụng WeChat Doanh nghiệp](README.EN.md)
