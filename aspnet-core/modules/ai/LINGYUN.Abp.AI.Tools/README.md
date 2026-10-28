# LINGYUN.Abp.AI.Tools

Mô-đun công cụ AI. 

Tham khảo: [Gọi công cụ AI](https://learn.microsoft.com/zh-cn/dotnet/ai/conceptual/ai-tools)  

## Tính năng


## Tham chiếu mô-đun

```csharp
[DependsOn(typeof(AbpAIToolsModule))]
public class YouProjectModule : AbpModule
{
  // other
}
```

## Mô-đun phụ thuộc

* [AbpAICoreModule](../LINGYUN.Abp.AI.Core)  

## Hàm tùy chỉnh

> Lưu ý: Hàm tùy chỉnh tuân theo một quy ước: công cụ đồng bộ cần định nghĩa một hàm tên `Invoke`; công cụ bất đồng bộ cần định nghĩa một hàm tên `InvokeAsync`, nếu cần sử dụng DI container thì cần inject công cụ vào container  

```csharp

public class NowTimeTool : ITransientDependency
{
    private readonly IClock _clock;
    public NowTimeTool(IClock clock)
    {
        _clock = clock;
    }

    public object? Invoke()
    {
        return _clock.Now;
    }
}

public class NowTimeAIToolDefinitionProvider : AIToolDefinitionProvider
{
    context.Add(
            new AIToolDefinition(
                "GetNowTime",
                FunctionAIToolProvider.ProviderName)
            .WithFunction<NowTimeTool>());
}
```

## Mở rộng

Triển khai giao diện `IAIToolProvider` để bổ sung các lệnh gọi công cụ khác  
Triển khai giao diện `IDynamicAIToolDefinitionStore` để bổ sung quản lý công cụ AI động  

```csharp
public class McpAIToolProvider : IAIToolProvider, ITransientDependency
{
    public virtual Task<AITool[]> CreateToolsAsync(AIToolDefinition definition)
    {
        // Triển khai cụ thể của bạn
    }
}

[DependsOn(typeof(AbpAIToolsModule))]
public class YouProjectModule : AbpModule
{
    public override void ConfigureServices(ServiceConfigurationContext context)
    {
        Configure<AbpAIToolsOptions>(options =>
        {
            options.AIToolProviders.Add<McpAIToolProvider>();
        });
    }
}
```