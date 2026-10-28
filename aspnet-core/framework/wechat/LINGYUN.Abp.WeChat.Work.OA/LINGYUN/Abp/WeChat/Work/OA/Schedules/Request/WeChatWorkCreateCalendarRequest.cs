using JetBrains.Annotations;
using LINGYUN.Abp.WeChat.Work.OA.Schedules.Models;
using Newtonsoft.Json;
using System.Text.Json.Serialization;
using Volo.Abp;

namespace LINGYUN.Abp.WeChat.Work.OA.Schedules.Request;
/// <summary>
/// Tham số yêu cầu tạo lịch
/// </summary>
/// <remarks>
/// Chi tiết xem tại: <see href="https://developer.work.weixin.qq.com/document/path/93647"/>
/// </remarks>
public class WeChatWorkCreateCalendarRequest : WeChatWorkRequest
{
    /// <summary>
    /// Thông tin lịch
    /// </summary>
    [NotNull]
    [JsonProperty("calendar")]
    [JsonPropertyName("calendar")]
    public CreateCalendar Calendar { get; }
    /// <summary>
    /// Agentid của ứng dụng do bên được ủy quyền cài đặt. Chỉ bộ ứng dụng đa ứng dụng bên thứ ba cũ mới cần điền tham số này
    /// </summary>
    [CanBeNull]
    [JsonProperty("agentid")]
    [JsonPropertyName("agentid")]
    public int? AgentId { get; set; }
    public WeChatWorkCreateCalendarRequest(CreateCalendar calendar)
    {
        Calendar = calendar;
    }

    protected override void Validate()
    {
        Check.NotNull(Calendar, nameof(Calendar));

        Calendar.Validate();
    }
}
