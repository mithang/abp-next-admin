using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;
using Volo.Abp;

namespace LINGYUN.Abp.WeChat.Work.OA.Schedules.Models;
/// <summary>
/// Cập nhật lịch
/// </summary>
public class UpdateCalendar : CreateOrUpdateCalendar
{
    /// <summary>
    /// ID lịch
    /// </summary>
    [NotNull]
    [JsonProperty("cal_id")]
    [JsonPropertyName("cal_id")]
    public string CalId { get; }

    public UpdateCalendar(
        string calId,
        string summary, 
        string color,
        string? description)
        : base(summary, color, description)
    {
        CalId = Check.NotNullOrWhiteSpace(calId, nameof(calId));
    }
}
