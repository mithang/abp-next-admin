# Phân tích cấu trúc dữ liệu kênh thông báo

Khung tải trọng kiểu mạnh (dữ liệu kênh) hướng tới **kênh phát hành**.

Vấn đề cốt lõi cần giải quyết: khi nhà sản xuất dùng gói thuộc tính kiểu yếu để biểu đạt ngữ nghĩa riêng của kênh,
sẽ gặp các trường hợp "đã ghi khóa nhưng kênh không bao giờ đọc được", "sau khi lưu trữ bền vững, cấu hình lặng lẽ mất hiệu lực", "kiểu tải trọng phải đoán theo thứ tự dò trường".

---

## 1. Bối cảnh vấn đề

Dữ liệu thông báo `NotificationData` về cơ bản là `ExtraPropertyDictionary` (gói thuộc tính kiểu yếu),
trong các chuỗi sau chắc chắn trải qua đi-về JSON:

| Chuỗi | Vị trí |
|---|---|
| Đọc lại sau khi lưu trữ bền vững | `NotificationStore.InsertNotificationAsync` → `Notification.SetData` |
| Thử lại khi thất bại | `NotificationPublishJob` đọc từ kho lưu trữ rồi phát hành lại |
| Phân phối liên tiến trình | `NotificationEto` qua EventBus |

Sau khi đi-về JSON, kiểu thời gian chạy của giá trị sẽ thay đổi:

```
byte 1  ->  long 1 / JsonElement(Number)
int 1   ->  long 1 / JsonElement(Number)
```

Vì vậy phép chuyển đổi trần trong triển khai cũ sẽ **luôn thất bại mà không có bất kỳ log nào**:

```csharp
// Ghi int, đọc byte? —— toán tử as đối với int đã boxing luôn trả về null
notificationData.TrySetData(Safe, safe ? 1 : 0);
var safe = notificationData.TryGetData(Safe) as byte?;   // Luôn là null
```

Các tùy chọn bị ảnh hưởng: `safe`, `enable_id_trans`, `enable_duplicate_check` của WeChat Doanh nghiệp.

---

## 2. Nguyên tắc thiết kế

1. **Tất cả đều lấy qua dependency injection, không cung cấp API tĩnh**
   —— việc chuyển đổi phụ thuộc vào cấu hình JSON và log, điểm vào tĩnh sẽ ép framework duy trì một bộ "triển khai dự phòng dùng được ở dạng tĩnh",
   làm tăng liên kết ẩn về trạng thái và thứ tự khởi tạo.
2. **JSON được trừu tượng hóa qua interface chuyên dụng**, mặc định tái sử dụng cấu hình toàn cục ABP.
3. **Tính tồn tại biểu đạt dạng khai báo + kiểm tra bắt buộc tại thời điểm đăng ký**, để lỗi cấu hình lộ ra ngay giai đoạn khởi động.
4. **Logic chuyển đổi ở cả hai phía đọc/ghi dùng chung một triển khai** (`INotificationChannelDataAccessor`),
   tránh "quy tắc phía ghi và phía đọc không nhất quán".

---

## 3. Thành phần của framework

### 3.1 Hợp đồng (`LINGYUN.Abp.Notifications.Core`, thư mục con `ChannelData/`)

| File | Kiểu | Vai trò |
|---|---|---|
| `NotificationChannelData.cs` | `NotificationChannelData` | Lớp cơ sở tải trọng (đánh dấu rỗng, xem §4) |
| `NotificationChannelDataAttribute.cs` | `NotificationChannelDataAttribute` | Khai báo kênh, thứ tự khớp `Priority`, chế độ tồn tại `Presence` |
| `NotificationChannelDataPresenceMode.cs` | `NotificationChannelDataPresenceMode` | Chế độ xác định tính tồn tại (None / DeclaredProperties / AnyDeclaredProperty) |
| `NotificationChannelPropertyAttribute.cs` | `NotificationChannelPropertyAttribute` | Khai báo các thuộc tính tham gia đọc/ghi; `Name` tương thích khóa cũ; `IgnoreWhenMatching` loại trừ mục đọc tùy chọn |
| `NotificationChannelDataFormat.cs` | `NotificationChannelDataFormat` | Định dạng lưu trữ thuộc tính (Auto / Json) |
| `NotificationChannelDataDescriptor.cs` | `NotificationChannelDataDescriptor` | Mô tả tải trọng (metadata chỉ đọc) |

