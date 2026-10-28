using JetBrains.Annotations;
using System.Collections.Generic;

namespace LINGYUN.Abp.Notifications.Templating;
public class AbpNotificationsResolveOptions
{
    /// <summary>
    /// Danh sách provider phân giải mẫu
    /// </summary>
    [NotNull]
    public List<INotificationTemplateResolveContributor> TemplateResolvers { get; }

    public AbpNotificationsResolveOptions()
    {
        TemplateResolvers = new List<INotificationTemplateResolveContributor>();
    }
}
