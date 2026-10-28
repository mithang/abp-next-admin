# LINGYUN.Abp.Dapr.Actors.AspNetCore

Tích hợp khung ABP cho Dapr.Asp.NetCore, quét danh sách dịch vụ Actor được triển khai bên trong assembly và đăng ký hàng loạt thành Dapr.Actors

## Tính năng

* Đăng ký dịch vụ Actor tự động
* Tích hợp với hệ thống dependency injection của ABP
* Hỗ trợ tên loại Actor tùy chỉnh thông qua `RemoteServiceAttribute`
* Cấu hình runtime Actor thông qua `ActorRuntimeOptions`
* Ánh xạ endpoint Actor tự động
* Xác thực giao diện Actor

## Cấu hình sử dụng

Mô-đun được tham chiếu theo nhu cầu

```csharp
[DependsOn(typeof(AbpDaprActorsAspNetCoreModule))]
public class YouProjectModule : AbpModule
{
    public override void PreConfigureServices(ServiceConfigurationContext context)
    {
        // Cấu hình tùy chọn runtime Actor
        PreConfigure<ActorRuntimeOptions>(options =>
        {
            options.ActorIdleTimeout = TimeSpan.FromMinutes(60);
            options.ActorScanInterval = TimeSpan.FromSeconds(30);
            options.DrainOngoingCallTimeout = TimeSpan.FromSeconds(30);
            options.DrainRebalancedActors = true;
            options.RemindersStoragePartitions = 7;
        });
    }
}
```

## Ví dụ triển khai

1. Định nghĩa giao diện Actor

```csharp
[RemoteService("counter")] // Tùy chọn: tên loại Actor tùy chỉnh
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

Mô-đun sẽ tự động:
1. Phát hiện triển khai `CounterActor`
2. Đăng ký nó vào Dapr.Actors
3. Cấu hình runtime Actor
4. Ánh xạ endpoint Actor

## Cấu hình runtime Actor

Mô-đun hỗ trợ mọi cấu hình runtime Actor Dapr tiêu chuẩn thông qua `ActorRuntimeOptions`:

```csharp
PreConfigure<ActorRuntimeOptions>(options =>
{
    // Cài đặt thời gian chờ Actor
    options.ActorIdleTimeout = TimeSpan.FromMinutes(60);
    options.ActorScanInterval = TimeSpan.FromSeconds(30);
    
    // Cài đặt dọn dẹp
    options.DrainOngoingCallTimeout = TimeSpan.FromSeconds(30);
    options.DrainRebalancedActors = true;
    
    // Cài đặt nhắc nhở
    options.RemindersStoragePartitions = 7;
    
    // Cài đặt tuần tự hoá tùy chỉnh
    options.JsonSerializerOptions = new JsonSerializerOptions
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase
    };
});
```

## Lưu ý quan trọng

* Triển khai Actor phải được đăng ký trong container dependency injection
* Giao diện Actor phải kế thừa từ `IActor`
* Tên loại Actor có thể tùy chỉnh bằng `RemoteServiceAttribute`
* Mô-đun sử dụng hệ thống định tuyến endpoint của ABP để tự động ánh xạ endpoint Actor
* Tùy chọn runtime Actor nên được cấu hình trong giai đoạn `PreConfigureServices`

## Ánh xạ endpoint

Mô-đun tự động ánh xạ các endpoint Actor sau:
* `/dapr/actors/{actorType}/{actorId}/method/{methodName}`
* `/dapr/actors/{actorType}/{actorId}/state`
* `/dapr/actors/{actorType}/{actorId}/reminders/{reminderName}`
* `/dapr/actors/{actorType}/{actorId}/timers/{timerName}`

[View English](README.EN.md)
