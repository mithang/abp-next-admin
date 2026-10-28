# LINGYUN.Abp.Elsa.Server

Tích hợp Elsa.Server.Api, xử lý endpoint mặc định của elsa    


## Cấu hình sử dụng

```csharp

    [DependsOn(
        typeof(AbpElsaServerModule)
        )]
    public class YouProjectModule : AbpModule
    {
    }
```