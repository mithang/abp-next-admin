using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;
using Volo.Abp;

namespace LINGYUN.Abp.WeChat.Work.ExternalContact.Tags.Request;
public class WeChatWorkUpdateStrategyTagRequest : WeChatWorkRequest
{
    /// <summary>
    /// id của nhãn hoặc nhóm nhãn
    /// </summary>
    [NotNull]
    [JsonProperty("id")]
    [JsonPropertyName("id")]
    public string Id { get; }
    /// <summary>
    /// Tên nhãn hoặc nhóm nhãn mới, tối đa 30 ký tự
    /// </summary>
    [CanBeNull]
    [JsonProperty("name")]
    [JsonPropertyName("name")]
    public string? Name { get; }
    /// <summary>
    /// Giá trị thứ tự của nhãn/nhóm nhãn. Giá trị order càng lớn thì xếp càng trước. Phạm vi giá trị hợp lệ là [0, 2^32)
    /// </summary>
    [CanBeNull]
    [JsonProperty("order")]
    [JsonPropertyName("order")]
    public int? Order { get; set; }

    public WeChatWorkUpdateStrategyTagRequest(string id, string? name = null)
    {
        Check.NotNullOrWhiteSpace(id, nameof(id));
        Check.Length(name, nameof(name), 30);

        Id = id;
        Name = name;
    }
}
