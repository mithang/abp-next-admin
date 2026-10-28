using LINGYUN.Abp.AI.Localization;
using LINGYUN.Abp.Dynamic.Definitions;
using Microsoft.Extensions.AI;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using Volo.Abp.Localization;
using Volo.Abp.Modularity;
using Volo.Abp.VirtualFileSystem;

namespace LINGYUN.Abp.AI.Tools;

[DependsOn(typeof(AbpAICoreModule))]
public class AbpAIToolsModule : AbpModule
{
    public override void PreConfigureServices(ServiceConfigurationContext context)
    {
        AutoAddDefinitionProviders(context.Services);
    }

    public override void ConfigureServices(ServiceConfigurationContext context)
    {
        Configure<AbpVirtualFileSystemOptions>(options =>
        {
            options.FileSets.AddEmbedded<AbpAIToolsModule>();
        });

        Configure<AbpAIToolsOptions>(options =>
        {
            // Công cụ hàm tùy chỉnh
            options.AIToolProviders.Add<FunctionAIToolProvider>();
        });

        Configure<AbpAICoreOptions>(options =>
        {
            options.ChatClientBuildActions.Add(async (workspace, sp, builder) =>
            {
                var workspaceAIToolFinder = sp.GetRequiredService<IWorkspaceAIToolFinder>();
                var workspaceAITools = await workspaceAIToolFinder.GetToolsAsync(workspace);

                return builder
                    .ConfigureOptions(config =>
                    {
                        config.ToolMode = ChatToolMode.Auto;
                        config.AllowMultipleToolCalls = true;

                        // Thêm các công cụ đã phát hiện
                        config.Tools = workspaceAITools;
                    })
                    // Bật để hỗ trợ công cụ dạng hàm
                    .UseFunctionInvocation();
            });
        });

        Configure<AbpLocalizationOptions>(options =>
        {
            options.Resources
                .Get<AbpAIResource>()
                .AddVirtualJson("/LINGYUN/Abp/AI/Tools/Localization/Resources");
        });

        Configure<AbpDynamicDefinitionsOptions>(options =>
        {
            options.MapStrategy<AIToolDefinition>(DynamicDefinitionStrategy.Merge);
        });
    }

    private static void AutoAddDefinitionProviders(IServiceCollection services)
    {
        var definitionProviders = new List<Type>();

        services.OnRegistered(context =>
        {
            if (typeof(IAIToolDefinitionProvider).IsAssignableFrom(context.ImplementationType))
            {
                definitionProviders.Add(context.ImplementationType);
            }
        });

        services.Configure<AbpAIToolsOptions>(options =>
        {
            options.DefinitionProviders.AddIfNotContains(definitionProviders);
        });
    }
}
