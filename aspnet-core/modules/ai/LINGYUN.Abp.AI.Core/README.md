# LINGYUN.Abp.AI.Core

[Abp AI Module](https://abp.io/docs/latest/framework/infrastructure/artificial-intelligence) mở rộng. 

## Tính năng


## Tham chiếu module

```csharp
[DependsOn(typeof(AbpAICoreModule))]
public class YouProjectModule : AbpModule
{
  // other
}
```

## Module phụ thuộc

* [AbpAIModule](https://abp.io/docs/latest/framework/infrastructure/artificial-intelligence)  
* [AbpLocalizationModule](https://abp.io/docs/latest/framework/fundamentals/localization)  

## Cách dùng cơ bản

> Định nghĩa workspace hệ thống  
```csharp
[DependsOn(typeof(AbpAICoreModule))]
public class YouProjectModule : AbpModule
{
    public override void PreConfigureServices(ServiceConfigurationContext context)
    {
        PreConfigure<AbpAIWorkspaceOptions>(options =>
        {
            options.Workspaces.Configure<YouWorkspace>(workspace =>
            {
                workspace.ConfigureChatClient(config =>
                {
                    config.Builder = new ChatClientBuilder(
                        sp => new OpenAIClient(
                            new ApiKeyCredential("YouApiKey"),
                            new OpenAIClientOptions
                            {
                                Endpoint = new Uri("https://api.openai.com/v1"),
                            }).GetChatClient("GPT-4").AsIChatClient());
                });

                workspace.ConfigureKernel(config =>
                {
                    config.Builder = Kernel.CreateBuilder()
                        .AddOpenAIChatClient(
                            modelId: "GPT-4",
                            openAIClient: new OpenAIClient(
                                new ApiKeyCredential("YouApiKey"),
                                new OpenAIClientOptions
                                {
                                    Endpoint = new Uri("https://api.openai.com/v1"),
                                }));
                });
            });
        });
    }
}
```

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

// Sử dụng IKernelFactory
Console.WriteLine("Use Microsoft.SemanticKernel:");
var kernelFactory = application.ServiceProvider.GetRequiredService<IKernelFactory>();

var kernel = await kernelFactory.CreateAsync<YouWorkspace>();
var kernelResponse = kernel.InvokePromptStreamingAsync("Làm thế nào để tối ưu hiệu năng code C#?");
await foreach (var item in kernelResponse)
{
    Console.Write(item);
}
Console.WriteLine();

// Sử dụng IKernelAccessor
var kernelWithAbp = application.ServiceProvider.GetRequiredService<IKernelAccessor<YouWorkspace>>();
var kernelWithAbpResponse = kernelWithAbp.InvokePromptStreamingAsync("Làm thế nào để tối ưu hiệu năng code C#?");
await foreach (var item in kernelWithAbpResponse)
{
    Console.Write(item);
}
Console.WriteLine();

await application.ShutdownAsync();

Console.WriteLine();
Console.WriteLine("AI Console completed!");

Console.ReadKey();
```

> Định nghĩa workspace động  
```csharp
public class YouWorkspaceDefinitionProvider : WorkspaceDefinitionProvider
{
    public override void Define(IWorkspaceDefinitionContext context)
    {
        context.Add(
            new WorkspaceDefinition(
                "YouWorkspace",
                OpenAIChatClientProvider.ProviderName,
                "GPT-4",
                new FixedLocalizableString("YouWorkspace"))
            .WithApiKey("YouApiKey")
            .WithApiBaseUrl("https://api.openai.com/v1"));
    }
}

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

// Microsoft.SemanticKernel
Console.WriteLine("Use Microsoft.SemanticKernel:");
var kernelFactory = application.ServiceProvider.GetRequiredService<IKernelFactory>();

var kernel = await kernelFactory.CreateAsync("YouWorkspace");
var kernelResponse = kernel.InvokePromptStreamingAsync("Làm thế nào để tối ưu hiệu năng code C#?");
await foreach (var item in kernelResponse)
{
    Console.Write(item);
}
Console.WriteLine();

await application.ShutdownAsync();

Console.WriteLine();
Console.WriteLine("AI Console completed!");

Console.ReadKey();

```