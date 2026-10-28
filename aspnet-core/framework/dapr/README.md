[Client](./LINGYUN.Abp.Dapr.Client/README.md) | Tài liệu Dapr.Actors

# Tích hợp Dapr.Actors

## Cấu hình sử dụng

Thiết kế dự án tương tự **Volo.Abp.Http.Client**  

### 1. Định nghĩa interface

```c#

// RemoteService.Name được định nghĩa trên interface sẽ được đăng ký vào Dapr dưới tên Actor
[RemoteService(Name = "System")]
public interface ISystemActor : IActor
{
    Task<string> GetAsync();
}

public class SystemActorInterfaceModule : AbpModule
{

}

```

### 2. Phía máy chủ

Tham chiếu LINGYUN.Abp.Dapr.Actors.AspNetCore

* Triển khai interface

```c#

public class SystemActor : Actor, ISystemActor 
{
    public Task<string> GetAsync() 
    {
        retuen Task.FromResult("System");
    }
}

```

* Tạo module

```c#

// Module sẽ tự động tìm kiếm các service đã triển khai IActor và đăng ký thành Actors của Dapr
[DependsOn(
        typeof(AbpDaprActorsAspNetCoreModule))]
public class SystemActorServerModule : AbpModule
{

}

```

* Phát hành lên Dapr

```shell
# --app-port cổng ánh xạ của chương trình .NET
# -H cổng lắng nghe http công khai ra bên ngoài
# -G cổng lắng nghe grpc công khai ra bên ngoài
dapr run --app-id myapp --app-port 5000 -H 50000 -G 40001 -- dotnet run

```

### 3. Phía máy khách

Tham chiếu LINGYUN.Abp.Dapr.Actors

* Tệp cấu hình **appsettings.json**

```json

{
    "RemoteServices": {
        "Shop": {
            "BaseUrl": "http://127.0.0.1:50000"
        }
    }
}

```

* Mã phía máy khách  

```c#

// Phụ thuộc module
[DependsOn(
        typeof(AbpDaprActorsModule))]
public class SystemActorClientModule : AbpModule
{
    public override void ConfigureServices(ServiceConfigurationContext context)
    {
        // Đăng ký proxy tương tự module Volo.Abp.Http.Client
        context.Services.AddDaprActorProxies(
            typeof(SystemActorInterfaceModule).Assembly, // Tìm kiếm định nghĩa IActor trong module SystemActorInterfaceModule
            "Shop"
        );
    }
}

// Gọi phương thức, chỉ cần dependency injection trực tiếp là được
public class InvokeClass
{
    private readonly ISystemActor _systemActor;

    public InvokeClass(ISystemActor systemActor)
    {
        _systemActor = systemActor; 
    }

    public async Task InvokeAsync()
    {
        await _systemActor.GetAsync();
    }
}

```

## Khác