### 3.2 Triển khai (`LINGYUN.Abp.Notifications`, thư mục con `ChannelData/`)

Mỗi kiểu một file riêng (interface và triển khai tách file).

| Interface | Triển khai mặc định | Vai trò |
|---|---|---|
| `INotificationChannelDataJsonSerializer` | `AbpNotificationChannelDataJsonSerializer` | Trừu tượng JSON, mặc định ủy thác cho ABP `IJsonSerializer` |
| `INotificationChannelDataAccessor` | `NotificationChannelDataAccessor` | **Triển khai duy nhất của chuyển đổi kiểu yếu + JSON**, đọc/ghi dùng chung |
| `INotificationChannelDataPresenceProvider` | `NotificationChannelDataPresenceProvider` | Tạo và cache delegate xác định tính tồn tại (bao gồm kiểm tra tại thời điểm đăng ký) |
| `INotificationChannelDataSerializer` | `NotificationChannelDataSerializer` | Điểm vào ghi phía nhà sản xuất |
| `INotificationChannelDataResolver` | `NotificationChannelDataResolver` | Điểm vào phân tích phía kênh |

Các kiểu phụ trợ: `AbpNotificationChannelDataOptions` (đăng ký tải trọng),
`NotificationChannelDataDescriptorList`, `AbpNotificationChannelDataConfigurationException`,
`NotificationChannelDataPresence` (xác định tính tồn tại, thuần tĩnh),
`NotificationChannelDataProperty` / `NotificationChannelDataPropertyCache` (metadata thuộc tính),
`NotificationChannelDataValueTypes` (xác định kiểu giá trị).

### 3.3 Cách đăng ký: module `PostConfigure<>`

Module kênh khai báo tải trọng trong `AbpModule.ConfigureServices` của chính nó:

```csharp
[DependsOn(typeof(AbpNotificationsModule))]
public class AbpNotificationsMyChannelModule : AbpModule
{
    public override void ConfigureServices(ServiceConfigurationContext context)
    {
        Configure<AbpNotificationsPublishOptions>(options =>
        {
            options.PublishProviders.Add<MyNotificationPublishProvider>();
        });

        // Khai báo các dạng tải trọng mà kênh này hỗ trợ (kiểm tra hợp đồng tồn tại ngay tại thời điểm đăng ký)
        Configure<AbpNotificationChannelDataOptions>(options =>
        {
            options.Add<MyChannelData>();
        });
    }
}
```

**Vì sao không cần lớp cấu hình bổ sung, cũng không tồn tại vấn đề thứ tự**:
`AbpNotificationChannelDataOptions` là đối tượng **dữ liệu thuần** —— kiểm tra tính tồn tại tại thời điểm đăng ký chỉ phụ thuộc
vào metadata khai báo trên kiểu tải trọng (`[NotificationChannelData]` / `[NotificationChannelProperty]`),
không phụ thuộc vào bất kỳ service nào. Logic xác định nằm ở `NotificationChannelDataPresence` thuần tĩnh,
vì vậy `options.Add(...)` trước khi container được xây dựng, gọi theo bất kỳ thứ tự module nào cũng hoạt động bình thường.

Tương ứng, `NotificationChannelDataPresenceConfigurer` vốn được đưa vào trước đây cho "bộ cung cấp xác định tính tồn tại"
đã bị xóa, thuộc tính `PresenceProvider` trên đối tượng options cũng đã bị loại bỏ. `INotificationChannelDataPresenceProvider`
được giữ lại dưới dạng lớp bao mỏng theo hình thức dependency injection (ủy thác cho triển khai tĩnh), để bộ phân tích và bộ tuần tự hóa sử dụng.

---

## 4. Quy ước đặt tên khóa dữ liệu

### 4.1 Bắt buộc mang tiền tố của kênh này

Tất cả khóa riêng của kênh đều thống nhất dùng dạng `<tiền tố kênh><tên khóa>`, tránh các khóa của kênh khác nhau xung đột lẫn nhau trong cùng một
gói thuộc tính dữ liệu thông báo:

