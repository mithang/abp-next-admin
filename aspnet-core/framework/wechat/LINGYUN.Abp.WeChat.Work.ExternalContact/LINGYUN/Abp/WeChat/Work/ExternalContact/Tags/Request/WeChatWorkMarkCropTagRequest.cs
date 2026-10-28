using JetBrains.Annotations;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;
using Volo.Abp;

namespace LINGYUN.Abp.WeChat.Work.ExternalContact.Tags.Request;
/// <summary>
/// Tham số yêu cầu chỉnh sửa nhãn doanh nghiệp của khách hàng
/// </summary>
/// <remarks>
/// Xem chi tiết tại: <see href="https://developer.work.weixin.qq.com/document/path/92118" />
/// </remarks>
public class WeChatWorkMarkCropTagRequest : WeChatWorkRequest
{
    /// <summary>
    /// userid của liên hệ bên ngoài cần thêm
    /// </summary>
    [NotNull]
    [JsonProperty("userid")]
    [JsonPropertyName("userid")]
    public string UserId { get; }
    /// <summary>
    /// userid của liên hệ bên ngoài
    /// </summary>
    [NotNull]
    [JsonProperty("external_userid")]
    [JsonPropertyName("external_userid")]
    public string ExternalUserId { get; }
    /// <summary>
    /// Danh sách nhãn cần gắn
    /// </summary>
    [NotNull]
    [JsonProperty("add_tag")]
    [JsonPropertyName("add_tag")]
    public List<string> CreateTag { get; }
    /// <summary>
    /// Danh sách nhãn cần gỡ
    /// </summary>
    [NotNull]
    [JsonProperty("remove_tag")]
    [JsonPropertyName("remove_tag")]
    public List<string> RemoveTag { get; }
    public WeChatWorkMarkCropTagRequest(string userId, string externalUserId)
    {
        Check.NotNullOrWhiteSpace(userId, nameof(userId));
        Check.NotNullOrWhiteSpace(externalUserId, nameof(externalUserId));

        UserId = userId;
        ExternalUserId = externalUserId;

        CreateTag = new List<string>();
        RemoveTag = new List<string>();
    }

    protected override void Validate()
    {
        if (CreateTag.IsNullOrEmpty() &&
            RemoveTag.IsNullOrEmpty())
        {
            throw new ArgumentException("CreateTag and RemoveTag cannot be empty simultaneously!");
        }
    }
}
