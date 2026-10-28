using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;
using Volo.Abp;

namespace LINGYUN.Abp.WeChat.Work.OA.Schedules.Request;
/// <summary>
/// Tham số yêu cầu xóa lịch
/// </summary>
/// <remarks>
/// Chi tiết xem: <see href="https://developer.work.weixin.qq.com/document/path/97718"/>
/// </remarks>
public class WeChatWorkDeleteCalendarRequest : WeChatWorkRequest
{
    /// <summary>
    /// ID lịch
    /// </summary>
    [NotNull]
    [JsonProperty("cal_id")]
    [JsonPropertyName("cal_id")]
    public string CalId { get; }
    public WeChatWorkDeleteCalendarRequest(string calId)
    {
        CalId = Check.NotNullOrWhiteSpace(calId, nameof(calId));
    }
}
