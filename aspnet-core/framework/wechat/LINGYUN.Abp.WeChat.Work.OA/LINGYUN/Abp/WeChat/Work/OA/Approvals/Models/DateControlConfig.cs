using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.OA.Approvals.Models;
/// <summary>
/// Cấu hình điều khiển ngày/ngày + giờ
/// </summary>
public class DateControlConfig : ControlConfig
{
    /// <summary>
    /// Nội dung ngày/ngày + giờ
    /// </summary>
    [NotNull]
    [JsonProperty("date")]
    [JsonPropertyName("date")]
    public DateConfig Date { get; set; } = default!;
    public DateControlConfig()
    {

    }

    public DateControlConfig(DateConfig date)
    {
        Date = date;
    }
}

public class DateConfig
{
    /// <summary>
    /// Loại hiển thị thời gian: day - ngày; hour - ngày + giờ, nhất quán với thuộc tính điều khiển mẫu tương ứng
    /// </summary>
    [NotNull]
    [JsonProperty("type")]
    [JsonPropertyName("type")]
    public string Type { get; set; } = default!;
}
