using RulesEngine.Models;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace LINGYUN.Abp.Rules.RulesEngine.Persistent;

/// <summary>
/// Triển khai interface này để lấy quy tắc từ các kho lưu trữ bền vững khác
/// </summary>
public interface IWorkflowStore
{
    Task<IEnumerable<Workflow>> GetWorkflowsAsync(Type inputType, CancellationToken cancellationToken = default);

    Task<Workflow?> GetWorkflowAsync(string workflowName, CancellationToken cancellationToken = default);
}
