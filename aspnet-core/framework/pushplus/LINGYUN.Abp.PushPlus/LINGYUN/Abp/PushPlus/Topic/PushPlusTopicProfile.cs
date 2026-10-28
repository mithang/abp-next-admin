using Newtonsoft.Json;

namespace LINGYUN.Abp.PushPlus.Topic;
/// <summary>
/// Chi tiết nhóm
/// </summary>
public class PushPlusTopicProfile : PushPlusTopic
{
    /// <summary>
    /// Địa chỉ hình ảnh mã QR vĩnh viễn
    /// </summary>
    [JsonProperty("qrCodeImgUrl")]
    public string? QrCodeImgUrl { get; set; }
    /// <summary>
    /// Thông tin liên hệ
    /// </summary>
    [JsonProperty("contact")]
    public string? Contact { get; set; }
    /// <summary>
    /// Giới thiệu nhóm
    /// </summary>
    [JsonProperty("introduction")]
    public string? Introduction { get; set; }
    /// <summary>
    /// Nội dung trả lời sau khi tham gia
    /// </summary>
    [JsonProperty("receiptMessage")]
    public string? ReceiptMessage { get; set; }
    /// <summary>
    /// Tổng số người đăng ký nhóm
    /// </summary>
    [JsonProperty("topicUserCount")]
    public string? TopicUserCount { get; set; }
}
