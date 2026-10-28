using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.Common.Members.Models;
/// <summary>
/// Thuộc tính dạng văn bản
/// </summary>
public class ExternalTextAttribute : ExternalAttribute
{
    /// <summary>
    /// Văn bản
    /// </summary>
    [NotNull]
    [JsonProperty("text")]
    [JsonPropertyName("text")]
    public ExternalTextModel Text { get; set; } = default!;
}

public class ExternalTextModel
{
    /// <summary>
    /// Văn bản
    /// </summary>
    [NotNull]
    [JsonProperty("value")]
    [JsonPropertyName("value")]
    public string Value { get; set; } = default!;
}
