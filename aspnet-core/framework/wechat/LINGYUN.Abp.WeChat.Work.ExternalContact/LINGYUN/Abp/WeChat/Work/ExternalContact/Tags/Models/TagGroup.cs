using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.ExternalContact.Tags.Models;
public abstract class TagGroup
{
    /// <summary>
    /// id nhóm nhãn
    /// </summary>
    [NotNull]
    [JsonProperty("group_id")]
    [JsonPropertyName("group_id")]
    public string GroupId { get; set; } = default!;
    /// <summary>
    /// Tên nhóm nhãn
    /// </summary>
    [NotNull]
    [JsonProperty("group_name")]
    [JsonPropertyName("group_name")]
    public string GroupName { get; set; } = default!;
    /// <summary>
    /// Thời gian tạo nhóm nhãn
    /// </summary>
    [NotNull]
    [JsonProperty("create_time")]
    [JsonPropertyName("create_time")]
    public long CreateTime { get; set; }
    /// <summary>
    /// Giá trị thứ tự sắp xếp của nhóm nhãn, giá trị order lớn được xếp trước. Phạm vi giá trị hợp lệ là [0, 2^32)
    /// </summary>
    [NotNull]
    [JsonProperty("order")]
    [JsonPropertyName("order")]
    public int Order { get; set; }
}
