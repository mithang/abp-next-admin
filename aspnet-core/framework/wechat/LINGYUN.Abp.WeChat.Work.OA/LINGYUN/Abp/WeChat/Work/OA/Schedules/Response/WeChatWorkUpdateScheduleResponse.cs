using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.OA.Schedules.Response;
/// <summary>
/// Tham số phản hồi cập nhật lịch trình
/// </summary>
/// <remarks>
/// Chi tiết xem tại: <see href="https://developer.work.weixin.qq.com/document/path/97720"/>
/// </remarks>
public class WeChatWorkUpdateScheduleResponse : WeChatWorkResponse
{
    /// <summary>
    /// ID lịch trình mới phát sinh khi sửa đổi lịch trình lặp lại.
    /// </summary>
    /// <remarks>
    /// Đối với lịch trình lặp lại, nếu không sửa đổi toàn bộ chu kỳ, lịch trình lặp lại gốc sẽ bị cắt ngắn, tạo ra lịch trình lặp lại mới, lúc này sẽ trả về ID của lịch trình mới
    /// </remarks>
    [NotNull]
    [JsonProperty("schedule_id")]
    [JsonPropertyName("schedule_id")]
    public string ScheduleId { get; set; } = default!;
}
