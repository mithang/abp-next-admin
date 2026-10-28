# LINGYUN.Abp.Dapr

Module cơ sở tích hợp Dapr, triển khai DaprClient singleton có tên trong tài liệu Dapr

See: https://docs.dapr.io/developing-applications/sdks/dotnet/dotnet-client/dotnet-daprclient-usage

## Tính năng

* Hỗ trợ tạo instance DaprClient mặc định và có tên
* Hỗ trợ cấu hình endpoint HTTP và gRPC
* Hỗ trợ tùy chỉnh tùy chọn tuần tự hóa JSON
* Hỗ trợ xác thực bằng Dapr API Token
* Hỗ trợ cấu hình kênh gRPC
* Hỗ trợ mở rộng cấu hình instance DaprClient và cấu hình build
* Hỗ trợ nhiều kết nối Dapr Sidecar
* Hỗ trợ tùy chỉnh hành vi DaprClient

## Tùy chọn cấu hình

```json
{
  "Dapr": {
    "Client": {
      "DaprApiToken": "your-api-token",  // Tùy chọn, Dapr API Token
      "HttpEndpoint": "http://localhost:3500",  // Tùy chọn, endpoint HTTP
      "GrpcEndpoint": "http://localhost:50001",  // Tùy chọn, endpoint gRPC
      "JsonSerializerOptions": {  // Tùy chọn, tùy chọn tuần tự hóa JSON
        "PropertyNamingPolicy": "CamelCase",
        "PropertyNameCaseInsensitive": true,
        "WriteIndented": true,
        "DefaultIgnoreCondition": "WhenWritingNull"
      },
      "GrpcChannelOptions": {  // Tùy chọn, tùy chọn kênh gRPC
        "Credentials": "Insecure",
        "MaxReceiveMessageSize": 1048576,
        "MaxSendMessageSize": 1048576
      }
    }
  }
}
```

## Sử dụng cấu hình

Tham chiếu module theo nhu cầu:

```csharp
[DependsOn(typeof(AbpDaprModule))]
public class YouProjectModule : AbpModule
{
    public override void ConfigureServices(ServiceConfigurationContext context)
    {
        // Tạo một DaprClient
        context.Services.AddDaprClient();

        // Tạo một DaprClient có tên
        context.Services.AddDaprClient("__DaprClient");
        
        // Cấu hình tùy chọn DaprClient
        Configure<DaprClientFactoryOptions>(options =>
        {
            options.HttpEndpoint = "http://localhost:3500";
            options.GrpcEndpoint = "http://localhost:50001";
            options.DaprApiToken = "your-api-token";
            
            // Thêm action cấu hình DaprClient
            options.DaprClientActions.Add(client =>
            {
                // Cấu hình instance DaprClient
            });
            
            // Thêm action cấu hình DaprClientBuilder
            options.DaprClientBuilderActions.Add(builder =>
            {
                // Cấu hình DaprClientBuilder
            });
        });
    }
}
```

## Cách dùng nâng cao

### 1. Cấu hình DaprClient

```csharp
public override void ConfigureServices(ServiceConfigurationContext context)
{
    // Cấu hình DaprClient có tên
    context.Services.AddDaprClient("CustomClient", builder =>
    {
        // Cấu hình endpoint HTTP
        builder.UseHttpEndpoint("http://localhost:3500");
        
        // Cấu hình endpoint gRPC
        builder.UseGrpcEndpoint("http://localhost:50001");
        
        // Cấu hình API Token
        builder.UseDaprApiToken("your-api-token");
        
        // Cấu hình tùy chọn tuần tự hóa JSON
        builder.UseJsonSerializerOptions(new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            PropertyNameCaseInsensitive = true
        });
        
        // Cấu hình tùy chọn kênh gRPC
        builder.UseGrpcChannelOptions(new GrpcChannelOptions
        {
            MaxReceiveMessageSize = 1024 * 1024,
            MaxSendMessageSize = 1024 * 1024
        });
    });
}
```

### 2. Sử dụng DaprClient

```csharp
public class YourService
{
    private readonly IDaprClientFactory _daprClientFactory;

    public YourService(IDaprClientFactory daprClientFactory)
    {
        _daprClientFactory = daprClientFactory;
    }

    public async Task InvokeMethodAsync()
    {
        // Sử dụng client mặc định
        var defaultClient = _daprClientFactory.CreateClient();
        
        // Sử dụng client có tên
        var namedClient = _daprClientFactory.CreateClient("CustomClient");
        
        // Gọi phương thức của service
        var response = await defaultClient.InvokeMethodAsync<OrderDto>(
            HttpMethod.Get,
            "order-service",  // ID service đích
            "api/orders/1",   // Đường dẫn phương thức
            new { id = 1 }    // Tham số yêu cầu
        );
        
        // Phát hành sự kiện
        await defaultClient.PublishEventAsync(
            "pubsub",         // Tên component Pub/sub
            "order-created",  // Tên chủ đề
            response         // Dữ liệu sự kiện
        );
        
        // Lưu trạng thái
        await defaultClient.SaveStateAsync(
            "statestore",    // Tên component lưu trữ trạng thái
            "order-1",       // Khóa
            response        // Giá trị
        );
        
        // Lấy trạng thái
        var state = await defaultClient.GetStateAsync<OrderDto>(
            "statestore",    // Tên component lưu trữ trạng thái
            "order-1"       // Khóa
        );
    }
}
```

### 3. Tùy chỉnh hành vi DaprClient

```csharp
public class CustomDaprClientBehavior
{
    public void Configure(DaprClient client)
    {
        // Cấu hình hành vi tùy chỉnh
    }
}

// Đăng ký trong module
public override void ConfigureServices(ServiceConfigurationContext context)
{
    Configure<DaprClientFactoryOptions>(options =>
    {
        options.DaprClientActions.Add(client =>
        {
            new CustomDaprClientBehavior().Configure(client);
        });
    });
}
```

## Lưu ý

* Instance DaprClient an toàn với luồng (thread-safe), nên sử dụng mẫu singleton
* DaprClient có tên có thể có cấu hình khác nhau, phù hợp với các trường hợp cần kết nối tới các Dapr Sidecar khác nhau
* Sau khi thay đổi cấu hình cần tạo lại instance DaprClient mới có hiệu lực
* Cấu hình kênh gRPC cần chú ý tới hiệu năng và mức tiêu thụ tài nguyên
* Tùy chọn tuần tự hóa JSON sẽ ảnh hưởng tới mọi yêu cầu sử dụng DaprClient đó
* API Token nên được quản lý thông qua hệ thống quản lý cấu hình an toàn
* Nên sử dụng các DaprClient có tên khác nhau cho các microservice khác nhau
* Trong môi trường production nên cấu hình hợp lý chiến lược timeout và thử lại

[Xem bản tiếng Anh](README.EN.md)
