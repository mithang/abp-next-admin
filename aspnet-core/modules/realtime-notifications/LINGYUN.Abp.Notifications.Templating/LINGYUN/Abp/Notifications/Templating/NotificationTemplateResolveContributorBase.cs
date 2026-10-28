using System.Threading.Tasks;

namespace LINGYUN.Abp.Notifications.Templating;
public abstract class NotificationTemplateResolveContributorBase : INotificationTemplateResolveContributor
{
    public abstract string Name { get; }
    /// <summary>
    /// Triển khai interface này để xử lý dữ liệu mẫu
    /// </summary>
    /// <param name="context"></param>
    /// <returns></returns>
    public abstract Task ResolveAsync(INotificationTemplateResolveContext context);
}
