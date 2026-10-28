using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.Common.Members.Models;
/// <summary>
/// Thuộc tính công khai của thành viên
/// </summary>
public abstract class ExternalAttribute
{
    /// <summary>
    /// Tên thuộc tính: cần đảm bảo thuộc tính đã được tạo ở phía quản trị trước, nếu không sẽ bị bỏ qua
    /// </summary>
    [NotNull]
    [JsonProperty("name")]
    [JsonPropertyName("name")]
    public string Name { get; set; } = default!;
    /// <summary>
    /// Loại thuộc tính
    /// </summary>
    [NotNull]
    [JsonProperty("type")]
    [JsonPropertyName("type")]
    public ExternalAttributeType Type { get; set; }
}
