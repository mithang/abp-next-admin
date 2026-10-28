using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.ExternalContact.Tags.Models;
public class CropTag : Tag
{
    /// <summary>
    /// Nhãn đã bị xóa hay chưa, chỉ trả về khi truy vấn với tag_id/group_id được chỉ định
    /// </summary>
    [NotNull]
    [JsonProperty("deleted")]
    [JsonPropertyName("deleted")]
    public bool Deleted { get; set; }
}
