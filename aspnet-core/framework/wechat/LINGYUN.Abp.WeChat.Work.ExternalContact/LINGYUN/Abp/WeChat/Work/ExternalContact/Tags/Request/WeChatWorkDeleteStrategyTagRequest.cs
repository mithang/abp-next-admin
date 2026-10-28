using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.ExternalContact.Tags.Request;
public class WeChatWorkDeleteStrategyTagRequest : WeChatWorkRequest
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

    private WeChatWorkDeleteStrategyTagRequest(
        string[]? groupId = null,
        string[]? tagId = null)
    {
        GroupId = groupId;
        TagId = tagId;
    }

    public static WeChatWorkDeleteStrategyTagRequest Tag(string[] tagId)
    {
        return new WeChatWorkDeleteStrategyTagRequest(tagId: tagId);
    }

    public static WeChatWorkDeleteStrategyTagRequest Group(string[] groupId)
    {
        return new WeChatWorkDeleteStrategyTagRequest(groupId);
    }
}