| Kênh | Tiền tố | Khóa |
|---|---|---|
| WeChat Doanh nghiệp | `wx-work:` | `wx-work:text_card_message`、`wx-work:template_card_message`、`wx-work:safe` … |
| Webhook WeChat Doanh nghiệp | `wx-work-hook:` | `wx-work-hook:text`、`wx-work-hook:markdown_v2`、`wx-work-hook:template_card` … |
| Mini Program WeChat | `wx-mp:` | `wx-mp:template_id`、`wx-mp:redirect_page`、`wx-mp:weapp_state`、`wx-mp:weapp_language` |
| WxPusher | `wx-pusher:` | `wx-pusher:url` |
| PushPlus | `push-plus:` | `push-plus:webhook`、`push-plus:callback` |

> **Khóa registry kênh và tiền tố khóa đều là namespace độc lập**. Tin nhắn ứng dụng WeChat Doanh nghiệp và Webhook là hai phương thức truyền tải,
> hai mô hình vật mang, vì vậy khóa registry (`WeChat.Work` / `WeChat.Work.Webhook`) và tiền tố khóa
> (`wx-work:` / `wx-work-hook:`) đều phải tách riêng ——
> nếu không, khi cùng một thông báo được hai kênh đăng ký đồng thời, tải trọng sẽ bị cả hai bên phân tích và mỗi bên gửi một bản.

Mỗi kênh đều phơi bày hằng số dưới dạng `XxxNotificationDataKeys`, và đưa ra `Prefix`:

```csharp
public static class MyChannelNotificationDataKeys
{
    public const string Prefix = "my-channel:";

    public const string TemplateId = Prefix + "template_id";
    public const string RedirectPage = Prefix + "redirect_page";
}
```

> Ngoại lệ duy nhất là các khóa của **dữ liệu chuẩn thông báo** (`title` / `message` / `description` /
> `formUser` / `createTime`), chúng được định nghĩa bởi `NotificationData.WriteStandardData`,
> thuộc về quy ước chung dùng chung cho mọi kênh, không thêm tiền tố.

### 4.2 Đọc không phân biệt hoa thường

Quy tắc khớp khóa là **khớp chính xác được ưu tiên, nếu không khớp mới bỏ qua hoa thường**,
vì vậy nhà sản xuất dùng `wx-work:text_card_message`, `WX-WORK:TEXT_CARD_MESSAGE`
hay `Wx-Work:Text_Card_Message` đều khớp được.

Quy tắc này được triển khai thống nhất trong `INotificationChannelDataAccessor.TryGetRawValue`,
`NotificationChannelDataPresence.ContainsKey` dùng cùng một quy tắc,
đảm bảo "xác định tính tồn tại" và "đọc thực tế" không xuất hiện sự không nhất quán về quy tắc.

### 4.3 Các khóa không tiền tố còn tồn tại từ trước

Kênh Mini Program WeChat ở phiên bản đầu đã dùng khóa không tiền tố (`TemplateId` v.v.).
Để các nhà sản xuất đã cài đặt nâng cấp trơn tru, các khóa này được giữ trong
`WeChatMiniProgramNotificationDataKeys.Legacy`, kênh khi phân tích sẽ **chỉ đọc dự phòng**
(khóa có tiền tố được ưu tiên), và khi khớp khóa cũ sẽ ghi log cảnh báo để thúc đẩy di chuyển.

Code mới hãy luôn dùng hằng số có tiền tố.

### 4.4 Nhiều khóa của nhiều kênh có thể cùng tồn tại trong một đối tượng dữ liệu

Các tiền tố khác nhau không xung đột lẫn nhau, vì vậy cùng một thông báo có thể đồng thời điều khiển nhiều kênh:

```csharp
data.TrySetData(WeChatWorkNotificationDataKeys.ToParty, "1|2");          // Tin nhắn ứng dụng
data.TrySetData(WeChatWorkWebhookNotificationDataKeys.Markdown, "# Cảnh báo"); // Webhook
```

Mỗi kênh chỉ phân tích tải trọng mang tiền tố của mình, không gây nhiễu lẫn nhau (xem §9).

---

## 5. Xác định tính tồn tại

