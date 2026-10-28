# LINGYUN.Abp.WxPusher

Mô-đun ABP tích hợp dịch vụ đẩy tin nhắn WeChat WxPusher, triển khai tài liệu Api liên quan đến WxPusher và sở hữu khả năng mở của WxPusher.

[English](./README.EN.md)

Xem chi tiết trong tài liệu WxPusher: https://wxpusher.dingliqc.com/docs/#/  

## Tính năng

* Tích hợp WxPusher API
* Hỗ trợ đẩy tin nhắn tới người dùng và Topic
* Hỗ trợ nhiều loại tin nhắn (văn bản, HTML, Markdown)
* Hỗ trợ giới hạn gửi tin nhắn và quản lý hạn mức
* Hỗ trợ tạo mã QR
* Hỗ trợ quản lý đăng ký của người dùng

## Cài đặt

```bash
dotnet add package LINGYUN.Abp.WxPusher
```

## Tham chiếu mô-đun

```csharp
[DependsOn(typeof(AbpWxPusherModule))]
public class YouProjectModule : AbpModule
{
    // other
}
```

## Cấu hình

### Cấu hình Settings

* `WxPusher.Security.AppToken`: Dấu hiệu nhận dạng của ứng dụng, sau khi có APP_TOKEN có thể gửi tin nhắn cho người dùng của ứng dụng tương ứng, vui lòng giữ bí mật tuyệt đối.

### Tính năng Features

* `WxPusher`: Nhóm tính năng WxPusher
* `WxPusher.Enable`: Bật WxPusher toàn cục
* `WxPusher.Message.Enable`: Bật kênh tin nhắn WxPusher toàn cục
* `WxPusher.Message`: Đẩy tin nhắn WxPusher
* `WxPusher.Message.SendLimit`: Số lần giới hạn đẩy tin nhắn WxPusher
* `WxPusher.Message.SendLimitInterval`: Chu kỳ giới hạn đẩy tin nhắn WxPusher (ngày)

## Cách sử dụng

### Gửi tin nhắn

```csharp
public class YourService
{
    private readonly IWxPusherMessageSender _messageSender;

    public YourService(IWxPusherMessageSender messageSender)
    {
        _messageSender = messageSender;
    }

    public async Task SendMessageAsync()
    {
        await _messageSender.SendAsync(
            content: "Hello, WxPusher!",
            summary: "Tóm tắt tin nhắn",
            contentType: MessageContentType.Text,
            topicIds: new List<int> { 1, 2 },  // Tùy chọn: gửi tới Topic chỉ định
            uids: new List<string> { "UID1", "UID2" },  // Tùy chọn: gửi tới người dùng chỉ định
            url: "https://example.com"  // Tùy chọn: URL chuyển hướng khi nhấn vào tin nhắn
        );
    }
}
```

### Đăng ký của người dùng

Triển khai giao diện `IWxPusherUserStore` để quản lý đăng ký của người dùng:

```csharp
public class YourWxPusherUserStore : IWxPusherUserStore
{
    public async Task<List<string>> GetBindUidsAsync(
        IEnumerable<Guid> userIds, 
        CancellationToken cancellationToken = default)
    {
        // Triển khai logic lấy UID WxPusher đã liên kết của người dùng
    }

    public async Task<List<int>> GetSubscribeTopicsAsync(
        IEnumerable<Guid> userIds, 
        CancellationToken cancellationToken = default)
    {
        // Triển khai logic lấy danh sách Topic người dùng đã đăng ký
    }
}
```

## Vị trí mã nguồn

[LINGYUN.Abp.WxPusher](https://github.com/colinin/abp-next-admin/tree/master/aspnet-core/framework/wx-pusher/LINGYUN.Abp.WxPusher)
