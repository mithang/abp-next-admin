using System;
using System.Collections.Generic;
using System.Reflection;
using Volo.Abp.Collections;

namespace LINGYUN.Abp.Webhooks;

public class AbpWebhooksOptions
{
    /// <summary>
    /// Thời gian chờ mặc định
    /// </summary>
    public TimeSpan TimeoutDuration { get; set; }
    /// <summary>
    /// Số lần gửi tối đa mặc định
    /// </summary>
    public int MaxSendAttemptCount { get; set; }
    /// <summary>
    /// Có tự động hủy đăng ký khi đạt số lần thất bại liên tiếp tối đa hay không
    /// </summary>
    public bool IsAutomaticSubscriptionDeactivationEnabled { get; set; }
    /// <summary>
    /// Số lần thất bại liên tiếp tối đa trước khi hủy đăng ký
    /// </summary>
    public int MaxConsecutiveFailCountBeforeDeactivateSubscription { get; set; }

    public ITypeList<IWebhookDefinitionProvider> DefinitionProviders { get; }

    public HashSet<string> DeletedWebhooks { get; }

    public HashSet<string> DeletedWebhookGroups { get; }
    /// <summary>
    /// Tiêu đề yêu cầu mặc định
    /// </summary>
    public IDictionary<string, string> DefaultHttpHeaders { get; }
    /// <summary>
    /// Định danh bên gửi mặc định
    /// </summary>
    public string DefaultAgentIdentifier { get; set; }
    public AbpWebhooksOptions()
    {
        TimeoutDuration = TimeSpan.FromSeconds(60);
        MaxSendAttemptCount = 5;
        MaxConsecutiveFailCountBeforeDeactivateSubscription = MaxSendAttemptCount * 3;

        DefinitionProviders = new TypeList<IWebhookDefinitionProvider>();

        DeletedWebhooks = new HashSet<string>();
        DeletedWebhookGroups = new HashSet<string>();

        DefaultHttpHeaders = new Dictionary<string, string>
        {
            // Hủy đóng gói nội dung phản hồi
            { "_AbpDontWrapResult", "true" },
            // TODO: Có thể ảnh hưởng liên miền (cross-origin)
            // { "X-Requested-With", "XMLHttpRequest" },
            // Đánh dấu nguồn gốc
            { "X-Requested-From", "abp-webhooks" },
        };

        DefaultAgentIdentifier = "Abp-Webhooks";

        var assembly = typeof(AbpWebhooksOptions).Assembly;
        var versionAttr = assembly.GetCustomAttribute<AssemblyFileVersionAttribute>();
        if (versionAttr != null)
        {
            DefaultAgentIdentifier += "/" + versionAttr.Version;
        }
    }

    public void AddHeader(string key, string value)
    {
        if (value.IsNullOrWhiteSpace())
        {
            return;
        }
        DefaultHttpHeaders[key] = value;
    }
}
