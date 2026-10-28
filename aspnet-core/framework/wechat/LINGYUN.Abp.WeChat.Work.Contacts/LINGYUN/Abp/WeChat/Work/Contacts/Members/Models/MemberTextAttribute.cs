using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.Contacts.Members.Models;
/// <summary>
/// Thuộc tính thành viên dạng văn bản
/// </summary>
public class MemberTextAttribute : MemberAttribute
{
    /// <summary>
    /// Văn bản
    /// </summary>
    [NotNull]
    [JsonProperty("text")]
    [JsonPropertyName("text")]
    public MemberTextModel Text { get; set; } = default!;
}

public class MemberTextModel
{
    /// <summary>
    /// Văn bản
    /// </summary>
    [NotNull]
    [JsonProperty("value")]
    [JsonPropertyName("value")]
    public string Value { get; set; } = default!;
}
