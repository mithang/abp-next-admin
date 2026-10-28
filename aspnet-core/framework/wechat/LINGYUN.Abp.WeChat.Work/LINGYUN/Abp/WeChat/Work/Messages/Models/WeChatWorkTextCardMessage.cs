using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.Messages.Models;
/// <summary>
/// Thông báo thẻ văn bản của WeChat Doanh nghiệp
/// </summary>
public class WeChatWorkTextCardMessage : WeChatWorkMessage
{
    public WeChatWorkTextCardMessage(
        string agentId,
        TextCardMessage textcard) : base(agentId, "textcard")
    {
        TextCard = textcard;
    }
    /// <summary>
    /// Tin nhắn thẻ
    /// </summary>
    [NotNull]
    [JsonProperty("textcard")]
    [JsonPropertyName("textcard")]
    public TextCardMessage TextCard { get; set; }
    /// <summary>
    /// Cho biết có bật chuyển đổi id hay không, 0 là không, 1 là có, mặc định là 0.
    /// Chỉ ứng dụng bên thứ ba mới cần dùng
    /// Ứng dụng tự xây dựng của doanh nghiệp có thể bỏ qua.
    /// </summary>
    [JsonProperty("enable_id_trans")]
    [JsonPropertyName("enable_id_trans")]
    public byte EnableIdTrans { get; set; }
    /// <summary>
    /// Cho biết có bật kiểm tra tin nhắn trùng lặp hay không, 0 là không, 1 là có, mặc định là 0
    /// </summary>
    [JsonProperty("enable_duplicate_check")]
    [JsonPropertyName("enable_duplicate_check")]
    public byte EnableDuplicateCheck { get; set; }
    /// <summary>
    /// Cho biết khoảng thời gian kiểm tra tin nhắn trùng lặp, mặc định là 1800s, tối đa không vượt quá 4 giờ
    /// </summary>
    [JsonProperty("duplicate_check_interval")]
    [JsonPropertyName("duplicate_check_interval")]
    public int DuplicateCheckInterval { get; set; } = 1800;
}
