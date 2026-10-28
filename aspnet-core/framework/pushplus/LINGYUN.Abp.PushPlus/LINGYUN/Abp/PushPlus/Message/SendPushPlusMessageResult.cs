using Newtonsoft.Json;
using System;

namespace LINGYUN.Abp.PushPlus.Message;

public class SendPushPlusMessageResult
{
    /// <summary>
    /// Trạng thái gửi tin nhắn
    /// 0-Chưa gửi,
    /// 1-Đang gửi,
    /// 2-Đã gửi,
    /// 3-Gửi thất bại
    /// </summary>
    [JsonProperty("status")] 
    public PushPlusMessageStatus Status { get; set; }
    /// <summary>
    /// Nguyên nhân gửi thất bại
    /// </summary>
    [JsonProperty("errorMessage")]
    public string? ErrorMessage { get; set; }
    /// <summary>
    /// Thời gian cập nhật
    /// </summary>
    [JsonProperty("updateTime")]
    public DateTime UpdateTime { get; set; }
}
