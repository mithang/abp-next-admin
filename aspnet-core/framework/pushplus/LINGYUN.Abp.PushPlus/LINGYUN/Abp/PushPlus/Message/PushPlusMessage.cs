using Newtonsoft.Json;
using System;

namespace LINGYUN.Abp.PushPlus.Message;

public class PushPlusMessage
{
    /// <summary>
    /// Kênh gửi tin nhắn;
    /// wechat-Tài khoản công khai WeChat,
    /// mail-Thư điện tử,
    /// cp-Ứng dụng WeChat doanh nghiệp,
    /// webhook-Webhook của bên thứ ba
    /// </summary>
    [JsonProperty("channel")]
    public string Channel { get; set; } = default!;
    /// <summary>
    /// Loại tin nhắn;
    /// 1-Tin nhắn một đối một,
    /// 2-Tin nhắn một đối nhiều
    /// </summary>
    [JsonProperty("messageType")]
    public PushPlusMessageType MessageType { get; set; }
    /// <summary>
    /// Mã liên kết rút gọn của tin nhắn; có thể dùng để tra cứu kết quả gửi tin nhắn
    /// </summary>
    [JsonProperty("shortCode")]
    public string ShortCode { get; set; } = default!;
    /// <summary>
    /// Tiêu đề tin nhắn
    /// </summary>
    [JsonProperty("title")]
    public string Title { get; set; } = default!;
    /// <summary>
    /// Tên nhóm, chỉ có giá trị với tin nhắn một đối nhiều
    /// </summary>
    [JsonProperty("topicName")]
    public string? TopicName { get; set; }
    /// <summary>
    /// Ngày cập nhật
    /// </summary>
    [JsonProperty("updateTime")]
    public DateTime UpdateTime { get; set; }
}
