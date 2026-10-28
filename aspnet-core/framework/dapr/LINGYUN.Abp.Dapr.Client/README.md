[Actors](../README.md) | Tài liệu Dapr.Client

# LINGYUN.Abp.Dapr.Client

Triển khai gọi giữa các dịch vụ trong tài liệu Dapr, thiết kế dự án nhất quán với Volo.Abp.Http.Client, chỉ cần qua tệp cấu hình là có thể thay thế Volo.Abp.Http.Client một cách liền mạch.

Tham khảo cấu hình [AbpRemoteServiceOptions](https://docs.abp.io/zh-Hans/abp/latest/API/Dynamic-CSharp-API-Clients#abpremoteserviceoptions)

## Tính năng

* Tích hợp với hệ thống dịch vụ từ xa ABP
* Hỗ trợ tạo proxy động
* Hỗ trợ phát hiện dịch vụ và cân bằng tải
* Hỗ trợ xử lý yêu cầu và phản hồi tùy chỉnh
* Hỗ trợ xử lý lỗi và định dạng
* Hỗ trợ cấu hình nhiều endpoint dịch vụ
* Hỗ trợ bộ chặn yêu cầu/phản hồi
* Hỗ trợ hành vi DaprClient tùy chỉnh

## Tùy chọn cấu hình

```json
{
    "RemoteServices": {
        "Default": {
            "AppId": "default-app",  // ID ứng dụng Dapr
            "BaseUrl": "http://localhost:3500",  // Endpoint HTTP Dapr
            "HealthCheckUrl": "/health",  // Endpoint kiểm tra sức khỏe
            "RequestTimeout": 30000,  // Thời gian chờ yêu cầu (mili giây)
            "RetryCount": 3,  // Số lần thử lại
            "RetryWaitTime": 1000  // Thời gian chờ thử lại (mili giây)
        },
        "System": {
            "AppId": "system-app",
            "BaseUrl": "http://localhost:50000",
            "Headers": {  // Header yêu cầu tùy chỉnh
                "Tenant": "Default",
                "Culture": "zh-Hans"
            }
        }
    }
}
```

## Sử dụng cấu hình

Tham chiếu mô-đun theo nhu cầu:

```csharp
[DependsOn(typeof(AbpDaprClientModule))]
public class YouProjectModule : AbpModule
{
    public override void ConfigureServices(ServiceConfigurationContext context)
    {
        // Đăng ký proxy, tương tự mô-đun Volo.Abp.Http.Client
        context.Services.AddDaprClientProxies(
            typeof(YouProjectInterfaceModule).Assembly, // Tìm kiếm định nghĩa dịch vụ từ xa trong mô-đun
            RemoteServiceName
        );

        // Cấu hình tùy chọn proxy
        Configure<AbpDaprClientProxyOptions>(options =>
        {
            // Cấu hình bộ chặn yêu cầu
            options.ProxyRequestActions.Add((appId, request) =>
            {
                request.Headers.Add("Custom-Header", "Value");
            });

            // Cấu hình xử lý phản hồi
            options.OnResponse(async (response, serviceProvider) =>
            {
                return await response.Content.ReadAsStringAsync();
            });

            // Cấu hình xử lý lỗi
            options.OnError(async (response, serviceProvider) =>
            {
                var error = await response.Content.ReadAsStringAsync();
                return new RemoteServiceErrorInfo
                {
                    Code = response.StatusCode.ToString(),
                    Message = error
                };
            });
        });
    }
}
```

## Ví dụ triển khai

### 1. Định nghĩa giao diện

```csharp
// IApplicationService triển khai IRemoteService
public interface ISystemAppService : IApplicationService
{
    Task<string> GetAsync();
    Task<SystemDto> CreateAsync(CreateSystemDto input);
    Task<List<SystemDto>> GetListAsync();
    Task DeleteAsync(string id);
}

public class SystemInterfaceModule : AbpModule
{
}
```

### 2. Triển khai phía máy chủ

```csharp
[DependsOn(
    typeof(SystemInterfaceModule),
    typeof(AbpAspNetCoreMvcModule)
)]
public class SystemServerModule : AbpModule
{
    public override void PreConfigureServices(ServiceConfigurationContext context)
    {
        PreConfigure<IMvcBuilder>(mvcBuilder =>
        {
            mvcBuilder.AddApplicationPartIfNotExists(typeof(SystemServerModule).Assembly);
        });
    }
}

public class SystemAppService : ApplicationService, ISystemAppService
{
    private readonly ISystemRepository _systemRepository;

    public SystemAppService(ISystemRepository systemRepository)
    {
        _systemRepository = systemRepository;
    }

    public async Task<string> GetAsync()
    {
        return "System";
    }

    public async Task<SystemDto> CreateAsync(CreateSystemDto input)
    {
        var system = await _systemRepository.CreateAsync(
            new System
            {
                Name = input.Name,
                Description = input.Description
            }
        );
        return ObjectMapper.Map<System, SystemDto>(system);
    }

    public async Task<List<SystemDto>> GetListAsync()
    {
        var systems = await _systemRepository.GetListAsync();
        return ObjectMapper.Map<List<System>, List<SystemDto>>(systems);
    }

    public async Task DeleteAsync(string id)
    {
        await _systemRepository.DeleteAsync(id);
    }
}
```

### 3. Sử dụng phía máy khách

```csharp
[DependsOn(typeof(AbpDaprClientModule))]
public class SystemClientModule : AbpModule
{
    private const string RemoteServiceName = "System";

    public override void ConfigureServices(ServiceConfigurationContext context)
    {
        // Đăng ký proxy
        context.Services.AddDaprClientProxies(
            typeof(SystemInterfaceModule).Assembly,
            RemoteServiceName
        );

        // Cấu hình chính sách thử lại
        context.Services.AddDaprClientBuilder(builder =>
        {
            builder.ConfigureHttpClient((sp, client) =>
            {
                client.Timeout = TimeSpan.FromSeconds(30);
            });
        });
    }
}

public class SystemService
{
    private readonly ISystemAppService _systemAppService;

    public SystemService(ISystemAppService systemAppService)
    {
        _systemAppService = systemAppService;
    }

    public async Task<List<SystemDto>> GetSystemsAsync()
    {
        try
        {
            return await _systemAppService.GetListAsync();
        }
        catch (AbpRemoteCallException ex)
        {
            // Xử lý ngoại lệ gọi từ xa
            _logger.LogError(ex, "Failed to get systems");
            throw;
        }
    }
}
```

## Cách dùng nâng cao

### 1. Xử lý yêu cầu tùy chỉnh

```csharp
public class CustomRequestHandler
{
    public void Configure(HttpRequestMessage request)
    {
        request.Headers.Add("Correlation-Id", Guid.NewGuid().ToString());
        request.Headers.Add("Client-Version", "1.0.0");
    }
}

// Đăng ký trong mô-đun
Configure<AbpDaprClientProxyOptions>(options =>
{
    options.ProxyRequestActions.Add((appId, request) =>
    {
        new CustomRequestHandler().Configure(request);
    });
});
```

### 2. Xử lý phản hồi tùy chỉnh

```csharp
public class CustomResponseHandler
{
    public async Task<string> HandleAsync(HttpResponseMessage response)
    {
        var content = await response.Content.ReadAsStringAsync();
        // Logic xử lý phản hồi tùy chỉnh
        return content;
    }
}

// Đăng ký trong mô-đun
Configure<AbpDaprClientProxyOptions>(options =>
{
    options.OnResponse(async (response, sp) =>
    {
        return await new CustomResponseHandler().HandleAsync(response);
    });
});
```

## Lưu ý

* Giao diện dịch vụ từ xa phải kế thừa `IRemoteService`
* Thay đổi cấu hình cần tạo lại thực thể proxy mới có hiệu lực
* Nên cấu hình chính sách thời gian chờ và thử lại phù hợp
* Xử lý lỗi nên xét đến ngoại lệ mạng và trường hợp dịch vụ không khả dụng
* Trong môi trường production nên bật phát hiện dịch vụ
* Nên dùng kiểm tra sức khỏe để đảm bảo dịch vụ khả dụng
* Cấu hình header yêu cầu nên xét đến nhu cầu bảo mật và xác thực
* Ghi nhật ký rất quan trọng cho việc chẩn đoán sự cố

[Xem bản tiếng Anh](README.EN.md)
