using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;
using Volo.Abp;

namespace LINGYUN.Abp.WeChat.Work.OA.Schedules.Request;
/// <summary>
/// Tham số yêu cầu lấy danh sách lịch trình trong lịch
/// </summary>
/// <remarks>
/// Chi tiết xem tại: <see href="https://developer.work.weixin.qq.com/document/path/97723"/>
/// </remarks>
public class WeChatWorkGetScheduleListByCalendarRequest : WeChatWorkRequest
{
    /// <summary>
    /// ID lịch
    /// </summary>
    [NotNull]
    [JsonProperty("cal_id")]
    [JsonPropertyName("cal_id")]
    public string CalId { get; }
    /// <summary>
    /// Phân trang, độ lệch, mặc định là 0
    /// </summary>
    [NotNull]
    [JsonProperty("offset")]
    [JsonPropertyName("offset")]
    public int Offset { get; }
    /// <summary>
    /// Phân trang, lượng dữ liệu dự kiến yêu cầu, mặc định là 500, phạm vi giá trị 1 ~ 1000
    /// </summary>
    [NotNull]
    [JsonProperty("limit")]
    [JsonPropertyName("limit")]
    public int Limit { get; }
    public WeChatWorkGetScheduleListByCalendarRequest(string calId, int offset = 0, int limit = 500)
    {
        CalId = Check.NotNullOrWhiteSpace(calId, nameof(calId));
        Offset = offset;
        Limit = limit;

        if (Limit <= 0)
        {
            Limit = 1;
        }
        if (Limit > 1000)
        {
            Limit = 1000;
        }
    }
}