**Tính tồn tại dạng khai báo + kiểm tra bắt buộc tại thời điểm đăng ký**:

```csharp
public enum NotificationChannelDataPresenceMode
{
    None = 0,                  // Luôn tồn tại (không phụ thuộc vào dữ liệu thông báo)
    DeclaredProperties = 1,    // Tất cả thuộc tính tham gia khớp đều tồn tại (mặc định)
    AnyDeclaredProperty = 2    // Tồn tại bất kỳ một thuộc tính nào tham gia khớp
}
```

Quy tắc kiểm tra (thực thi khi đăng ký, tức giai đoạn khởi động):

| Trường hợp | Kết quả |
|---|---|
| Đã khai báo xác định theo khóa, nhưng không có thuộc tính nào có thể khớp | Ném `AbpNotificationChannelDataConfigurationException` |
| Khai báo tường minh `Presence = None` | Hợp lệ, tải trọng luôn tồn tại |
| Thiếu `[NotificationChannelData]` | Ném `AbpNotificationChannelDataConfigurationException` |
| `Priority` trùng lặp trong cùng kênh | Ném `AbpNotificationChannelDataConfigurationException` |

Như vậy, "quên định nghĩa tính tồn tại" từ việc lặng lẽ làm mất tin nhắn trở thành thất bại ngay khi khởi động.

---

## 6. Trừu tượng hóa tuần tự hóa JSON

```csharp
public interface INotificationChannelDataJsonSerializer
{
    string Serialize(object value, Type valueType);
    object? Deserialize(string json, Type targetType);
}

[Dependency(TryRegister = true)]
public class AbpNotificationChannelDataJsonSerializer
    : INotificationChannelDataJsonSerializer, ISingletonDependency
{
    protected IJsonSerializer JsonSerializer { get; }

    public string Serialize(object value, Type valueType) => JsonSerializer.Serialize(value);

    public object? Deserialize(string json, Type targetType)
        => json.IsNullOrWhiteSpace() ? null : JsonSerializer.Deserialize(targetType, json);
}
```

Các năng lực toàn cục được tái sử dụng: chính sách camelCase, định dạng thời gian, chuyển đổi enum,
decorator `AbpSystemTextJsonSerializerModifiersOptions`, Converter tùy chỉnh.

Khi cần mã hóa/nén/định dạng riêng, chỉ cần thay thế triển khai của interface này.

> **Lưu ý**: tích hợp JSON mà dự án dùng là `Volo.Abp.Json.SystemTextJson`,
> vì vậy `JsonConverter` của tải trọng phức tạp phải triển khai phiên bản System.Text.Json
> (xem `TemplateCardSystemTextJsonConverter`).

---

## 7. Tách khỏi triển khai JSON

`NotificationChannelDataAccessor` trước khi chuyển đổi sẽ **khôi phục biểu diễn trung gian JSON**:

| Triển khai JSON | Giá trị trong gói thuộc tính |
|---|---|
| System.Text.Json | `JsonElement` |
| Newtonsoft.Json | `JValue` / giá trị CLR nguyên thủy |

Cả hai đều khôi phục trước thành giá trị nguyên thủy CLR (số được khôi phục thành kiểu số nhỏ nhất có thể dùng), rồi mới chuyển đổi kiểu yếu.
Vì vậy cùng một logic có hành vi nhất quán dưới hai triển khai JSON.

---

## 8. Cách dùng phía nhà sản xuất

### 8.1 Khai báo tải trọng

```csharp
[NotificationChannelData(MyProvider.ProviderName, Priority = 100)]
public class MyChannelData : NotificationChannelData
{
    [NotificationChannelProperty("my:template_id")]
    public string? TemplateId { get; set; }

    // Mục đọc tùy chọn: không tham gia xác định tính tồn tại
    [NotificationChannelProperty("my:page", IgnoreWhenMatching = true)]
    public string? Page { get; set; }
}
```

### 8.2 Đăng ký trong module

```csharp
[DependsOn(typeof(AbpNotificationsModule))]
public class AbpNotificationsMyChannelModule : AbpModule
{
    public override void ConfigureServices(ServiceConfigurationContext context)
    {
        Configure<AbpNotificationsPublishOptions>(options =>
        {
            options.PublishProviders.Add<MyNotificationPublishProvider>();
        });

        Configure<AbpNotificationChannelDataOptions>(options =>
        {
            options.Add<MyChannelData>();
        });
    }
}
```

