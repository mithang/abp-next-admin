using JetBrains.Annotations;
using LINGYUN.Abp.WeChat.Work.OA.Schedules.Models;
using Newtonsoft.Json;
using System.Text.Json.Serialization;
using Volo.Abp;

namespace LINGYUN.Abp.WeChat.Work.OA.Schedules.Request;
/// <summary>
/// Tham số yêu cầu tạo lịch trình
/// </summary>
/// <remarks>
/// Chi tiết xem tại: <see href="https://developer.work.weixin.qq.com/document/path/93648"/>
/// </remarks>
public class WeChatWorkCreateScheduleRequest : WeChatWorkRequest
{
    /// <summary>
    /// Thông tin lịch
    /// </summary>
    [NotNull]
    [JsonProperty("schedule")]
    [JsonPropertyName("schedule")]
    public CreateSchedule Schedule { get; }
    /// <summary>
    /// Agentid của ứng dụng do bên được ủy quyền cài đặt. Chỉ bộ ứng dụng đa ứng dụng bên thứ ba cũ mới cần điền tham số này
    /// </summary>
    [CanBeNull]
    [JsonProperty("agentid")]
    [JsonPropertyName("agentid")]
    public int? AgentId { get; set; }
    public WeChatWorkCreateScheduleRequest(CreateSchedule schedule)
    {
        Schedule = schedule;
    }

    protected override void Validate()
    {
        Check.NotNull(Schedule, nameof(Schedule));

        Schedule.Validate();
    }
}
