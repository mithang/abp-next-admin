namespace LINGYUN.Abp.Notifications;
public static class NotificationDefinitionWeChatWorkExtensions
{
    private const string Prefix = "wx-work:";
    private const string AgentIdKey = Prefix + "agent_id";
    private const string ToTagKey = Prefix + "to_tag";
    private const string ToPartyKey = Prefix + "to_party";

    /// <summary>
    /// Đặt gửi tới tất cả ứng dụng
    /// </summary>
    /// <param name="notification"></param>
    /// <returns></returns>
    public static NotificationDefinition WithAllAgent(
        this NotificationDefinition notification)
    {
        return notification.WithAgentId("@all");
    }

    /// <summary>
    /// Đặt mã định danh ứng dụng tin nhắn
    /// </summary>
    /// <param name="notification"></param>
    /// <param name="agentId"></param>
    /// <returns></returns>
    public static NotificationDefinition WithAgentId(
        this NotificationDefinition notification,
        string agentId)
    {
        return notification.WithProperty(AgentIdKey, agentId);
    }

    /// <summary>
    /// Lấy mã định danh ứng dụng tin nhắn
    /// </summary>
    /// <param name="notification"></param>
    public static string? GetAgentIdOrNull(
        this NotificationDefinition notification)
    {
        if (notification.Properties.TryGetValue(AgentIdKey, out var agentIdDefine))
        {
            return agentIdDefine?.ToString();
        }

        return null;
    }

    /// <summary>
    /// Chỉ định nhãn nhận tin nhắn, danh sách ID nhãn, nhiều người nhận dùng ‘|’ để phân tách, tối đa hỗ trợ 100 cái.
    /// </summary>
    /// <param name="notification"></param>
    /// <param name="tag"></param>
    /// <returns></returns>
    public static NotificationDefinition WithTag(
        this NotificationDefinition notification,
        string tag)
    {
        return notification.WithProperty(ToTagKey, tag);
    }

    /// <summary>
    /// Lấy nhãn nhận tin nhắn
    /// </summary>
    /// <param name="notification"></param>
    public static string? GetTagOrNull(
        this NotificationDefinition notification)
    {
        if (notification.Properties.TryGetValue(ToTagKey, out var tagDefine))
        {
            return tagDefine?.ToString();
        }

        return null;
    }

    /// <summary>
    /// Chỉ định phòng ban nhận tin nhắn, danh sách ID phòng ban, nhiều người nhận dùng ‘|’ để phân tách, tối đa hỗ trợ 100 cái.
    /// </summary>
    /// <param name="notification"></param>
    /// <param name="party"></param>
    /// <returns></returns>
    public static NotificationDefinition WithParty(
        this NotificationDefinition notification,
        string party)
    {
        return notification.WithProperty(ToPartyKey, party);
    }

    /// <summary>
    /// Lấy phòng ban nhận tin nhắn
    /// </summary>
    /// <param name="notification"></param>
    public static string? GetPartyOrNull(
        this NotificationDefinition notification)
    {
        if (notification.Properties.TryGetValue(ToPartyKey, out var partyDefine))
        {
            return partyDefine?.ToString();
        }

        return null;
    }
}
