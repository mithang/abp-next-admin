using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.Messages.Models;
/// <summary>
/// Thông báo văn bản và hình ảnh của WeChat Doanh nghiệp
/// </summary>
public class WeChatWorkNewMessage : WeChatWorkMessage
{
    public WeChatWorkNewMessage(
        string agentId,
        NewMessagePayload news) : base(agentId, "news")
    {
        News = news;
    }
    /// <summary>
    /// Tin nhắn văn bản và hình ảnh
    /// </summary>
    [NotNull]
    [JsonProperty("news")]
    [JsonPropertyName("news")]
    public NewMessagePayload News { get; set; }
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
