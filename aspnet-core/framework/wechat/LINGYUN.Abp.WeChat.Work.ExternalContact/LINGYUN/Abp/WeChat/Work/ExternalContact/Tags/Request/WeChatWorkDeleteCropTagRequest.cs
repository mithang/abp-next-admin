using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.ExternalContact.Tags.Request;
/// <summary>
/// Tham số yêu cầu xóa thẻ khách hàng doanh nghiệp
/// </summary>
/// <remarks>
/// Chi tiết xem tại: <see href="https://developer.work.weixin.qq.com/document/path/92117#%E5%88%A0%E9%99%A4%E4%BC%81%E4%B8%9A%E5%AE%A2%E6%88%B7%E6%A0%87%E7%AD%BE" />
/// </remarks>
public class WeChatWorkDeleteCropTagRequest : WeChatWorkRequest
{
    /// <summary>
    /// Danh sách id của nhóm thẻ
    /// </summary>
    [CanBeNull]
    [JsonProperty("group_id")]
    [JsonPropertyName("group_id")]
    public string[]? GroupId { get; }
    /// <summary>
    /// Danh sách id của nhóm thẻ
    /// </summary>
    [CanBeNull]
    [JsonProperty("tag_id")]
    [JsonPropertyName("tag_id")]
    public string[]? TagId { get; }
    /// <summary>
    /// Agentid của ứng dụng do bên ủy quyền cài đặt. Chỉ bộ ứng dụng đa ứng dụng bên thứ ba cũ mới cần điền tham số này
    /// </summary>
    [CanBeNull]
    [JsonProperty("agentid")]
    [JsonPropertyName("agentid")]
    public string? AgentId { get; set; }

    private WeChatWorkDeleteCropTagRequest(
        string[]? groupId = null,
        string[]? tagId = null)
    {
        GroupId = groupId;
        TagId = tagId;
    }

    public static WeChatWorkDeleteCropTagRequest Tag(string[] tagId)
    {
        return new WeChatWorkDeleteCropTagRequest(tagId: tagId);
    }

    public static WeChatWorkDeleteCropTagRequest Group(string[] groupId)
    {
        return new WeChatWorkDeleteCropTagRequest(groupId);
    }
}
