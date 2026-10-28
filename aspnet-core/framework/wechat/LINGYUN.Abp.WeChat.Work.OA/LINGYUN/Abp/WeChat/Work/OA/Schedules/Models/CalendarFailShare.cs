using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.OA.Schedules.Models;
/// <summary>
/// Thành viên phạm vi thông báo lịch không hợp lệ
/// </summary>
public class CalendarFailShare
{
    /// <summary>
    /// Mã lỗi
    /// </summary>
    [NotNull]
    [JsonProperty("errcode")]
    [JsonPropertyName("errcode")]
    public int ErrorCode { get; set; }
    /// <summary>
    /// Thông báo lỗi
    /// </summary>
    [NotNull]
    [JsonProperty("errmsg")]
    [JsonPropertyName("errmsg")]
    public string ErrorMessage { get; set; } = default!;
    /// <summary>
    /// Id của thành viên phạm vi thông báo lịch
    /// </summary>
    [NotNull]
    [JsonProperty("userid")]
    [JsonPropertyName("userid")]
    public string UserId { get; set; } = default!;
}
