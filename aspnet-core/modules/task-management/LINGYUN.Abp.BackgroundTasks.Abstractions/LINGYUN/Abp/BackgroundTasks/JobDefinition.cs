using JetBrains.Annotations;
using System;
using System.Collections.Generic;
using Volo.Abp.Localization;

namespace LINGYUN.Abp.BackgroundTasks;

public class JobDefinition
{
    /// <summary>
    /// Tên
    /// </summary>
    public string Name { get; }
    /// <summary>
    /// Kiểu công việc
    /// </summary>
    public Type JobType { get; }
    /// <summary>
    /// Có hiển thị cho client hay không
    /// Default: true.
    /// </summary>
    public bool IsVisibleToClients { get; set; }
    /// <summary>
    /// Tên hiển thị
    /// </summary>
    public ILocalizableString DisplayName { get; }
    /// <summary>
    /// Mô tả
    /// </summary>
    public ILocalizableString? Description { get; }
    /// <summary>
    /// Danh sách tham số
    /// </summary>
    public IReadOnlyList<JobDefinitionParamter>? Paramters { get; }
    public JobDefinition(
        [NotNull] string name,
        [NotNull] Type jobType,
        [NotNull] ILocalizableString displayName,
        [CanBeNull] IReadOnlyList<JobDefinitionParamter>? paramters = null,
        [CanBeNull] ILocalizableString? description = null,
        bool isVisibleToClients = true)
    {
        Name = name;
        JobType = jobType;
        DisplayName = displayName;
        Description = description;
        Paramters = paramters ?? new JobDefinitionParamter[0];
        IsVisibleToClients = isVisibleToClients;
    }
}
