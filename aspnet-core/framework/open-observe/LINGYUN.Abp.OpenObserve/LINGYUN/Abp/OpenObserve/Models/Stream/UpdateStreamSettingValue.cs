using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.OpenObserve.Models.Stream;

/// <summary>
/// Mục cài đặt hỗ trợ add/set/remove
/// </summary>
public class UpdateStreamSettingValue<T>
{
    /// <summary>
    /// Ghi đè
    /// </summary>
    [JsonPropertyName("set")]
    public T[]? Set { get; set; }

    /// <summary>
    /// Bổ sung
    /// </summary>
    [JsonPropertyName("add")]
    public T[]? Add { get; set; }

    /// <summary>
    /// Xóa
    /// </summary>
    [JsonPropertyName("remove")]
    public T[]? Remove { get; set; }
}
