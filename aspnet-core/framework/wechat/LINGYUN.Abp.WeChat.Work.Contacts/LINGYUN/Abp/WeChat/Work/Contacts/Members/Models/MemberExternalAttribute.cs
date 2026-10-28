using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.Contacts.Members.Models;
/// <summary>
/// Thuộc tính mở rộng của thành viên
/// </summary>
public class MemberExternalAttribute
{
    /// <summary>
    /// Danh sách thuộc tính mở rộng
    /// </summary>
    [NotNull]
    [JsonProperty("attrs")]
    [JsonPropertyName("attrs")]
    public MemberAttribute[] Attributes { get; set; } = default!;
}
