using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;
using Volo.Abp;

namespace LINGYUN.Abp.WeChat.Work.ExternalContact.Tags.Request;
/// <summary>
/// Tham số yêu cầu chỉnh sửa nhãn khách hàng doanh nghiệp
/// </summary>
/// <remarks>
/// Chi tiết xem: <see href="https://developer.work.weixin.qq.com/document/path/92117#%E7%BC%96%E8%BE%91%E4%BC%81%E4%B8%9A%E5%AE%A2%E6%88%B7%E6%A0%87%E7%AD%BE" />
/// </remarks>
public class WeChatWorkUpdateCropTagRequest : WeChatWorkRequest
{
    /// <summary>
    /// id của nhãn hoặc nhóm nhãn
    /// </summary>
    [NotNull]
    [JsonProperty("id")]
    [JsonPropertyName("id")]
    public string Id { get; }
    /// <summary>
    /// Tên mới của nhãn hoặc nhóm nhãn, tối đa 30 ký tự
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
    /// <summary>
    /// agentid của ứng dụng do bên ủy quyền cài đặt. Chỉ bộ ứng dụng đa ứng dụng của bên thứ ba cũ mới cần điền tham số này
    /// </summary>
    [CanBeNull]
    [JsonProperty("agentid")]
    [JsonPropertyName("agentid")]
    public string? AgentId { get; set; }

    public WeChatWorkUpdateCropTagRequest(string id, string? name = null)
    {
        Check.NotNullOrWhiteSpace(id, nameof(id));
        Check.Length(name, nameof(name), 30);

        Id = id;
        Name = name;
    }
}
