using System;

namespace LINGYUN.Abp.TextTemplating;

public class AbpTextTemplatingCachingOptions
{
    /// <summary>
    /// Thời gian hết hạn tối thiểu của bộ nhớ đệm mẫu văn bản
    /// </summary>
    public TimeSpan? MinimumCacheDuration { get; set; }
    /// <summary>
    /// Thời gian hết hạn tuyệt đối của bộ nhớ đệm mẫu văn bản
    /// </summary>
    public TimeSpan? MaximumCacheDuration { get; set; }
    /// <summary>
    /// Default: true.
    /// </summary>
    public bool SaveStaticTemplateDefinitionToDatabase { get; set; }
    /// <summary>
    /// Default: false.
    /// </summary>
    public bool IsDynamicTemplateDefinitionStoreEnabled { get; set; }
    /// <summary>
    /// Thời gian làm mới bộ nhớ đệm
    /// default: 2 hours
    /// </summary>
    public TimeSpan TemplateDefinitionsCacheRefreshInterval { get; set; }
    /// <summary>
    /// Thời gian chờ của dấu thời gian yêu cầu
    /// default: 1 minutes
    /// </summary>
    public TimeSpan TemplateDefinitionsCacheStampTimeOut { get; set; }
    /// <summary>
    /// Thời gian hết hạn của dấu thời gian
    /// default: 30 days
    /// </summary>
    public TimeSpan TemplateDefinitionsCacheStampExpiration { get; set; }

    public AbpTextTemplatingCachingOptions()
    {
        MinimumCacheDuration = TimeSpan.FromHours(1);
        MaximumCacheDuration = TimeSpan.FromDays(30);

        SaveStaticTemplateDefinitionToDatabase = true;
        IsDynamicTemplateDefinitionStoreEnabled = false;
        TemplateDefinitionsCacheRefreshInterval = TimeSpan.FromHours(2);
        TemplateDefinitionsCacheStampTimeOut = TimeSpan.FromMinutes(1);
        TemplateDefinitionsCacheStampExpiration = TimeSpan.FromDays(30);
    }
}
