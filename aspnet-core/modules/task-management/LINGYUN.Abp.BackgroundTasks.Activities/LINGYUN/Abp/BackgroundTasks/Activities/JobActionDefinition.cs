using JetBrains.Annotations;
using System.Collections.Generic;
using Volo.Abp.Collections;
using Volo.Abp.Localization;

namespace LINGYUN.Abp.BackgroundTasks.Activities;

public class JobActionDefinition
{
    /// <summary>
    /// Tên
    /// </summary>
    public string Name { get; }
    /// <summary>
    /// Loại
    /// </summary>
    public JobActionType Type { get; }
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
    public IList<JobActionParamter> Paramters { get; }
    /// <summary>
    /// Nhà cung cấp thông báo
    /// </summary>
    public ITypeList<IJobExecutedProvider> Providers { get; }
    /// <summary>
    /// Thuộc tính bổ sung
    /// </summary>
    public Dictionary<string, object> Properties { get; }
    public JobActionDefinition(
        [NotNull] string name,
        [NotNull] JobActionType type,
        [NotNull] ILocalizableString displayName,
        [NotNull] IList<JobActionParamter> paramters,
        ILocalizableString? description = null)
    {
        Name = name;
        Type = type;
        DisplayName = displayName;
        Paramters = paramters;
        Description = description;

        Providers = new TypeList<IJobExecutedProvider>();
        Properties = new Dictionary<string, object>();
    }

    public virtual JobActionDefinition WithProvider<TProvider>()
        where TProvider : IJobExecutedProvider
    {
        Providers.Add(typeof(TProvider));

        return this;
    }

    public virtual JobActionDefinition WithProperty(string key, object value)
    {
        Properties[key] = value;
        return this;
    }

    public override string ToString()
    {
        return $"[{nameof(JobActionDefinition)} {Name}]";
    }
}
