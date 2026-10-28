using LINGYUN.Abp.PushPlus.Channel;
using LINGYUN.Abp.PushPlus.Message;

namespace LINGYUN.Abp.Notifications;
public static class NotificationDefinitionExtensions
{
    private const string Prefix = "push-plus:";
    private const string TemplateKey = Prefix + "template";
    private const string ChannelTypeKey = Prefix + "channel";
    private const string TopicKey = Prefix + "topic";
    /// <summary>
    /// Thiết lập mẫu thông báo
    /// </summary>
    /// <param name="notification"></param>
    /// <param name="template"></param>
    /// <returns></returns>
    public static NotificationDefinition WithTemplate(
        this NotificationDefinition notification,
        PushPlusMessageTemplate template = PushPlusMessageTemplate.Html)
    {
        return notification.WithProperty(TemplateKey, template);
    }
    /// <summary>
    /// Lấy mẫu thông báo
    /// </summary>
    /// <param name="notification"></param>
    /// <param name="defaultTemplate"></param>
    /// <returns></returns>
    public static PushPlusMessageTemplate GetTemplateOrDefault(
        this NotificationDefinition notification,
        PushPlusMessageTemplate defaultTemplate = PushPlusMessageTemplate.Html)
    {
        if (notification.Properties.TryGetValue(TemplateKey, out var defineTemplate) == true &&
            defineTemplate is PushPlusMessageTemplate template)
        {
            return template;
        }

        return notification.ContentType switch
        {
            NotificationContentType.Text => PushPlusMessageTemplate.Text,
            NotificationContentType.Html => PushPlusMessageTemplate.Html,
            NotificationContentType.Markdown => PushPlusMessageTemplate.Markdown,
            NotificationContentType.Json => PushPlusMessageTemplate.Json,
            _ => defaultTemplate,
        };
    }
    /// <summary>
    /// Thiết lập kênh gửi thông báo
    /// </summary>
    /// <param name="notification"></param>
    /// <param name="channelType"></param>
    /// <returns></returns>
    public static NotificationDefinition WithChannel(
        this NotificationDefinition notification,
        PushPlusChannelType channelType)
    {
        return notification.WithProperty(ChannelTypeKey, channelType);
    }
    /// <summary>
    /// Lấy kênh gửi thông báo
    /// </summary>
    /// <param name="notification"></param>
    /// <param name="defaultChannelType"></param>
    /// <returns></returns>
    public static PushPlusChannelType GetChannelOrDefault(
        this NotificationDefinition notification,
        PushPlusChannelType defaultChannelType = PushPlusChannelType.WeChat)
    {
        if (notification.Properties.TryGetValue(ChannelTypeKey, out var defineChannelType) == true &&
            defineChannelType is PushPlusChannelType channelType)
        {
            return channelType;
        }

        return defaultChannelType;
    }
    /// <summary>
    /// Mã nhóm gửi hàng loạt thông báo
    /// see: https://www.pushplus.plus/doc/guide/api.html#%E4%B8%80%E3%80%81%E5%8F%91%E9%80%81%E6%B6%88%E6%81%AF%E6%8E%A5%E5%8F%A3
    /// </summary>
    /// <param name="notification">Mã nhóm</param>
    /// <param name="topic"></param>
    /// <returns>
    /// <see cref="NotificationDefinition"/>
    /// </returns>
    public static NotificationDefinition WithTopic(
        this NotificationDefinition notification,
        string topic)
    {
        return notification.WithProperty(TopicKey, topic);
    }
    /// <summary>
    /// Lấy mã nhóm gửi hàng loạt thông báo
    /// </summary>
    /// <param name="notification"></param>
    /// <returns>
    /// Mã nhóm của định nghĩa thông báo, trả về null nếu chưa được định nghĩa
    /// </returns>
    public static string? GetTopicOrNull(
        this NotificationDefinition notification)
    {
        if (notification.Properties.TryGetValue(TopicKey, out var topicDefine) == true)
        {
            return topicDefine?.ToString();
        }

        return null;
    }
}
