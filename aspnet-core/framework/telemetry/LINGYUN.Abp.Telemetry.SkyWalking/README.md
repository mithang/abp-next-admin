# LINGYUN.Abp.Telemetry.SkyWalking

Tích hợp hệ thống truy vết phân tán `SkyWalking`  

## Tính năng


## Tham chiếu module

```csharp
[DependsOn(typeof(AbpTelemetrySkyWalkingModule))]
public class YouProjectModule : AbpModule
{
  // other
}
```

## Mục cấu hình

```shell

# Chuyển đến thư mục chương trình chính
cd my-host-project-path

# Cài đặt công cụ dòng lệnh skyapm
dotnet tool install -g SkyAPM.DotNet.CLI

# Tạo tệp cấu hình SkyWalking, localhost:11800 là cổng Grpc mà phiên bản SkyWalking bạn đang chạy công khai
dotnet skyapm config auth_server localhost:11800
```

```csharp

public class YouProjectModule : AbpModule
{
	public override void PreConfigureServices(ServiceConfigurationContext context)
    {
        PreConfigure<SkyApmExtensions>(skyapm =>
        {
            skyapm.AddCap();

            // other...
        });
    }
}


```

## Thêm tài liệu

* [SkyWalking](https://skywalking.apache.org/)
* [SkyWalking .NET](https://github.com/SkyAPM/SkyAPM-dotnet)
