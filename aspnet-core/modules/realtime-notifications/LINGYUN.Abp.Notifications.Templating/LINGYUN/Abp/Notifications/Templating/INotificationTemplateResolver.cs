using JetBrains.Annotations;
using System.Threading.Tasks;

namespace LINGYUN.Abp.Notifications.Templating;
/// <summary>
/// Giao diện phân tích mô hình mẫu thông báo
/// </summary>
public interface INotificationTemplateResolver
{
    /// <summary>
    /// Phân tích dữ liệu mẫu
    /// </summary>
    /// <param name="template"></param>
    /// <returns></returns>
    [NotNull]
    Task<NotificationTemplateResolveResult> ResolveAsync(NotificationTemplate template);
}
