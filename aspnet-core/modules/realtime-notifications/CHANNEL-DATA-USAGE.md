# Dữ liệu kênh thông báo — Hướng dẫn sử dụng

> Mô tả thiết kế framework xem [CHANNEL-DATA.md](./CHANNEL-DATA.md)

---

## 0. Ba điểm tích hợp

| Vai trò | Dùng API nào | Vị trí thường gặp |
|---|---|---|
| Producer (code nghiệp vụ) | `INotificationChannelDataSerializer.Write` hoặc phương thức mở rộng của kênh | AppService / DomainService gửi thông báo |
| Định nghĩa thông báo | `NotificationDefinition.WithProviders(...)` | `NotificationDefinitionProvider` |
| Triển khai kênh | `INotificationChannelDataResolver` | Các `*NotificationPublishProvider` |

Dữ liệu kênh là **quy ước một chiều** "producer → kênh"; định nghĩa thông báo chịu trách nhiệm quyết định **những kênh nào sẽ nhận**.
Hai thứ độc lập với nhau: định nghĩa không khai báo kênh đó thì kênh sẽ không bao giờ được gọi.

---

## 1. Kịch bản một: kênh WeChat Work

### 1.1 Đơn giản nhất — chỉ dùng dữ liệu chuẩn

Không viết bất kỳ dữ liệu kênh nào, kênh WeChat Work sẽ tự suy ra carrier theo `ContentType` của định nghĩa thông báo:

| Loại nội dung của định nghĩa | Carrier tự tạo |
|---|---|
| `Text` | Tin nhắn văn bản (lấy `message`) |
| `Html` | Tin nhắn thẻ văn bản (lấy `title`/`description`/`message`) |
| `Markdown` | Tin nhắn markdown (lấy `message`) |

```csharp
public class MyAppService : ApplicationService
{
    private readonly INotificationSender _notificationSender;

    public MyAppService(INotificationSender notificationSender)
    {
        _notificationSender = notificationSender;
    }

    public async Task NotifyAsync(Guid userId)
    {
        var data = new NotificationData();
        data.WriteStandardData(
            title: "Đã build xong",
            message: "**v1.2.0** đã triển khai lên môi trường production",
            createTime: Clock.Now,
            formUser: CurrentUser.UserName ?? "system");

        await _notificationSender.SendNofiterAsync(
            name: "BuildFinished",
            data: data,
            user: new UserIdentifier(userId, "admin"));
    }
}
```

### 1.2 Chỉ định người nhận / bảo mật / chống trùng

Ghi "tùy chọn gửi". Các tùy chọn này **vẫn có hiệu lực sau khi persist và thử lại khi thất bại**:

```csharp
var data = new NotificationData();
data.WriteStandardData("Tiêu đề", "Nội dung", Clock.Now, "system");

data.TrySetData(WeChatWorkNotificationDataKeys.ToParty, "1|2");             // Chỉ định phòng ban
data.TrySetData(WeChatWorkNotificationDataKeys.ToTag, "3");                 // Chỉ định nhãn
data.TrySetData(WeChatWorkNotificationDataKeys.Safe, true);                 // Tin nhắn bảo mật
data.TrySetData(WeChatWorkNotificationDataKeys.EnableIdTrans, true);        // Bật dịch id
data.TrySetData(WeChatWorkNotificationDataKeys.EnableDuplicateCheck, true);
data.TrySetData(WeChatWorkNotificationDataKeys.DuplicateCheckInterval, 600); // giây

await _notificationSender.SendNofiterAsync("BuildFinished", data, user);
```

> Tên khóa mang tiền tố của kênh này (`wx-work:`); việc đọc không phân biệt hoa thường.
> Thành viên (`touser`) được tự động phân giải từ quan hệ ràng buộc danh tính WeChat Work, **không do dữ liệu thông báo chỉ định**.
> `touser` / `toparty` / `totag` không được đồng thời để trống.

### 1.3 Thẻ văn bản

```csharp
channelDataSerializer.Write(data, new WeChatWorkTextCardChannelData
{
    TextCard = new TextCardMessage(
        title: "Đã phê duyệt",
        description: "Đơn xin nghỉ phép của bạn đã được phê duyệt, vui lòng vào xem",
        url: "https://example.com/leave/123",
        buttonText: "Vào xem")
});
```

> `channelDataSerializer` là `INotificationChannelDataSerializer` được inject.
> Nó ghi khóa tương ứng theo <xref:NotificationChannelPropertyAttribute> được gắn trên loại payload,
> phía producer và phía kênh dùng chung một định nghĩa hợp đồng.

### 1.4 Thẻ mẫu (khuyên dùng cho phê duyệt/cảnh báo)

