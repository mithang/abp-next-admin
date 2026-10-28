# LINGYUN.Abp.Dapr.Actors

Mô-đun proxy client Dapr.IActor

## Tính năng

* Tạo proxy động cho Dapr Actors
* Tích hợp với hệ thống dịch vụ từ xa ABP
* Hỗ trợ xác thực và phân quyền Actor
* Hỗ trợ đa tenant
* Xử lý yêu cầu/phản hồi tự động
* Xử lý lỗi tùy chỉnh
* Hỗ trợ tiêu đề văn hóa và ngôn ngữ

## Cấu hình sử dụng

Mô-đun được tham chiếu theo nhu cầu

```csharp
[DependsOn(typeof(AbpDaprActorsModule))]
public class YouProjectModule : AbpModule
{
    public override void ConfigureServices(ServiceConfigurationContext context)
    {
        // Đăng ký proxy tương tự như mô-đun Volo.Abp.Http.Client
        context.Services.AddDaprActorProxies(
            typeof(YouProjectActorInterfaceModule).Assembly, // Tìm kiếm định nghĩa IActor trong mô-đun YouProjectActorInterfaceModule
            RemoteServiceName
        );
    }
}
```

## Tùy chọn cấu hình

```json
{
    "RemoteServices": {
        "Default": {
            "BaseUrl": "http://localhost:3500",  // Bắt buộc, endpoint HTTP Dapr
            "DaprApiToken": "your-api-token",    // Tùy chọn, Dapr API Token
            "RequestTimeout": "30000"            // Tùy chọn, thời gian chờ yêu cầu (mili giây, mặc định: 30000)
        }
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

3. Sử dụng phía client

```csharp
public class CounterService
{
    private readonly ICounterActor _counterActor;

    public CounterService(ICounterActor counterActor)
    {
        _counterActor = counterActor;
    }

    public async Task<int> GetAndIncrementCountAsync()
    {
        var count = await _counterActor.GetCountAsync();
        await _counterActor.IncrementCountAsync();
        return count;
    }
}
```

## Lưu ý

* Phương thức Actor phải trả về `Task` hoặc `Task<T>`
* Phương thức Actor tối đa chỉ có một tham số
* Thể hiện Actor là đơn luồng, mỗi lần chỉ xử lý một yêu cầu
* Trạng thái Actor do runtime Dapr quản lý
* Mô-đun tự động xử lý:
  * Tiêu đề xác thực
  * Ngữ cảnh tenant
  * Thông tin văn hóa
  * Hết thời gian chờ yêu cầu
  * Xử lý lỗi

## Xử lý lỗi

Mô-đun cung cấp xử lý lỗi tùy chỉnh cho lời gọi Actor:
* `AbpDaprActorCallException`：Được ném ra khi lời gọi phương thức Actor thất bại
* `ActorMethodInvocationException`：Chứa thông tin chi tiết về lỗi
* Phản hồi lỗi bao gồm:
  * Thông điệp lỗi
  * Mã lỗi
  * Kiểu ngoại lệ gốc

[Xem thêm](README.EN.md)
