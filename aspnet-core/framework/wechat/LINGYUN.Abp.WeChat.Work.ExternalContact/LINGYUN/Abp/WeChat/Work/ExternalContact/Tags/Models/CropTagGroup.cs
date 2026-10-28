using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.ExternalContact.Tags.Models;
public class CropTagGroup : TagGroup
{
    /// <summary>
    /// Nhóm nhãn đã bị xóa hay chưa, chỉ trả về khi truy vấn với tag_id được chỉ định
    /// </summary>
    [NotNull]
    [JsonProperty("deleted")]
    [JsonPropertyName("deleted")]
    public bool Deleted { get; set; }
    /// <summary>
    /// Danh sách nhãn
    /// </summary>
    [NotNull]
    [JsonProperty("tag")]
    [JsonPropertyName("tag")]
    public CropTag[] Tag { get; set; } = default!;
}