```csharp
var card = new TextTemplateCard(
    new TemplateCardCardAction("https://example.com/approval/123"))
{
    MainTitle = new TemplateCardMainTitle("Thông báo nghỉ phép đã duyệt", "Đơn xin nghỉ phép của bạn đã được phê duyệt"),
    SubTitle = "Vui lòng xử lý kịp thời các việc bàn giao tiếp theo",
    HorizontalContents = new List<TemplateCardHorizontalContent>
    {
        TemplateCardHorizontalContent.None("Số đơn phê duyệt", "QJ20251000000136"),
        TemplateCardHorizontalContent.None("Ngày nghỉ phép", "2025/10/01-2025/10/10"),
        TemplateCardHorizontalContent.None("Thời gian duyệt", "2025-10-01 15:30:00"),
        // Cũng có thể kèm chuyển hướng/tài liệu/người
        TemplateCardHorizontalContent.FromUrl("Chi tiết", "https://example.com/oa/123", "Nhấn để xem"),
    },
    Jumps = new List<TemplateCardJump>
    {
        new TemplateCardJump("Vào OA xem", "https://example.com/oa/123"),
    }
};

channelDataSerializer.Write(data, new WeChatWorkTemplateCardChannelData { TemplateCard = card });
```

> Các factory `TemplateCardHorizontalContent` khả dụng:
> `None(keyName, value)`、`FromUrl(keyName, url, value)`、
> `FromMedia(keyName, mediaId, value)`、`FromUser(keyName, userId, value)`.
> `TemplateCardJump` hỗ trợ hai constructor "chuyển hướng bằng liên kết" và "chuyển hướng tới mini program".
> Ví dụ chạy được đầy đủ xem trong kho của bạn tại
> `tests/LINGYUN.Abp.WeChat.Work.Tests/.../WeChatWorkMessageSender_Tests.cs`.

### 1.5 Thông báo mini program

```csharp
channelDataSerializer.Write(data, new WeChatWorkMiniProgramNoticeChannelData
{
    MiniProgram = new MiniProgramMessage(
        appId: "wx1234567890",
        title: "Đơn hàng đã giao",
        page: "pages/order/detail?id=123",
        description: "Nhấn để xem chi tiết vận chuyển")
    {
        EmphasisFirstItem = true,
        ContentItems = new List<MiniProgramContent>
        {
            new MiniProgramContent("Mã đơn hàng", "SO20251001001"),
            new MiniProgramContent("Công ty vận chuyển", "SF Express"),
        }
    }
});
```

### 1.6 Đồ họa-văn bản / video / giọng nói / tệp

```csharp
channelDataSerializer.Write(data, new WeChatWorkMpNewChannelData
{
    MpNewMessage = new MpNewMessagePayload(new List<MpNewMessage>
    {
        new MpNewMessage(
            title: "Báo cáo tháng",
            thumbMediaId: "MEDIA_ID",
            content: "<p>Nội dung chính của báo cáo</p>",
            author: "Phòng Vận hành",
            contentSourceUrl: "https://example.com/report",
            description: "Báo cáo kinh doanh tháng 10 năm 2025")
    })
});

channelDataSerializer.Write(data, new WeChatWorkVideoChannelData
{
    Video = new VideoMessage("MEDIA_ID", "Video đào tạo", "Đào tạo nhân viên mới")
});

channelDataSerializer.Write(data, new WeChatWorkVoiceChannelData
{
    Voice = new MediaMessage("MEDIA_ID")
});

channelDataSerializer.Write(data, new WeChatWorkFileChannelData
{
    File = new MediaMessage("MEDIA_ID")
});
```

### 1.7 Các loại payload khả dụng và hỗ trợ tùy chọn

Producer chỉ cần chọn loại payload phù hợp; tùy chọn do kênh tự lấy bỏ theo khả năng của carrier (trường không được hỗ trợ **sẽ không được đặt**).

| Loại payload | Carrier | `safe` | `enable_id_trans` | `enable_duplicate_check` |
|---|---|---|---|---|
| `WeChatWorkTextCardChannelData` | Thẻ văn bản | ❌ | ✅ | ✅ |
| `WeChatWorkTemplateCardChannelData` | Thẻ mẫu | ❌ | ✅ | ✅ |
| `WeChatWorkMiniProgramNoticeChannelData` | Thông báo mini program | ❌ | ✅ | ✅ |
| `WeChatWorkMpNewChannelData` | Đồ họa-văn bản (mpnews) | ✅ | ✅ | ✅ |
| `WeChatWorkVideoChannelData` | Video | ✅ | ❌ | ✅ |
| `WeChatWorkFileChannelData` | Tệp | ✅ | ❌ | ✅ |
| `WeChatWorkVoiceChannelData` | Giọng nói | ❌ | ❌ | ✅ |
| (không có, suy ra theo `ContentType=Markdown`) | markdown | ❌ | ❌ | ✅ |
| (không có, suy ra theo `ContentType=Text`) | Văn bản | ✅ | ✅ | ✅ |

### 1.8 Xử lý khi nhiều payload cùng tồn tại

**Tất cả đều sẽ được gửi**, thứ tự do `Priority` của payload quyết định (giá trị cố định, xem bảng dưới):