### 8.3 Ghi dữ liệu thông báo

```csharp
public class MyProducer
{
    private readonly INotificationChannelDataSerializer _channelDataSerializer;

    public MyProducer(INotificationChannelDataSerializer channelDataSerializer)
    {
        _channelDataSerializer = channelDataSerializer;
    }

    public void Build(NotificationData data)
    {
        _channelDataSerializer.Write(data, new MyChannelData { TemplateId = "tpl-1" });
    }
}
```

---

## 9. Cách dùng phía kênh

```csharp
public class MyProvider : NotificationPublishProvider
{
    protected INotificationChannelDataResolver ChannelDataResolver
        => ServiceProvider.LazyGetRequiredService<INotificationChannelDataResolver>();

    protected override Task PublishAsync(NotificationPublishContext context, CancellationToken ct)
    {
        var data = context.Notification.Data;

        // Phân tích theo kiểu
        var payload = ChannelDataResolver.Resolve<MyChannelData>(data);

        // Phân biệt "chưa ghi" và "đã ghi nhưng dữ liệu không hợp lệ"
        if (ChannelDataResolver.IsDeclared(data, typeof(MyChannelData)) && payload == null)
        {
            context.Cancel("The payload can not be parsed.");
            return Task.CompletedTask;
        }

        // Tùy chọn vô hướng
        var safe = ChannelDataResolver.GetValue(data, "my:safe", false);

        return Task.CompletedTask;
    }
}
```

---

## 10. Đảm bảo hành vi

| Kịch bản | Hành vi |
|---|---|
| Giá trị chưa thiết lập | Trả về `null` (thay vì bị giá trị mặc định nuốt mất), có thể phân biệt "chưa thiết lập" với "false/0 tường minh" |
| Sau khi đi-về JSON | `byte`/`int`/`long`/`string`/`bool`/`JsonElement` đều chuyển đổi đúng |
| Khóa không nhất quán hoa thường | Khớp không phân biệt hoa thường, tương thích khóa cũ (như `TemplateId`) |
| Dữ liệu không hợp lệ | Không ném ngoại lệ; `Resolve` trả về `null` và ghi log cảnh báo, `IsDeclared` vẫn là `true` |
| Chưa khai báo quy tắc tồn tại | Ném `AbpNotificationChannelDataConfigurationException` tại thời điểm đăng ký |
| Thiếu đặc tính kênh | Ném `AbpNotificationChannelDataConfigurationException` tại thời điểm đăng ký |
| Xung đột độ ưu tiên trong cùng kênh | Ném `AbpNotificationChannelDataConfigurationException` tại thời điểm đăng ký |
| Kiểu tải trọng chưa ánh xạ tới vật mang tin nhắn | Ném `AbpNotificationChannelDataConfigurationException` khi khởi tạo (fail-fast) |

---

## 11. Danh sách kiểm tra khi mở rộng kênh mới

1. Định nghĩa kiểu tải trọng và gắn `[NotificationChannelData]`;
2. Ít nhất gắn `[NotificationChannelProperty]` cho một "thuộc tính định danh" (mục đọc tùy chọn thêm `IgnoreWhenMatching = true`);
3. Khi cần "chỉ cần bất kỳ một khóa nào" thì đặt `Presence` thành `AnyDeclaredProperty`; khi cần "luôn tồn tại" thì đặt thành `None`;
4. Đăng ký tải trọng trong `Configure<AbpNotificationChannelDataOptions>` của module này;
5. Trong triển khai kênh **đừng** xuất hiện phép chuyển đổi trần kiểu `as byte?` / `as int?`, hãy dùng `INotificationChannelDataResolver`;
6. Khi cần phân biệt "chưa khai báo" và "dữ liệu không hợp lệ", hãy kết hợp `IsDeclared` với `Resolve`;
7. Tải trọng kiểu trừu tượng cần đăng ký bộ chuyển đổi kiểu JSON (chú ý triển khai JSON: STJ hoặc Newtonsoft).
