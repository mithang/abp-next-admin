using System;
using Volo.Abp;

namespace LINGYUN.Abp.Features.LimitValidation;

public class RequiresLimitFeatureContext
{
    /// <summary>
    /// Chính sách giới hạn tính năng
    /// </summary>
    public LimitPolicy Policy { get; }
    /// <summary>
    /// Thời lượng giới hạn
    /// </summary>
    public int Interval { get; }
    /// <summary>
    /// Số lần giới hạn tính năng
    /// </summary>
    public int Limit { get; }
    /// <summary>
    /// Tên số lần giới hạn tính năng
    /// </summary>
    public string LimitFeature { get; }

    public AbpFeaturesLimitValidationOptions Options { get; }
    public RequiresLimitFeatureContext(
        string limitFeature,
        AbpFeaturesLimitValidationOptions options,
        LimitPolicy policy = LimitPolicy.Month,
        int interval = 1,
        int limit = 1)
    {
        Policy = policy;
        Options = options;
        LimitFeature = limitFeature;
        Limit = Check.Positive(limit, nameof(limit));
        Interval = Check.Positive(interval, nameof(interval));
    }

    /// <summary>
    /// Lấy khoảng thời gian hiệu lực, đơn vị: s
    /// </summary>
    /// <returns></returns>
    public long GetEffectTicks(DateTime now)
    {
        return Options.EffectPolicys[Policy](now, Interval);
    }
}