| Payload | Priority |
|---|---|
| Thông báo mini program | 100 |
| Đồ họa-văn bản (mpnews) | 200 |
| Thẻ mẫu | 300 |
| Thẻ văn bản | 400 |
| Video | 500 |
| Giọng nói | 600 |
| Tệp | 700 |

Tức là "đồng thời đặt thẻ văn bản và thông báo mini program" sẽ **gửi hai tin nhắn**. Nếu chỉ muốn gửi một tin, chỉ viết một payload.
Chỉ khi **không có payload tường minh nào** mới fallback về carrier suy ra theo `ContentType`.

---

## 2. Kịch bản hai: các kênh tích hợp sẵn khác

### 2.1 Tin nhắn đăng ký mini program WeChat

> Lưu ý: các khóa như `TemplateId` vẫn giữ tên gọi lịch sử (**không có tiền tố**), việc đọc đã đổi thành **không phân biệt hoa thường**.

```csharp
var data = new NotificationData();
data.WriteStandardData("Đơn hàng đã giao", "Đơn hàng của bạn đã được giao", Clock.Now, "system");

// Khóa mang tiền tố của kênh này wx-mp:; nếu không ghi thì dùng giá trị mặc định của AbpNotificationsWeChatMiniProgramOptions
data.TrySetData(WeChatMiniProgramNotificationDataKeys.TemplateId, "TEMPLATE_ID");
data.TrySetData(WeChatMiniProgramNotificationDataKeys.RedirectPage, "pages/order/detail?id=123");
data.TrySetData(WeChatMiniProgramNotificationDataKeys.WeAppState, "developer");
data.TrySetData(WeChatMiniProgramNotificationDataKeys.WeAppLanguage, "zh_CN");

// Dữ liệu mẫu vốn lấy từ gói thuộc tính, ghi theo tên trường của mẫu WeChat
data.TrySetData("character_string1", "SO20251001001");
data.TrySetData("thing2", "SF Express");

await _notificationSender.SendNofiterAsync("OrderShipped", data, user);
```

> Khóa dữ liệu mẫu (`character_string1`、`thing2` …) do **định nghĩa mẫu WeChat** quyết định,
> không thuộc khóa riêng của kênh, vì vậy không thêm tiền tố.
>
> Các khóa không tiền tố mà phiên bản cũ dùng (`TemplateId` v.v.) được kênh tương thích chỉ-đọc fallback
> (xem `WeChatMiniProgramNotificationDataKeys.Legacy`), code mới vui lòng dùng hằng số có tiền tố.

### 2.2 WxPusher

```csharp
// Cách một: dùng serializer (khuyên dùng)
channelDataSerializer.Write(data, new WxPusherChannelData
{
    Url = "https://example.com/detail/123"
});

// Cách hai: ghi trực tiếp khóa
data.TrySetData(WxPusherNotificationDataKeys.Url, "https://example.com/detail/123");
```

### 2.3 PushPlus

```csharp
channelDataSerializer.Write(data, new PushPlusChannelData
{
    Webhook = "https://example.com/hook",
    CallbackUrl = "https://example.com/callback"
});
```

> `Presence` của PushPlus là `AnyDeclaredProperty`: ghi bất kỳ khóa nào trong đó tức là đã khai báo payload.

### 2.4 SMS / email / SignalR

**Không có khóa riêng của kênh**, chỉ cần dữ liệu chuẩn:

```csharp
var data = new NotificationData();
data.WriteStandardData("Cảnh báo", "Mức sử dụng CPU vượt quá 90%", Clock.Now, "monitor");

await _notificationSender.SendNofiterAsync(NotifyNames.SystemAlarm, data, user);
```

- SMS: chỉ lấy `message`
- Email: `title` làm tiêu đề, `message` làm nội dung (khi `ContentType=Markdown` sẽ tự chuyển thành HTML)
- SignalR: đẩy trực tiếp toàn bộ `NotificationData`, phía client tự diễn giải

---

## 3. Kịch bản ba: WeChat Work Webhook (robot nhóm)

Dự án: `LINGYUN.Abp.Notifications.Webhook.WeChat.Work`

### 3.1 Khác biệt với tin nhắn ứng dụng WeChat Work

| | Tin nhắn ứng dụng | Webhook (robot nhóm) |
|---|---|---|
| Tên kênh (khai báo trong định nghĩa thông báo) | `WeChat.Work` | `Webhook` |
| Khóa registry của payload | `WeChat.Work` | `WeChat.Work.Webhook` |
| Tiền tố khóa dữ liệu | `wx-work:` | `wx-work-hook:` |
| Người nhận | Phân giải từ ràng buộc danh tính (`touser`) | Do định nghĩa Webhook quyết định (nhóm) |

> **Vì sao phải tách thành hai kênh**: hai kênh là phương thức truyền tải khác nhau, mô hình carrier khác nhau.
> Nếu dùng chung khóa registry và tiền tố khóa, khi cùng một thông báo được cả hai kênh đăng ký,
> payload sẽ bị cả hai phía phân giải và mỗi phía gửi một tin nhắn.

