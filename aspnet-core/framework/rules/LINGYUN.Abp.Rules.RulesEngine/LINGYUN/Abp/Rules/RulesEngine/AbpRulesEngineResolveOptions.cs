using JetBrains.Annotations;
using System.Collections.Generic;

namespace LINGYUN.Abp.Rules.RulesEngine;

public class AbpRulesEngineResolveOptions
{
    /// <summary>
    /// Gộp quy tắc
    /// Nếu là true, sau khi nhà cung cấp trước đó phân giải quy tắc sẽ tiếp tục thực thi nhà cung cấp tiếp theo
    /// Nếu là false, ngay sau khi nhà cung cấp trước đó phân giải quy tắc sẽ thực thi quy tắc
    /// Mặc định: false
    /// </summary>
    public bool MergingWorkflows { get; set; }
    /// <summary>
    /// Nhà cung cấp phân giải quy tắc
    /// </summary>
    [NotNull]
    public List<IWorkflowsResolveContributor> WorkflowsResolvers { get; }

    public AbpRulesEngineResolveOptions()
    {
        MergingWorkflows = false;
        WorkflowsResolvers = new List<IWorkflowsResolveContributor>();
    }
}
