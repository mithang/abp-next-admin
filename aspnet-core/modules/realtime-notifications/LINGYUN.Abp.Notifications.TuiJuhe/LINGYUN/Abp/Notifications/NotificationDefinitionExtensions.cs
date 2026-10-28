using LINGYUN.Abp.TuiJuhe.Messages;

namespace LINGYUN.Abp.Notifications;

public static class NotificationDefinitionExtensions
{
    private const string Prefix = "tui-juhe:";
    private const string ServiceIdKey = Prefix + "serviceId";

    /// <summary>
    /// Lấy loại nội dung tin nhắn
    /// </summary>
    /// <param name="notification"></param>
    /// <param name="defaultContentType"></param>
    /// <returns></returns>
    public static MessageContentType GetContentTypeOrDefault(
        this NotificationDefinition notification,
        MessageContentType defaultContentType = MessageContentType.Text)
    {
        return notification.ContentType switch
        {
            NotificationContentType.Text => MessageContentType.Text,
            NotificationContentType.Html => MessageContentType.Html,
            NotificationContentType.Markdown => MessageContentType.Markdown,
            NotificationContentType.Json => MessageContentType.Text,
            _ => defaultContentType,
        };
    }
    /// <summary>
    /// Chỉ định mã dịch vụ
    /// </summary>
    /// <param name="notification">Mã nhóm</param>
    /// <param name="serviceId">Mã dịch vụ, được tự động tạo ServiceID sau khi tạo dịch vụ, là định danh duy nhất của dịch vụ, có thể xem trong trang chi tiết của từng dịch vụ</param>
    /// <returns>
    /// <see cref="NotificationDefinition"/>
    /// </returns>
    public static NotificationDefinition WithServiceId(
        this NotificationDefinition notification,
        string serviceId)
    {
        return notification.WithProperty(ServiceIdKey, serviceId);
    }
    /// <summary>
    /// Lấy mã dịch vụ
    /// </summary>
    /// <param name="notification"></param>
    public static string GetServiceIdOrNull(
        this NotificationDefinition notification)
    {
        if (notification.Properties.TryGetValue(ServiceIdKey, out var serviceIdDefine))
        {
            return serviceIdDefine.ToString();
        }

        return null;
    }
}
