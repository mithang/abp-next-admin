using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.ExternalContact.Tags.Request;
/// <summary>
/// Tham số yêu cầu lấy thư viện nhãn doanh nghiệp
/// </summary>
/// <remarks>
/// Xem chi tiết tại: <see href="https://developer.work.weixin.qq.com/document/path/92117#%E8%8E%B7%E5%8F%96%E4%BC%81%E4%B8%9A%E6%A0%87%E7%AD%BE%E5%BA%93" />
/// </remarks>
public class WeChatWorkGetCropTagListRequest : WeChatWorkRequest
{
    /// <summary>
    /// id nhãn cần truy vấn
    /// </summary>
    [CanBeNull]
    [JsonProperty("tag_id")]
    [JsonPropertyName("tag_id")]
    public string[]? TagId { get; }
    /// <summary>
    /// id nhóm nhãn cần truy vấn, trả về nhóm nhãn đó cùng tất cả thông tin nhãn thuộc nó
    /// </summary>
    [CanBeNull]
    [JsonProperty("group_id")]
    [JsonPropertyName("group_id")]
    public string[]? GroupId { get; }
    public WeChatWorkGetCropTagListRequest(string[]? tagId = null, string[]? groupId = null)
    {
        TagId = tagId;
        GroupId = groupId;
    }
}
