using System.Text.Json.Serialization;

namespace LINGYUN.Abp.OpenObserve.Models.Search;

/// <summary>
/// Mục giá trị
/// </summary>
public class ValuesItem
{
    /// <summary>
    /// Giá trị
    /// </summary>
    [JsonPropertyName("zo_sql_key")]
    public string? Key { get; set; }

    /// <summary>
    /// Số lần xuất hiện
    /// </summary>
    [JsonPropertyName("zo_sql_num")]
    public long Num { get; set; }
}