### 3.2 Phía định nghĩa

```csharp
context.AddGroup("Monitor", L("Monitor"))
    .AddNotification("SystemAlarm", L("SystemAlarm"))
    .WithProviders(
        "Webhook");   // WebhookNotificationPublishProvider.ProviderName
```

Mục tiêu gửi của Webhook do **quan hệ đăng ký** quyết định (`IWebhookPublisher`),
dữ liệu thông báo chỉ chịu trách nhiệm "gửi cái gì".

### 3.3 Phía producer

```csharp
var data = new NotificationData();
data.WriteStandardData("Build thất bại", "Build #1234 thất bại", Clock.Now, "ci");

// Dùng serializer để ghi payload (khuyên dùng)
channelDataSerializer.Write(data, new WeChatWorkWebhookTextChannelData
{
    Content = "Build #1234 thất bại, vui lòng xem nhật ký"
});

// Cũng có thể ghi trực tiếp khóa
data.TrySetData(WeChatWorkWebhookNotificationDataKeys.Markdown, "**Build thất bại**");
```

### 3.4 Các loại payload khả dụng

| Loại payload | `msgtype` | Công dụng |
|---|---|---|
| `WeChatWorkWebhookTextChannelData` | `text` | Văn bản thuần |
| `WeChatWorkWebhookMarkdownChannelData` | `markdown` | markdown |
| `WeChatWorkWebhookMarkdownV2ChannelData` | `markdown_v2` | markdown_v2 (hỗ trợ bảng, khối code) |
| `WeChatWorkWebhookImageChannelData` | `image` | Hình ảnh (base64 + md5) |
| `WeChatWorkWebhookNewsChannelData` | `news` | Đồ họa-văn bản |
| `WeChatWorkWebhookFileChannelData` | `file` | Tệp (ID tài liệu) |
| `WeChatWorkWebhookVoiceChannelData` | `voice` | Giọng nói (ID tài liệu) |
| `WeChatWorkWebhookTemplateCardChannelData` | `template_card` | Thẻ mẫu |

**Mỗi loại payload ánh xạ 1:1 tới `msgtype` của riêng nó, không hạ cấp ngầm.**
(Trước khi cải tạo chỉ hỗ trợ ba loại `text` / `markdown` / `markdown_v2`, các loại nội dung còn lại bị lặng lẽ loại bỏ.)

Ví dụ thẻ mẫu:

```csharp
channelDataSerializer.Write(data, new WeChatWorkWebhookTemplateCardChannelData
{
    TemplateCard = new WebhookTextNoticeCardMessage(
        action: WebhookTemplateCardAction.Link("https://example.com/build/1234"),
        mainTitle: new WebhookTemplateCardMainTitle("Build thất bại", "Vui lòng xử lý kịp thời"),
        subTitleText: "Build #1234 thất bại lúc 15:30",
        horizontalContents: new List<WebhookTemplateCardHorizontalContent>
        {
            WebhookTemplateCardHorizontalContent.Default("Nhánh", "main"),
            WebhookTemplateCardHorizontalContent.Default("Commit", "a1b2c3d"),
        })
});
```

Ví dụ tin nhắn đồ họa-văn bản:

```csharp
channelDataSerializer.Write(data, new WeChatWorkWebhookNewsChannelData
{
    News = new WebhookNewsMessage(new List<WebhookArticleMessage>
    {
        new WebhookArticleMessage(
            title: "Báo cáo kinh doanh tháng",
            url: "https://example.com/report",
            description: "Tháng 10 năm 2025",
            pictureUrl: "https://example.com/cover.png")
    })
});
```

### 3.5 Tương thích ngược

**Khi thiếu payload** sẽ fallback về suy ra theo `ContentType` (tức hành vi trước khi cải tạo):

| `ContentType` | Carrier suy ra |
|---|---|
| `Text` | `text` |
| `Html` | HTML → markdown, rồi theo `UseMarkdownV2` quyết định `markdown_v2` hoặc `markdown` |
| `Markdown` | Theo `UseMarkdownV2` quyết định `markdown_v2` hoặc `markdown` |

Vì vậy producer cũ chỉ viết dữ liệu chuẩn **không cần thay đổi**.

`UseMarkdownV2` mặc định là `true`, có thể ghi đè trong `PreConfigure` của module:

```csharp
[DependsOn(typeof(AbpNotificationsWebhookWeChatWorkModule))]
public class MyModule : AbpModule
{
    public override void PreConfigureServices(ServiceConfigurationContext context)
    {
        PreConfigure<AbpNotificationsWebhookWeChatWorkOptions>(options =>
        {
            options.UseMarkdownV2 = false;
        });
    }
}
```

### 3.6 Một Webhook chỉ mang một tin nhắn

Khi khai báo nhiều payload thì lấy payload có `Priority` nhỏ nhất:

