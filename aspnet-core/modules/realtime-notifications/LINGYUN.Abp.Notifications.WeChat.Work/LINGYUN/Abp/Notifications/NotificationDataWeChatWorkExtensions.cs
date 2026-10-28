using LINGYUN.Abp.WeChat.Work.Messages.Models;
using Newtonsoft.Json;

namespace LINGYUN.Abp.Notifications;
public static partial class NotificationDataWeChatWorkExtensions
{
    private const string Prefix = "wx-work:";
    private const string AgentIdKey = Prefix + "agent_id";
    private const string ToTagKey = Prefix + "to_tag";
    private const string ToPartyKey = Prefix + "to_party";
    private const string SafeKey = Prefix + "safe";
    private const string EnableIdTransKey = Prefix + "enable_id_trans";
    private const string EnableDuplicateCheckKey = Prefix + "enable_duplicate_check";
    private const string DuplicateCheckIntervalKey = Prefix + "duplicate_check_interval";

    /// <summary>
    /// Đặt gửi tới tất cả ứng dụng
    /// </summary>
    /// <param name="notificationData"></param>
    /// <returns></returns>
    public static void WithAllAgent(
        this NotificationData notificationData)
    {
        notificationData.SetAgentId("@all");
    }

    /// <summary>
    /// Đặt định danh ứng dụng tin nhắn
    /// </summary>
    /// <param name="notificationData"></param>
    /// <param name="agentId"></param>
    /// <returns></returns>
    public static void SetAgentId(
        this NotificationData notificationData,
        string agentId)
    {
        notificationData.TrySetData(AgentIdKey, agentId);
    }
    /// <summary>
    /// Lấy định danh ứng dụng tin nhắn
    /// </summary>
    /// <param name="notificationData"></param>
    public static string? GetAgentIdOrNull(
        this NotificationData notificationData)
    {
        return notificationData.TryGetData(AgentIdKey)?.ToString();
    }
    /// <summary>
    /// Chỉ định nhãn nhận tin nhắn, danh sách ID nhãn, nhiều người nhận phân tách bằng ‘|’, tối đa hỗ trợ 100.
    /// </summary>
    /// <param name="notificationData"></param>
    /// <param name="tag"></param>
    /// <returns></returns>
    public static void SetTag(
        this NotificationData notificationData,
        string tag)
    {
        notificationData.TrySetData(ToTagKey, tag);
    }
    /// <summary>
    /// Lấy nhãn nhận tin nhắn
    /// </summary>
    /// <param name="notificationData"></param>
    public static string? GetTagOrNull(
        this NotificationData notificationData)
    {
        return notificationData.TryGetData(ToTagKey)?.ToString();
    }
    /// <summary>
    /// Chỉ định phòng ban nhận tin nhắn, danh sách ID phòng ban, nhiều người nhận phân tách bằng ‘|’, tối đa hỗ trợ 100.
    /// </summary>
    /// <param name="notificationData"></param>
    /// <param name="party"></param>
    /// <returns></returns>
    public static void SetParty(
        this NotificationData notificationData,
        string party)
    {
        notificationData.TrySetData(ToPartyKey, party);
    }
    /// <summary>
    /// Lấy phòng ban nhận tin nhắn
    /// </summary>
    /// <param name="notificationData"></param>
    public static string? GetPartyOrNull(
        this NotificationData notificationData)
    {
        return notificationData.TryGetData(ToPartyKey)?.ToString();
    }

    /// <summary>
    /// Đặt có bảo mật tin nhắn hay không (chỉ tin nhắn văn bản hỗ trợ)
    /// </summary>
    /// <param name="notificationData"></param>
    /// <param name="safe"></param>
    public static void SetSafe(
        this NotificationData notificationData,
        bool safe)
    {
        notificationData.TrySetData(SafeKey, safe ? 1 : 0);
    }

    /// <summary>
    /// Lấy có bảo mật tin nhắn hay không, mặc định 0 (không bảo mật)
    /// </summary>
    /// <remarks>
    /// WeChat Doanh nghiệp yêu cầu int: 0 nghĩa là không, 1 nghĩa là có
    /// </remarks>
    /// <param name="notificationData"></param>
    public static int GetSafe(
        this NotificationData notificationData)
    {
        return notificationData.TryGetData(SafeKey) is bool safe
            ? (safe ? 1 : 0)
            : 0;
    }

