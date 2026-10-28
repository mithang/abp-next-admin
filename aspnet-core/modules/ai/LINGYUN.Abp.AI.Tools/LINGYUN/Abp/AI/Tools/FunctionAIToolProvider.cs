using LINGYUN.Abp.AI.Localization;
using Microsoft.Extensions.AI;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Localization;
using System;
using System.Reflection;
using System.Threading.Tasks;
using Volo.Abp;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Localization;

namespace LINGYUN.Abp.AI.Tools;
public class FunctionAIToolProvider : IAIToolProvider, ITransientDependency
{
    public const string ProviderName = "Function";
    public string Name => ProviderName;

    protected IServiceProvider ServiceProvider { get; }
    public FunctionAIToolProvider(IServiceProvider serviceProvider)
    {
        ServiceProvider = serviceProvider;
    }

    public virtual AIToolPropertyDescriptor[] GetPropertites()
    {
        return [
            AIToolPropertyDescriptor.CreateStringProperty(
                FunctionAIToolDefinitionExtenssions.FunctionType,
                LocalizableString.Create<AbpAIResource>("FunctionAITool:FunctionType"),
                LocalizableString.Create<AbpAIResource>("FunctionAITool:FunctionTypeDesc"),
                required: true),
        AIToolPropertyDescriptor.CreateStringProperty(
                FunctionAIToolDefinitionExtenssions.FunctionName,
                LocalizableString.Create<AbpAIResource>("FunctionAITool:FunctionName"),
                LocalizableString.Create<AbpAIResource>("FunctionAITool:FunctionNameDesc"))];
    }

    public virtual Task<AITool[]> CreateToolsAsync(AIToolDefinition definition)
    {
        var aiToolType = definition.GetFunctionType();
        var aiToolMethod = definition.GetFunctionNameOrNull();

        MethodInfo? aiToolMethodInfo = default!;
        if (!aiToolMethod.IsNullOrWhiteSpace())
        {
            aiToolMethodInfo = aiToolType.GetMethod(aiToolMethod);
        }
        else
        {
            // Quy ước của framework, Tool tùy chỉnh chỉ cần định nghĩa phương thức đồng bộ (Invoke) hoặc phương thức bất đồng bộ (InvokeAsync)
            aiToolMethodInfo = aiToolType.GetMethod("Invoke") ?? aiToolType.GetMethod("InvokeAsync");
        }

        Check.NotNull(aiToolMethodInfo, nameof(aiToolMethodInfo));

        string? description = null;
        if (definition.Description != null)
        {
            var localizerFactory = ServiceProvider.GetRequiredService<IStringLocalizerFactory>();
            description = definition.Description.Localize(localizerFactory)?.Value;
        }

        var functionAITool = AIFunctionFactory.Create(
            method: aiToolMethodInfo,
            createInstanceFunc: (AIFunctionArguments args) => 
            {
                return ActivatorUtilities.CreateInstance(args.Services ?? ServiceProvider, aiToolType);
            },
            options: new AIFunctionFactoryOptions
            {
                Name = definition.Name,
                Description = description,
                AdditionalProperties = definition.Properties,
            });

        return Task.FromResult<AITool[]>([functionAITool]);
    }
}