| Payload | Priority |
|---|---|
| Văn bản | 100 |
| markdown | 200 |
| markdown_v2 | 300 |
| Hình ảnh | 400 |
| Đồ họa-văn bản | 500 |
| Tệp | 600 |
| Giọng nói | 700 |
| Thẻ mẫu | 800 |

> Điểm này khác với kênh tin nhắn **ứng dụng** WeChat Work — kênh đó nhiều payload sẽ **gửi nhiều** tin nhắn.
> Một lần phát hành Webhook tương ứng với một callback đăng ký, vì vậy chỉ mang được một tin.

---

## 4. Kịch bản bốn: kênh tùy chỉnh

Lấy kênh "robot DingTalk" làm ví dụ.

### 4.1 Định nghĩa payload

```csharp
using LINGYUN.Abp.Notifications;

namespace MyProject.Notifications.DingTalk;

public static class DingTalkNotificationDataKeys
{
    public const string Prefix = "dingtalk:";
    public const string Webhook = Prefix + "webhook";
    public const string AtMobiles = Prefix + "at_mobiles";
}

[NotificationChannelData(DingTalkNotificationPublishProvider.ProviderName, Priority = 100)]
public class DingTalkChannelData : NotificationChannelData
{
    [NotificationChannelProperty(DingTalkNotificationDataKeys.Webhook)]
    public virtual string? Webhook { get; set; }

    [NotificationChannelProperty(DingTalkNotificationDataKeys.AtMobiles)]
    public virtual string? AtMobiles { get; set; }
}
```

> ✅ **Không cần triển khai `IsSet`**.
> Tính tồn tại được suy ra khai báo từ `Presence` (mặc định "tất cả thuộc tính tham gia khớp đều tồn tại").
> Nếu muốn "chỉ viết atMobiles cũng tính là đã khai báo", đổi thành:
> `[NotificationChannelData(..., Presence = NotificationChannelDataPresenceMode.AnyDeclaredProperty)]`.
>
> Nếu một thuộc tính chỉ là mục đọc tùy chọn (không tham gia xét tồn tại), gắn cho nó `IgnoreWhenMatching = true`.
>
> Nếu vừa không khai báo `Presence`, vừa không có thuộc tính nào có thể khớp, **lúc đăng ký sẽ ném
> `AbpNotificationChannelDataConfigurationException`**. Đây là thiết kế có chủ ý:
> biến "quên định nghĩa tính tồn tại" từ việc lặng lẽ mất tin nhắn ở môi trường production thành lỗi ngay khi khởi động.
>
> Vì sao không dùng "phương thức static trừu tượng để bắt buộc triển khai"? C# không cho phép thành viên `static` gắn `abstract` (CS0112),
> lớp cơ sở không thể bắt lớp dẫn xuất triển khai thành viên static; còn việc cung cấp triển khai dự phòng "mặc định trả về false" sẽ dẫn tới
> **người quên triển khai sẽ bị mất hiệu lực một cách lặng lẽ**. Xem chi tiết [CHANNEL-DATA.md §3](./CHANNEL-DATA.md).

### 4.2 Đăng ký

Module của kênh dùng `Configure<>` trong `AbpModule` của mình để khai báo payload:

```csharp
using LINGYUN.Abp.Notifications;
using Volo.Abp.Modularity;

namespace MyProject.Notifications.DingTalk;

[DependsOn(typeof(AbpNotificationsModule))]
public class AbpNotificationsDingTalkModule : AbpModule
{
    public override void ConfigureServices(ServiceConfigurationContext context)
    {
        Configure<AbpNotificationsPublishOptions>(options =>
        {
            options.PublishProviders.Add<DingTalkNotificationPublishProvider>();
        });

        // Khai báo các dạng payload mà kênh này hỗ trợ (kiểm tra hợp đồng tồn tại ngay tại thời điểm đăng ký)
        Configure<AbpNotificationChannelDataOptions>(options =>
        {
            options.Add<DingTalkChannelData>();
        });
    }
}
```

> `AbpNotificationChannelDataOptions` là đối tượng dữ liệu thuần, việc kiểm tra tính tồn tại tại thời điểm đăng ký chỉ phụ thuộc vào metadata khai báo,
> không phụ thuộc vào bất kỳ service nào, vì vậy `Add()` không yêu cầu bất kỳ thứ tự khởi tạo nào, cũng không cần thêm lớp cấu hình nào khác.

### 4.3 Phân giải trong triển khai kênh

