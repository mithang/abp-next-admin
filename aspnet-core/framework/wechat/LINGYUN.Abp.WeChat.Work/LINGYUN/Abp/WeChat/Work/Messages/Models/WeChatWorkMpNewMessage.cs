using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.Messages.Models;
/// <summary>
/// Tin nhắn văn bản - hình ảnh của WeChat doanh nghiệp
/// </summary>
public class WeChatWorkMpNewMessage : WeChatWorkMessage
{
    public WeChatWorkMpNewMessage(
        string agentId,
        MpNewMessagePayload mpnews) : base(agentId, "mpnews")
    {
        News = mpnews;
    }
    /// <summary>
    /// Tin nhắn hình ảnh - văn bản (mp)
    /// </summary>
    [NotNull]
    [JsonProperty("mpnews")]
    [JsonPropertyName("mpnews")]
    public MpNewMessagePayload News { get; set; }
    /// <summary>
    /// Cho biết có phải là tin nhắn bảo mật hay không,
    /// 0 nghĩa là có thể chia sẻ ra ngoài,
    /// 1 nghĩa là không thể chia sẻ và nội dung hiển thị watermark,
    /// 2 nghĩa là chỉ được chia sẻ trong nội bộ doanh nghiệp, mặc định là 0;
    /// Lưu ý chỉ tin nhắn loại mpnews mới hỗ trợ giá trị safe là 2, các loại tin nhắn khác không hỗ trợ
    /// </summary>
    [JsonProperty("safe")]
    [JsonPropertyName("safe")]
    public int Safe { get; set; }
    /// <summary>
    /// Cho biết có bật chuyển đổi id hay không, 0 nghĩa là không, 1 nghĩa là có, mặc định là 0.
    /// Chỉ ứng dụng bên thứ ba mới cần dùng
    /// Ứng dụng tự xây dựng của doanh nghiệp có thể bỏ qua.
    /// </summary>
    [JsonProperty("enable_id_trans")]
    [JsonPropertyName("enable_id_trans")]
    public byte EnableIdTrans { get; set; }
    /// <summary>
    /// Cho biết có bật kiểm tra tin nhắn trùng lặp hay không, 0 nghĩa là không, 1 nghĩa là có, mặc định là 0
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
