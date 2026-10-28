# LINGYUN.Abp.Dapr.Actors.AspNetCore.Wrapper

Mô-đun đóng gói phản hồi (response wrapper) cho Dapr Actors ASP.NET Core, dùng để xử lý việc đóng gói và giải nén phản hồi khi gọi phương thức Actor.

## Tính năng

* Tự động đóng gói/giải nén kết quả phản hồi của Actor
* Tích hợp với hệ thống đóng gói của ABP
* Hỗ trợ xử lý lỗi khi gọi phương thức Actor
* Hỗ trợ cấu hình mã thành công/lỗi
* Tích hợp với Dapr.Actors.AspNetCore
* Hỗ trợ định dạng đóng gói phản hồi tùy chỉnh
* Tùy chọn kiểm soát đóng gói linh hoạt

## Cấu hình sử dụng

Mô-đun được tham chiếu theo nhu cầu:

```csharp
[DependsOn(
    typeof(AbpDaprActorsAspNetCoreModule),
    typeof(AbpWrapperModule)
)]
public class YouProjectModule : AbpModule
{
}
```

## Tùy chọn cấu hình

Mô-đun sử dụng `AbpWrapperOptions` từ gói `LINGYUN.Abp.Wrapper` để cấu hình:

```json
{
    "Wrapper": {
        "IsEnabled": true,  // Bật/tắt đóng gói phản hồi
        "CodeWithSuccess": "0",  // Mã thành công trong phản hồi đã đóng gói
        "HttpStatusCode": 200,  // Mã trạng thái HTTP mặc định của phản hồi đã đóng gói
        "WrapOnError": true,  // Có đóng gói phản hồi lỗi hay không
        "WrapOnSuccess": true  // Có đóng gói phản hồi thành công hay không
    }
}
```

## Ví dụ triển khai

1. Định nghĩa giao diện Actor

```csharp
public interface ICounterActor : IActor
{
    Task<int> GetCountAsync();
    Task IncrementCountAsync();
}
```

2. Triển khai Actor

```csharp
public class CounterActor : Actor, ICounterActor
{
    private const string CountStateName = "count";

    public CounterActor(ActorHost host) : base(host)
    {
    }

    public async Task<int> GetCountAsync()
    {
        var count = await StateManager.TryGetStateAsync<int>(CountStateName);
        return count.HasValue ? count.Value : 0;
    }

    public async Task IncrementCountAsync()
    {
        var currentCount = await GetCountAsync();
        await StateManager.SetStateAsync(CountStateName, currentCount + 1);
    }
}
```

## Định dạng phản hồi

Khi bật đóng gói, phản hồi của phương thức Actor sẽ có định dạng sau:

```json
{
    "code": "0",  // Mã phản hồi, mặc định "0" nghĩa là thành công
    "message": "Success",  // Thông điệp phản hồi
    "details": null,  // Chi tiết bổ sung (tùy chọn)
    "result": {  // Dữ liệu phản hồi thực tế
        // ... Giá trị trả về của phương thức Actor
    }
}
```

## Xử lý lỗi

Mô-đun tự động xử lý lỗi khi gọi phương thức Actor:
* Đối với phản hồi đã đóng gói:
  * Giải nén phản hồi và kiểm tra mã
  * Nếu mã không khớp với `CodeWithSuccess`, ném ra `AbpRemoteCallException`
  * Bao gồm thông điệp lỗi, chi tiết và mã trong ngoại lệ
  * Hỗ trợ ánh xạ mã lỗi tùy chỉnh
* Đối với lỗi thời gian chạy của Actor:
  * Tự động đóng gói thành phản hồi lỗi chuẩn
  * Giữ nguyên thông tin ngoại lệ gốc
  * Bao gồm thông tin ngữ cảnh liên quan đến Actor

### Ví dụ phản hồi lỗi

```json
{
    "code": "ERROR_001",
    "message": "Gọi phương thức Actor thất bại",
    "details": "Truy cập trạng thái của Actor 'counter' thất bại",
    "result": null
}
```

## Cách dùng nâng cao

### 1. Kiểm soát đóng gói phản hồi

Có thể kiểm soát việc đóng gói phản hồi của từng lần gọi Actor thông qua HTTP header:

```csharp
// Thêm vào header của yêu cầu
var headers = new Dictionary<string, string>
{
    { "X-Abp-Wrap-Result", "true" },  // Buộc bật đóng gói
    // hoặc
    { "X-Abp-Dont-Wrap-Result", "true" }  // Buộc tắt đóng gói
};

// Sử dụng trong phương thức Actor
public async Task<int> GetCountAsync()
{
    var context = ActorContext.GetContext();
    context.Headers.Add("X-Abp-Wrap-Result", "true");
    
    var count = await StateManager.TryGetStateAsync<int>(CountStateName);
    return count.HasValue ? count.Value : 0;
}
```

### 2. Xử lý lỗi tùy chỉnh

```csharp
public class CustomActorErrorHandler : IAbpWrapperErrorHandler
{
    public Task HandleAsync(AbpWrapperErrorContext context)
    {
        if (context.Exception is ActorMethodInvocationException actorException)
        {
            // Logic xử lý lỗi Actor tùy chỉnh
            context.Response = new WrapperResponse
            {
                Code = "ACTOR_ERROR",
                Message = actorException.Message,
                Details = actorException.ActorId
            };
        }
        return Task.CompletedTask;
    }
}
```

## Lưu ý

* Việc đóng gói phản hồi có thể được kiểm soát bằng các cách sau:
  * Cài đặt toàn cục trong file cấu hình
  * Header HTTP kiểm soát từng yêu cầu
  * Kiểm soát động trong phương thức Actor
* Phản hồi lỗi của phương thức Actor sẽ giữ nguyên cấu trúc lỗi gốc
* Mô-đun tích hợp với hệ thống xử lý lỗi dịch vụ từ xa của ABP
* Nên sử dụng thống nhất đóng gói phản hồi trong kiến trúc microservice
* Định dạng đóng gói có thể tùy chỉnh bằng cách kế thừa `IAbpWrapperResponseBuilder`
* Lỗi thao tác trạng thái Actor sẽ được đóng gói và xử lý đúng cách

[Xem bản tiếng Anh](README.EN.md)