```csharp
public class DingTalkNotificationPublishProvider : NotificationPublishProvider
{
    public const string ProviderName = "DingTalk";
    public override string Name => ProviderName;

    protected INotificationChannelDataResolver ChannelDataResolver
        => ServiceProvider.LazyGetRequiredService<INotificationChannelDataResolver>();

    protected async override Task PublishAsync(
        NotificationPublishContext context,
        CancellationToken cancellationToken = default)
    {
        var data = context.Notification.Data;

        // ① Payload đã khai báo nhưng phân giải thất bại => dữ liệu của producer không hợp lệ, báo lỗi rõ ràng thay vì fallback lặng lẽ
        if (ChannelDataResolver.IsDeclared(data, typeof(DingTalkChannelData))
            && ChannelDataResolver.Resolve<DingTalkChannelData>(data) is not { } payload)
        {
            context.Cancel("The dingtalk payload can not be parsed, please check the notification data.");
            Logger.LogWarning(context.Reason);
            return;
        }

        // ② Chưa khai báo thì đi theo hành vi mặc định
        var webhook = ChannelDataResolver.Resolve<DingTalkChannelData>(data)?.Webhook;
        if (webhook.IsNullOrWhiteSpace())
        {
            context.Cancel("Unable to send dingtalk messages because the webhook is not set.");
            return;
        }

        // ③ Khi cần tùy chọn vô hướng thì dùng đọc có kiểu (đừng dùng as)
        var timeout = ChannelDataResolver.GetValue<int>(data, "dingtalk:timeout") ?? 30;

        await SendAsync(webhook, context, cancellationToken);
    }
}
```

### 4.4 Phía định nghĩa (bắt buộc khai báo kênh, nếu không kênh sẽ không được gọi)

```csharp
public class MyNotificationDefinitionProvider : NotificationDefinitionProvider
{
    public override void Define(INotificationDefinitionContext context)
    {
        context.AddGroup("MyGroup", L("MyGroup"))
            .AddNotification("OrderShipped", L("OrderShipped"))
            .WithProviders(
                DingTalkNotificationPublishProvider.ProviderName,
                NotificationProviderNames.SignalR);
    }
}
```

### 4.5 Phía producer

```csharp
var data = new NotificationData();
data.WriteStandardData("Đơn hàng đã giao", "Đơn hàng của bạn đã được giao", Clock.Now, "system");

// Payload do khai báo kiểu dẫn dắt (khuyên dùng)
channelDataSerializer.Write(data, new DingTalkChannelData
{
    Webhook = "https://oapi.dingtalk.com/robot/send?access_token=xxx",
    AtMobiles = "13800000000"
});

await _notificationSender.SendNofiterAsync("OrderShipped", data, user);
```

> **Đừng thêm phương thức mở rộng cho kênh** (ví dụ `WithDingTalkRobot`).
> Framework đã loại bỏ mọi phương thức mở rộng ghi riêng cho kênh: loại payload + serializer
> đã cung cấp lối vào thống nhất có tiền tố, có thể kiểm tra, có thể phát hiện,
> chồng thêm một lớp phương thức mở rộng chỉ tạo ra hai bộ quy ước ghi song song.

---

## 5. Kịch bản năm: di chuyển từ cách viết cũ

### 5.1 Phương thức mở rộng riêng cho kênh đã bị loại bỏ toàn bộ

Phiên bản cũ cung cấp một nhóm phương thức mở rộng ghi/đọc trong module kênh:

| Đã loại bỏ | Cách thay thế |
|---|---|
| `data.WithTextCardMessage(...)`、`WithTemplateCardMessage`、`WithMiniProgramMessage`、`WithMpNewMessage`、`WithVideoMessage`、`WithVoiceMessage`、`WithFileMessage` | `channelDataSerializer.Write(data, new WeChatWorkXxxChannelData { ... })` |
| `data.SetSafe(...)`、`SetEnableIdTrans`、`SetEnableDuplicateCheck`、`SetDuplicateCheckInterval` | `data.TrySetData(WeChatWorkNotificationDataKeys.Xxx, value)` |
| `data.SetParty(...)`、`SetTag(...)` | `data.TrySetData(WeChatWorkNotificationDataKeys.ToParty / ToTag, value)` |
| `data.SetUrl(...)` (WxPusher) | `data.TrySetData(WxPusherNotificationDataKeys.Url, value)` hoặc `channelDataSerializer.Write(data, new WxPusherChannelData { ... })` |
| `data.SetWebhook(...)`、`SetCallbackUrl(...)` (PushPlus) | `data.TrySetData(PushPlusNotificationDataKeys.Webhook / CallbackUrl, value)` |
| `GetSafe()`、`GetUrlOrNull()`、`TryGetMessagePayload()` và các phương thức đọc khác | `INotificationChannelDataResolver` |

**Hằng số khóa (`XxxNotificationDataKeys`) được giữ lại toàn bộ** —— chúng định nghĩa hợp đồng dữ liệu,
không phải API tiện ích. Các phương thức mở rộng `NotificationDefinition` của kênh (ví dụ
`WithAgentId`、`WithTag`) là API **phía định nghĩa**, không liên quan tới khóa dữ liệu, cũng được giữ lại.

### 5.2 Triển khai kênh: thay phép chuyển đổi trần

