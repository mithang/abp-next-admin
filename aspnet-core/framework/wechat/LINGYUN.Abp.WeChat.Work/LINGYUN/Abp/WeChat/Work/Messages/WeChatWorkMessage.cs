using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.Messages;
/// <summary>
/// Tin nhắn WeChat Work
/// </summary>
public abstract class WeChatWorkMessage : WeChatWorkRequest
{
    /// <summary>
    /// Chỉ định thành viên nhận tin nhắn, danh sách ID thành viên (nhiều người nhận ngăn cách bằng ‘|’, tối đa 1000 người).
    /// Trường hợp đặc biệt: nếu chỉ định "@all" thì gửi tới toàn bộ thành viên của ứng dụng doanh nghiệp này
    /// </summary>
    [JsonProperty("touser")]
    [JsonPropertyName("touser")]
    public virtual string? ToUser { get; set; }
    /// <summary>
    /// Chỉ định phòng ban nhận tin nhắn, danh sách ID phòng ban, nhiều người nhận ngăn cách bằng ‘|’, tối đa 100.
    /// Khi touser là "@all" thì bỏ qua tham số này
    /// </summary>
    [JsonProperty("toparty")]
    [JsonPropertyName("toparty")]
    public virtual string? ToParty { get; set; }
    /// <summary>
    /// Chỉ định nhãn nhận tin nhắn, danh sách ID nhãn, nhiều người nhận ngăn cách bằng ‘|’, tối đa 100.
    /// Khi touser là "@all" thì bỏ qua tham số này
    /// </summary>
    [JsonProperty("totag")]
    [JsonPropertyName("totag")]
    public virtual string? ToTag { get; set; }
    /// <summary>
    /// Loại tin nhắn
    /// </summary>
    [NotNull]
    [JsonProperty("msgtype")]
    [JsonPropertyName("msgtype")]
    public virtual string MsgType { get; protected set; }
    /// <summary>
    /// ID của ứng dụng doanh nghiệp, kiểu số nguyên.
    /// Đối với phát triển nội bộ doanh nghiệp, có thể xem tại trang cài đặt của ứng dụng;
    /// Đối với nhà cung cấp dịch vụ bên thứ ba, có thể lấy giá trị tham số này qua giao diện lấy thông tin ủy quyền doanh nghiệp
    /// </summary>
    [NotNull]
    [JsonProperty("agentid")]
    [JsonPropertyName("agentid")]
    public virtual string AgentId { get; protected set; }
    protected WeChatWorkMessage(
        string agentId,
        string msgType,
        string toUser = "",
        string toParty = "",
        string toTag = "")
    {
        AgentId = agentId;
        MsgType = msgType;
        ToUser = toUser;
        ToParty = toParty;
        ToTag = toTag;
    }
}
