using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.Messages.Models;
/// <summary>
/// Tin nhắn văn bản WeChat Work
/// </summary>
public class WeChatWorkTextMessage : WeChatWorkMessage
{
    public WeChatWorkTextMessage(
        string agentId,
        TextMessage text) : base(agentId, "text")
    {
        Text = text;
    }

    /// <summary>
    /// Nội dung tin nhắn, dài tối đa 2048 byte, vượt quá sẽ bị cắt ngắn (hỗ trợ chuyển đổi id)
    /// </summary>
    [NotNull]
    [JsonProperty("text")]
    [JsonPropertyName("text")]
    public TextMessage Text { get; set; }
    /// <summary>
    /// Cho biết có phải tin nhắn bảo mật hay không,
    /// 0 là có thể chia sẻ ra ngoài,
    /// 1 là không thể chia sẻ và nội dung hiển thị watermark,
    /// Mặc định là 0
    /// </summary>
    [JsonProperty("safe")]
    [JsonPropertyName("safe")]
    public int Safe { get; set; }
    /// <summary>
    /// Cho biết có bật chuyển đổi id hay không, 0 là không, 1 là có, mặc định là 0.
    /// Chỉ ứng dụng bên thứ ba mới cần dùng
    /// Ứng dụng doanh nghiệp tự xây dựng có thể bỏ qua.
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
    /// Cho biết khoảng thời gian kiểm tra tin nhắn trùng lặp, mặc định 1800s, tối đa không quá 4 giờ
    /// </summary>
    [JsonProperty("duplicate_check_interval")]
    [JsonPropertyName("duplicate_check_interval")]
    public int DuplicateCheckInterval { get; set; } = 1800;
}
