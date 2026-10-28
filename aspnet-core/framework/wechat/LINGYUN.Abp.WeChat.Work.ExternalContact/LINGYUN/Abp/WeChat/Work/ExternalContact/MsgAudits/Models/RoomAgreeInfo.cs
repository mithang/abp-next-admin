using JetBrains.Annotations;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.ExternalContact.MsgAudits.Models;
/// <summary>
/// Tình hình đồng ý trò chuyện nhóm
/// </summary>
public class RoomAgreeInfo
{
    /// <summary>
    /// exteranalopenid của thành viên bên ngoài
    /// </summary>
    [NotNull]
    [JsonProperty("exteranalopenid")]
    [JsonPropertyName("exteranalopenid")]
    public string ExteranalOpenId { get; set; } = default!;
    /// <summary>
    /// Đồng ý:"Agree", không đồng ý:"Disagree"
    /// </summary>
    [NotNull]
    [JsonProperty("agree_status")]
    [JsonPropertyName("agree_status")]
    public string AgreeStatus { get; set; } = default!;
    /// <summary>
    /// Thời gian cụ thể trạng thái đồng ý thay đổi, thời gian UTC
    /// </summary>
    [CanBeNull]
    [JsonProperty("status_change_time")]
    [JsonPropertyName("status_change_time")]
    public long? StatusChangeTime { get; set; }
}
