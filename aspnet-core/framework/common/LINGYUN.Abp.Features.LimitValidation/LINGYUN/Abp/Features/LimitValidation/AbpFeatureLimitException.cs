using LINGYUN.Abp.Features.LimitValidation.Localization;
using Microsoft.Extensions.Localization;
using Volo.Abp;
using Volo.Abp.ExceptionHandling;
using Volo.Abp.Localization;

namespace LINGYUN.Abp.Features.LimitValidation;

public class AbpFeatureLimitException : AbpException, ILocalizeErrorMessage, IBusinessException
{
    /// <summary>
    /// Tên tính năng
    /// </summary>
    public string Feature { get; }
    /// <summary>
    /// Giới hạn tối đa
    /// </summary>
    public int Limit { get; }

    public AbpFeatureLimitException(string feature, int limit)
        : base($"Features {feature} has exceeded the maximum number of calls {limit}, please apply for the appropriate permission")
    {
        Feature = feature;
        Limit = limit;
    }
    public string LocalizeMessage(LocalizationContext context)
    {
        var localizer = context.LocalizerFactory.Create<FeaturesLimitValidationResource>();

        return localizer["FeaturesLimitException", Limit];
    }
}
