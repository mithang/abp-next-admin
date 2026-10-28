using Microsoft.Extensions.Options;
using System.Reflection;
using System.Threading.Tasks;
using Volo.Abp.Aspects;
using Volo.Abp.DependencyInjection;
using Volo.Abp.DynamicProxy;
using Volo.Abp.Features;
using Volo.Abp.Validation.StringValues;

namespace LINGYUN.Abp.Features.LimitValidation;

public class FeaturesLimitValidationInterceptor : AbpInterceptor, ITransientDependency
{
    private readonly IFeatureChecker _featureChecker;
    private readonly AbpFeaturesLimitValidationOptions _options;
    private readonly IRequiresLimitFeatureChecker _limitFeatureChecker;
    private readonly IFeatureDefinitionManager _featureDefinitionManager;

    public FeaturesLimitValidationInterceptor(
        IFeatureChecker featureChecker,
        IRequiresLimitFeatureChecker limitFeatureChecker,
        IFeatureDefinitionManager featureDefinitionManager,
        IOptions<AbpFeaturesLimitValidationOptions> options)
    {
        _options = options.Value;
        _featureChecker = featureChecker;
        _limitFeatureChecker = limitFeatureChecker;
        _featureDefinitionManager = featureDefinitionManager;

    }

    public override async Task InterceptAsync(IAbpMethodInvocation invocation)
    {
        if (AbpCrossCuttingConcerns.IsApplied(invocation.TargetObject, AbpCrossCuttingConcerns.FeatureChecking))
        {
            await invocation.ProceedAsync();
            return;
        }

       var limitFeature = await GetRequiresLimitFeature(invocation.Method);

        if (limitFeature == null)
        {
            await invocation.ProceedAsync();
            return;
        }

        // Lấy giới hạn tối đa của tính năng
        var limit = await _featureChecker.GetAsync(limitFeature.LimitFeature, limitFeature.DefaultLimit);
        // Lấy khoảng thời gian giới hạn của tính năng
        var interval = await _featureChecker.GetAsync(limitFeature.IntervalFeature, limitFeature.DefaultInterval);
        // Các tham số ngữ cảnh bắt buộc
        var limitFeatureContext = new RequiresLimitFeatureContext(limitFeature.LimitFeature, _options, limitFeature.Policy, interval, limit);
        // Kiểm tra giới hạn số lần
        await PreCheckFeatureAsync(limitFeatureContext);
        // Thực thi phương thức được proxy
        await invocation.ProceedAsync();
        // Tăng số lần gọi
        // TODO: Dùng Redis kết hợp với script Lua?
        await PostCheckFeatureAsync(limitFeatureContext);
    }

    protected async virtual Task PreCheckFeatureAsync(RequiresLimitFeatureContext context)
    {
        var allowed = await _limitFeatureChecker.CheckAsync(context);
        if (!allowed)
        {
            throw new AbpFeatureLimitException(context.LimitFeature, context.Limit);
        }
    }

    protected async virtual Task PostCheckFeatureAsync(RequiresLimitFeatureContext context)
    {
        await _limitFeatureChecker.ProcessAsync(context);
    }

    protected async virtual Task<RequiresLimitFeatureAttribute?> GetRequiresLimitFeature(MethodInfo methodInfo)
    {
        var limitFeature = methodInfo.GetCustomAttribute<RequiresLimitFeatureAttribute>(false);
        if (limitFeature != null)
        {
            // Nếu giới hạn số lần được định nghĩa không phải là tham số phạm vi thì không tham gia tính năng giới hạn
            var featureLimitDefinition = await _featureDefinitionManager.GetOrNullAsync(limitFeature.LimitFeature);
            if (featureLimitDefinition == null ||
                !typeof(NumericValueValidator).IsAssignableFrom(featureLimitDefinition.ValueType?.Validator.GetType()))
            {
                return null;
            }
            // Nếu thang thời lượng được định nghĩa không phải là tham số phạm vi thì không tham gia tính năng giới hạn
            var featureIntervalDefinition = await _featureDefinitionManager.GetOrNullAsync(limitFeature.IntervalFeature);
            if (featureIntervalDefinition == null ||
                !typeof(NumericValueValidator).IsAssignableFrom(featureIntervalDefinition.ValueType?.Validator.GetType()))
            {
                return null;
            }
        }
        return limitFeature;
    }
}
