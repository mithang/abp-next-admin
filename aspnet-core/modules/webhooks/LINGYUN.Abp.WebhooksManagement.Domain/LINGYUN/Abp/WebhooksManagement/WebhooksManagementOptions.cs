using System;

namespace LINGYUN.Abp.WebhooksManagement;
public class WebhooksManagementOptions
{
    /// <summary>
    /// Default: true.
    /// </summary>
    public bool SaveStaticWebhooksToDatabase { get; set; }
    /// <summary>
    /// Default: false.
    /// </summary>
    public bool IsDynamicWebhookStoreEnabled { get; set; }
    /// <summary>
    /// Thời gian làm mới bộ nhớ đệm
    /// default: 30 seconds
    /// </summary>
    public TimeSpan WebhooksCacheRefreshInterval { get; set; }
    /// <summary>
    /// Thời gian hết hạn của dấu thời gian khi yêu cầu
    /// default: 2 minutes
    /// </summary>
    public TimeSpan WebhooksCacheStampTimeOut { get; set; }
    /// <summary>
    /// Thời gian hết hạn của dấu thời gian
    /// default: 30 minutes
    /// </summary>
    public TimeSpan WebhooksCacheStampExpiration { get; set; }
    public WebhooksManagementOptions()
    {
        SaveStaticWebhooksToDatabase = true;

        WebhooksCacheRefreshInterval = TimeSpan.FromSeconds(30);
        WebhooksCacheStampTimeOut = TimeSpan.FromMinutes(2);
        // Hết hạn sau 30 phút thì làm mới lại bộ nhớ đệm
        WebhooksCacheStampExpiration = TimeSpan.FromMinutes(30);
    }
}