    /// <summary>
    /// Đặt có bật chuyển đổi id hay không
    /// </summary>
    /// <param name="notificationData"></param>
    /// <param name="enableIdTrans"></param>
    public static void SetEnableIdTrans(
        this NotificationData notificationData,
        bool enableIdTrans)
    {
        notificationData.TrySetData(EnableIdTransKey, enableIdTrans ? (byte)1 : (byte)0);
    }

    /// <summary>
    /// Lấy có bật chuyển đổi id hay không, mặc định 0 (không bật)
    /// </summary>
    /// <remarks>
    /// WeChat Doanh nghiệp yêu cầu byte: 0 nghĩa là không, 1 nghĩa là có
    /// </remarks>
    /// <param name="notificationData"></param>
    public static byte GetEnableIdTrans(
        this NotificationData notificationData)
    {
        return notificationData.TryGetData(EnableIdTransKey) is bool enable
            ? (enable ? (byte)1 : (byte)0)
            : (byte)0;
    }

    /// <summary>
    /// Đặt có bật kiểm tra tin nhắn trùng lặp hay không
    /// </summary>
    /// <param name="notificationData"></param>
    /// <param name="enableDuplicateCheck"></param>
    public static void SetEnableDuplicateCheck(
        this NotificationData notificationData,
        bool enableDuplicateCheck)
    {
        notificationData.TrySetData(EnableDuplicateCheckKey, enableDuplicateCheck ? (byte)1 : (byte)0);
    }

    /// <summary>
    /// Lấy có bật kiểm tra tin nhắn trùng lặp hay không, mặc định 0 (không bật)
    /// </summary>
    /// <remarks>
    /// WeChat Doanh nghiệp yêu cầu byte: 0 nghĩa là không, 1 nghĩa là có
    /// </remarks>
    /// <param name="notificationData"></param>
    public static byte GetEnableDuplicateCheck(
        this NotificationData notificationData)
    {
        return notificationData.TryGetData(EnableDuplicateCheckKey) is bool enable
            ? (enable ? (byte)1 : (byte)0)
            : (byte)0;
    }

    /// <summary>
    /// Đặt khoảng thời gian kiểm tra tin nhắn trùng lặp (giây)
    /// </summary>
    /// <param name="notificationData"></param>
    /// <param name="interval"></param>
    public static void SetDuplicateCheckInterval(
        this NotificationData notificationData,
        int interval)
    {
        notificationData.TrySetData(DuplicateCheckIntervalKey, interval);
    }

    /// <summary>
    /// Lấy khoảng thời gian kiểm tra tin nhắn trùng lặp (giây), mặc định 1800
    /// </summary>
    /// <param name="notificationData"></param>
    public static int GetDuplicateCheckInterval(
        this NotificationData notificationData)
    {
        return notificationData.TryGetData(DuplicateCheckIntervalKey) is int interval
            ? interval
            : 1800;
    }

    /// <summary>
    /// Thử lấy tải trọng tin nhắn
    /// </summary>
    /// <remarks>
    /// Tải trọng tin nhắn được ghi vào gói thuộc tính dưới dạng chuỗi JSON (xem các phương thức <c>With*Message</c>),
    /// vì vậy ở đây khôi phục bằng cách giải tuần tự hóa JSON. Nếu <c>TMessage</c> là kiểu cụ thể thì có thể khôi phục trực tiếp;
    /// kiểu trừu tượng (như <c>TemplateCard</c>) cần bộ chuyển đổi JSON tham gia phân biệt kiểu.
    /// </remarks>
    /// <param name="notificationData"></param>
    /// <param name="messageKey">Khóa tin nhắn</param>
    /// <param name="message">Tải trọng tin nhắn</param>
    /// <returns></returns>
    public static bool TryGetMessagePayload<TMessage>(
        this NotificationData notificationData,
        string messageKey,
        out TMessage? message)
        where TMessage : class
    {
        message = null;

        var payload = notificationData.TryGetData(messageKey);
        if (payload == null)
        {
            return false;
        }

        // Giá trị trong gói thuộc tính có thể là chuỗi JSON, cũng có thể đã được giải tuần tự hóa thành nút JSON
        var json = payload as string ?? payload.ToString();

        if (string.IsNullOrWhiteSpace(json))
        {
            return false;
        }

        try
        {
            message = JsonConvert.DeserializeObject<TMessage>(json, JsonSettings);
        }
        catch (JsonException)
        {
            // Khi tải trọng không hợp lệ thì trả về false, bên gọi quyết định có quay lại hay không
            return false;
        }

        return message != null;
    }

    private static readonly JsonSerializerSettings JsonSettings = new()
    {
        Converters = { new TemplateCardJsonConverter() }
    };
}
