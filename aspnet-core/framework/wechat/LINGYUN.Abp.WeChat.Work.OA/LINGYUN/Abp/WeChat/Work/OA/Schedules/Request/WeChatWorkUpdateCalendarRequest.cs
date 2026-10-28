using JetBrains.Annotations;
using LINGYUN.Abp.WeChat.Work.OA.Schedules.Models;
using Newtonsoft.Json;
using System.Text.Json.Serialization;
using Volo.Abp;

namespace LINGYUN.Abp.WeChat.Work.OA.Schedules.Request;
/// <summary>
/// Tham số yêu cầu cập nhật lịch
/// </summary>
/// <remarks>
/// Chi tiết xem tại: <see href="https://developer.work.weixin.qq.com/document/path/97716"/>
/// </remarks>
public class WeChatWorkUpdateCalendarRequest : WeChatWorkRequest
{
    /// <summary>
    /// Thông tin lịch
    /// </summary>
    [NotNull]
    [JsonProperty("calendar")]
    [JsonPropertyName("calendar")]
    public UpdateCalendar Calendar { get; }
    /// <summary>
    /// Có không cập nhật phạm vi có thể đăng ký hay không. 0-Không; 1-Có. Mặc định là 0, sẽ cập nhật phạm vi có thể đăng ký
    /// </summary>
    [CanBeNull]
    [JsonProperty("skip_public_range")]
    [JsonPropertyName("skip_public_range")]
    public uint? SkipPublicRange { get; }
    public WeChatWorkUpdateCalendarRequest(UpdateCalendar calendar, bool skipPublicRange = false)
    {
        Calendar = calendar;
        SkipPublicRange = skipPublicRange ? 1u : 0u;
    }

    protected override void Validate()
    {
        Check.NotNull(Calendar, nameof(Calendar));

        Calendar.Validate();
    }
}
