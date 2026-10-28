using JetBrains.Annotations;
using System;
using Volo.Abp;

namespace LINGYUN.Abp.Features.LimitValidation;

/// <summary>
/// Giới hạn số lượng gọi của một tính năng
/// </summary>
/// <remarks>
/// Cần phân biệt tính năng về thời lượng giới hạn và giới hạn tối đa, để giới hạn chi tiết hơn
/// </remarks>
[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, AllowMultiple = false)]
public class RequiresLimitFeatureAttribute : Attribute
{
    /// <summary>
    /// Chính sách giới hạn tính năng
    /// </summary>
    public LimitPolicy Policy { get; }
    /// <summary>
    /// Thời lượng giới hạn mặc định
    /// </summary>
    public int DefaultLimit { get; }
    /// <summary>
    /// Tên giới hạn tối đa
    /// </summary>
    public string LimitFeature { get; }
    /// <summary>
    /// Thời lượng giới hạn mặc định
    /// </summary>
    public int DefaultInterval { get; }
    /// <summary>
    /// Tên thời lượng giới hạn
    /// </summary>
    public string IntervalFeature { get; }

    public RequiresLimitFeatureAttribute(
        [NotNull] string limitFeature,
        [NotNull] string intervalFeature,
        LimitPolicy policy = LimitPolicy.Month,
        int defaultLimit = 1,
        int defaultInterval = 1)
    {
        Check.NotNullOrWhiteSpace(limitFeature, nameof(limitFeature));
        Check.NotNullOrWhiteSpace(intervalFeature, nameof(intervalFeature));

        Policy = policy;
        LimitFeature = limitFeature;
        DefaultLimit = defaultLimit;
        IntervalFeature = intervalFeature;
        DefaultInterval = defaultInterval;
    }
}
