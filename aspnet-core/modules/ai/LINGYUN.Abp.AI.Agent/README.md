# LINGYUN.Abp.AI.Agent

[Abp AI Module](https://abp.io/docs/latest/framework/infrastructure/artificial-intelligence) Mở rộng. 

## Tính năng


## Tham chiếu module

```csharp
[DependsOn(typeof(AbpAIAgentModule))]
public class YouProjectModule : AbpModule
{
  // other
}
```

## Module phụ thuộc

* [AbpAIModule](https://abp.io/docs/latest/framework/infrastructure/artificial-intelligence)  
* [AbpLocalizationModule](https://abp.io/docs/latest/framework/fundamentals/localization)  

## Cách dùng cơ bản

> Tương thích với cú pháp của `IKernelAccessor` và `IChatClientAccessor`.  

```csharp
using LINGYUN.Abp.AI;
using LINGYUN.Abp.AI.Agent;
using Microsoft.Extensions.AI;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.SemanticKernel;
using Volo.Abp;

var application = await AbpApplicationFactory.CreateAsync<YouProjectModule>(options =>
{
    options.UseAutofac();
});

await application.InitializeAsync();

var chatClientAgentFactory = application.ServiceProvider.GetRequiredService<IChatClientAgentFactory>();

var agent = await chatClientAgentFactory.CreateAsync<YouWorkspace>();

var agentResponse = agent.RunStreamingAsync("Giải thích về đại số tuyến tính");

await foreach (var item in agentResponse)
{
    Console.Write(item);
}
Console.WriteLine();

await application.ShutdownAsync();

Console.WriteLine();
Console.WriteLine("AI Console completed!");

Console.ReadKey();
```

> Hỗ trợ cú pháp workspace động.  

```csharp
using LINGYUN.Abp.AI;
using LINGYUN.Abp.AI.Agent;
using Microsoft.Extensions.AI;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.SemanticKernel;
using Volo.Abp;

var application = await AbpApplicationFactory.CreateAsync<YouProjectModule>(options =>
{
    options.UseAutofac();
});

await application.InitializeAsync();

var chatClientAgentFactory = application.ServiceProvider.GetRequiredService<IChatClientAgentFactory>();

var agent = await chatClientAgentFactory.CreateAsync("YouWorkspace");

var agentResponse = agent.RunStreamingAsync("Giải thích về đại số tuyến tính");

await foreach (var item in agentResponse)
{
    Console.Write(item);
}
Console.WriteLine();

await application.ShutdownAsync();

Console.WriteLine();
Console.WriteLine("AI Console completed!");

Console.ReadKey();

```