using RulesEngine;
using RulesEngine.Interfaces;
using RulesEngine.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Volo.Abp.DependencyInjection;

namespace LINGYUN.Abp.Rules.RulesEngine;

public class RulesEngineContributor : RuleContributorBase, ISingletonDependency
{
    private readonly IRulesEngine _ruleEngine;
    private readonly IWorkflowsResolver _workflowRulesResolver;

    public RulesEngineContributor(
        IRulesEngine ruleEngine,
        IWorkflowsResolver workflowRulesResolver)
    {
        _ruleEngine = ruleEngine;
        _workflowRulesResolver = workflowRulesResolver;
    }

    public override void Initialize(RulesInitializationContext context)
    {
        _workflowRulesResolver.Initialize(context);
    }

    public override async Task ExecuteAsync<T>(T input, object[]? @params = null, CancellationToken cancellationToken = default)
    {
        var result = await _workflowRulesResolver.ResolveWorkflowsAsync(typeof(T));

        if (result.Workflows.Any())
        {
            await ExecuteRulesAsync(input, result.Workflows.ToArray(), @params);
        }
    }

    public override void Shutdown()
    {
        _workflowRulesResolver.Shutdown();
    }

    protected async virtual Task ExecuteRulesAsync<T>(T input, Workflow[] workflows, object[]? @params = null) where T : notnull
    {
        // TODO: Khuyết điểm về hiệu năng: tệp quy tắc sẽ được biên dịch lại mỗi lần gọi
        _ruleEngine.AddOrUpdateWorkflow(workflows);

        // Truyền tham số thực thể tham gia xác thực
        var inputs = new List<object>()
        {
            input
        };
        if (@params != null && @params.Any())
        {
            inputs.AddRange(@params);
        }
        // Các tham số khác cũng tương tự

        foreach (var workflow in workflows)
        {
            // Thực thi quy tắc hiện tại
            var ruleResult = await _ruleEngine.ExecuteAllRulesAsync(workflow.WorkflowName, inputs.ToArray());
            // Phương thức mở rộng do người dùng tự định nghĩa, lỗi kiểm tra quy tắc sẽ ném ra ngoại lệ
            ruleResult.ThrowOfFaildExecute();
        }
    }
}