```csharp
// ❌ Cách viết cũ —— sau khi persist chắc chắn mất hiệu lực, lại không có nhật ký
var safe = data.TryGetData("wx-work:safe") as byte? ?? 0;
var url = data.TryGetData("wx-pusher:url")?.ToString();

// ✅ Cách viết mới (inject INotificationChannelDataResolver)
var safe = channelDataResolver.GetValue<bool>(data, WeChatWorkNotificationDataKeys.Safe);
var payload = channelDataResolver.Resolve<WxPusherChannelData>(data);
var url = payload?.Url;
```

### 5.3 Danh sách thay đổi phá vỡ

| Thay đổi | Ảnh hưởng |
|---|---|
| **Phương thức mở rộng riêng cho kênh đã bị xóa toàn bộ** | `NotificationDataWeChatWorkExtensions`, các `NotificationDataExtensions` của WxPusher / PushPlus đều đã bị loại bỏ. Cách truyền xem bảng đối chiếu ở §4.1 |
| **Lớp tĩnh `NotificationChannelValues` đã bị xóa** | Toàn bộ năng lực chuyển sang service thực thể: `INotificationChannelDataAccessor` (chuyển đổi) và `INotificationChannelDataResolver` (đọc phía kênh). Static API không còn chỗ nào tra được tức là lỗi biên dịch |
| Payload không còn cần (cũng không nên viết nữa) `IsSet` | Tính tồn tại chuyển sang khai báo `Presence`; `IsSet` cũ sẽ không được gọi |
| `NotificationChannelDataSerializer.AddJsonConverter` đã bị loại bỏ | Chuyển sang `INotificationChannelDataJsonSerializer`; converter của payload trừu tượng đăng ký vào tùy chọn JSON |
| Khóa dữ liệu `agentId` của WeChat Work | Hằng số khóa được giữ lại (`WeChatWorkNotificationDataKeys.AgentId`); chỉ phương thức mở rộng ghi bị loại bỏ |

> **Giữ lại**: `XxxNotificationDataKeys` (hợp đồng dữ liệu),
> các phương thức mở rộng `NotificationDefinition` (API phía định nghĩa, ví dụ `WithAgentId`、`WithTag`),
> các `NotificationDefinitionProvider` của từng kênh.

### 5.4 Bảng đối chiếu di chuyển phần đọc

| Phương thức mở rộng cũ | Cách viết mới |
|---|---|
| `data.GetSafe()` | `resolver.GetValue(data, WeChatWorkNotificationDataKeys.Safe, false)` |
| `data.GetEnableIdTrans()` / `GetEnableDuplicateCheck()` | `resolver.GetValue(data, WeChatWorkNotificationDataKeys.EnableIdTrans / EnableDuplicateCheck, false)` |
| `data.GetDuplicateCheckInterval()` | `resolver.GetValue(data, WeChatWorkNotificationDataKeys.DuplicateCheckInterval, 1800)` |
| `data.GetAgentIdOrNull()` / `GetTagOrNull()` / `GetPartyOrNull()` | `resolver.GetOrNull(data, WeChatWorkNotificationDataKeys.AgentId / ToTag / ToParty)` |
| `data.GetUrlOrNull()` (WxPusher) | `resolver.Resolve<WxPusherChannelData>(data)?.Url` |
| `data.GetWebhookOrNull()` (PushPlus) | `resolver.Resolve<WxPusherChannelData>(data)?.Webhook` |
| `data.GetCallbackUrlOrNull()` (PushPlus) | `resolver.Resolve<PushPlusChannelData>(data)?.CallbackUrl` |
| `data.TryGetMessagePayload<T>(key, out var m)` | `resolver.Resolve<TChannelData>(data)` |

---

## 6. Câu hỏi thường gặp

| Hiện tượng | Nguyên nhân | Cách xử lý |
|---|---|---|
| Kênh không được gọi | Định nghĩa thông báo không khai báo tên kênh đó | `WithProviders(...)` hoặc khi gửi truyền `useProviders` |
| Payload "đã viết nhưng không có hiệu lực" | Việc xét tồn tại đã loại khóa đó (đánh dấu `IgnoreWhenMatching`, hoặc `Presence` không khớp kỳ vọng) | Kiểm tra các annotation `Presence` và `IgnoreWhenMatching` |
| Khởi động đã ném `AbpNotificationChannelDataConfigurationException` | Chưa khai báo `Presence` mà không có thuộc tính nào có thể khớp; hoặc `Priority` trùng trong cùng kênh; hoặc thiếu `[NotificationChannelData]` | Sửa theo thông tin ngoại lệ |
| Đồng thời nhận hai tin nhắn WeChat Work | Đã viết nhiều payload, mỗi payload đều gửi | Chỉ giữ lại một payload |
| Thẻ mẫu báo `abstract class and cannot be instantiated` | Kiểu trừu tượng thiếu converter JSON | Do `AbpNotificationsWeChatWorkModule` tự đăng ký vào `AbpSystemTextJsonSerializerOptions`; khi tự build container thì cần tự đăng ký |
| Môi trường production lặng lẽ mất tin nhắn | Dữ liệu payload không hợp lệ (phân giải thất bại) | Phía kênh dùng tổ hợp `IsDeclared` + `Resolve` để báo lỗi rõ ràng; nhật ký sẽ ghi tên khóa thất bại |

