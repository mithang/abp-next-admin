using RulesEngine.Models;

namespace LINGYUN.Abp.Rules.RulesEngine;

public class AbpRulesEngineOptions
{
    /// <summary>
    /// Có bỏ qua tenant hay không
    /// </summary>
    public bool IgnoreMultiTenancy { get; set; }
    /// <summary>
    /// Rule engine có thể cấu hình
    /// </summary>
    public ReSettings Settings { get; set; }

    public AbpRulesEngineOptions()
    {
        Settings = new ReSettings
        {
            NestedRuleExecutionMode = NestedRuleExecutionMode.Performance
        };
    }
}
