using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.OA.Schedules.Models;
/// <summary>
/// Phạm vi công khai lịch
/// </summary>
public class CalendarPublicRange
{
    /// <summary>
    /// Phạm vi danh sách thành viên được công khai
    /// </summary>
    [CanBeNull]
    [JsonProperty("userids")]
    [JsonPropertyName("userids")]
    public string[]? UserIds { get; set; }
    /// <summary>
    /// Phạm vi danh sách phòng ban được công khai
    /// </summary>
    [CanBeNull]
    [JsonProperty("partyids")]
    [JsonPropertyName("partyids")]
    public int[]? PartyIds { get; set; }
    public CalendarPublicRange(string[]? userIds = null, int[]? partyIds = null)
    {
        UserIds = userIds;
        PartyIds = partyIds;
    }
}