---

## 7. Kiểm thử đơn vị

### 7.1 Tách theo module

Dự án kiểm thử tương ứng một-một với module. **Hợp đồng framework** và **kênh cụ thể** tách ra kiểm thử:

| Dự án kiểm thử | Phạm vi bao phủ |
|---|---|
| `tests/LINGYUN.Abp.Notifications.ChannelData.Tests` | **Hợp đồng framework**: chuyển đổi kiểu yếu, xét tồn tại (ba chế độ), kiểm tra thời điểm đăng ký, sắp xếp theo độ ưu tiên, JSON khứ hồi. Dùng stub payload trong chính tệp này |
| `tests/LINGYUN.Abp.Notifications.WeChat.Work.Tests` | Kênh tin nhắn **ứng dụng** WeChat Work |
| `tests/LINGYUN.Abp.Notifications.Webhook.WeChat.Work.Tests` | Kênh **Webhook** WeChat Work |
| `tests/LINGYUN.Abp.Notifications.WeChat.MiniProgram.Tests` | Kênh tin nhắn đăng ký mini program WeChat |
| `tests/LINGYUN.Abp.Notifications.WxPusher.Tests` | Kênh WxPusher |
| `tests/LINGYUN.Abp.Notifications.PushPlus.Tests` | Kênh PushPlus |

### 7.2 Cách viết kiểm thử thống nhất

Mỗi kiểm thử kênh đều đi theo cùng một lộ trình: **new đối tượng tin nhắn trước → serialize qua `IJsonSerializer` ghi vào dữ liệu thông báo → phía kênh xác minh**.

```csharp
public class WeChatWorkChannelData_Tests : AbpNotificationsWeChatWorkTestsBase
{
    [Fact]
    public void Should_Resolve_TextCard_Message()
    {
        // 1. new đối tượng tin nhắn trước
        var message = new TextCardMessage(
            title: "Đã phê duyệt",
            description: "Đơn xin nghỉ phép của bạn đã được phê duyệt",
            url: "https://example.com/leave/123",
            buttonText: "Vào xem");

        // 2. Serialize qua IJsonSerializer rồi ghi vào khóa payload của dữ liệu thông báo
        var data = WriteChannelData(new WeChatWorkTextCardChannelData { TextCard = message });

        // 3. Phía kênh xác minh kết quả khôi phục
        var payload = ChannelDataResolver.Resolve<WeChatWorkTextCardChannelData>(data);

        payload.ShouldNotBeNull();
        payload!.TextCard!.Title.ShouldBe(message.Title);
        payload.TextCard.Url.ShouldBe(message.Url);
    }
}
```

Lớp cơ sở chung `NotificationChannelDataTestsBase<TStartupModule>` (nằm tại
`tests/LINGYUN.Abp.Notifications.Tests`) cung cấp:

| Thành viên | Mô tả |
|---|---|
| `JsonSerializer` | `IJsonSerializer` của ABP, dùng để assert hợp đồng JSON |
| `ChannelDataAccessor` | Phía producer ghi (serialize) |
| `ChannelDataResolver` | Phía kênh phân giải |
| `ChannelDataSerializer` | Serializer phía producer |
| `Serialize(payload)` | Chỉ serialize, dùng để assert hợp đồng tên trường |
| `WriteChannelData(channelData)` | new → serialize → ghi, trả về `NotificationData` |
| `MergeChannelData(data, channelData)` | Gộp nhiều payload vào cùng một dữ liệu thông báo |

> Giá đỡ kiểm thử là kiểm thử tích hợp ABP thật (`AbpIntegratedTest`), vì vậy `IJsonSerializer`
> chính là bản dùng ở môi trường production —— bao gồm chính sách JSON toàn cục và converter đã đăng ký của kênh.
> Việc **gửi thật** của kênh được thay bằng triển khai giả dạng bắt giữ (`FakeSubscribeMessager` /
> `FakeWxPusherMessageSender` / `FakePushPlusMessageSender`),
> nhờ đó có thể assert "nội dung tin nhắn kênh cuối cùng gửi đi", mà không thực sự gọi giao diện bên thứ ba.

### 7.3 Chạy

```bash
# Tất cả
dotnet test aspnet-core/tests/LINGYUN.Abp.Notifications.ChannelData.Tests
dotnet test aspnet-core/tests/LINGYUN.Abp.Notifications.WeChat.Work.Tests
dotnet test aspnet-core/tests/LINGYUN.Abp.Notifications.Webhook.WeChat.Work.Tests
dotnet test aspnet-core/tests/LINGYUN.Abp.Notifications.WeChat.MiniProgram.Tests
dotnet test aspnet-core/tests/LINGYUN.Abp.Notifications.WxPusher.Tests
dotnet test aspnet-core/tests/LINGYUN.Abp.Notifications.PushPlus.Tests
```
