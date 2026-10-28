using JetBrains.Annotations;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;
using Volo.Abp;

namespace LINGYUN.Abp.WeChat.Work.ExternalContact.Tags.Request;
/// <summary>
/// Tham số yêu cầu thêm thẻ khách hàng doanh nghiệp
/// </summary>
/// <remarks>
/// Chi tiết xem tại: <see href="https://developer.work.weixin.qq.com/document/path/92117#%E6%B7%BB%E5%8A%A0%E4%BC%81%E4%B8%9A%E5%AE%A2%E6%88%B7%E6%A0%87%E7%AD%BE" />
/// </remarks>
public class WeChatWorkCreateCropTagRequest : WeChatWorkRequest
{
    /// <summary>
    /// Id nhóm thẻ
    /// </summary>
    [CanBeNull]
    [JsonProperty("group_id")]
    [JsonPropertyName("group_id")]
    public string? GroupId { get; set; }

    private string? _groupName;
    /// <summary>
    /// Tên nhóm thẻ, tối đa 30 ký tự
    /// </summary>
    [CanBeNull]
    [JsonProperty("group_name")]
    [JsonPropertyName("group_name")]
    public string? GroupName {
        get => _groupName;
        set {

            Check.Length(value, nameof(GroupName), 30);
            _groupName = value;
        }
    }
    /// <summary>
    /// Giá trị thứ tự sắp xếp của nhóm thẻ, giá trị order càng lớn càng xếp trước. Phạm vi giá trị hợp lệ là [0, 2^32)
    /// </summary>
    [CanBeNull]
    [JsonProperty("order")]
    [JsonPropertyName("order")]
    public int? Order { get; set; }
    /// <summary>
    /// Agentid của ứng dụng mà bên được uỷ quyền đã cài đặt. Chỉ bộ ứng dụng đa ứng dụng bên thứ ba cũ mới cần điền tham số này
    /// </summary>
    [CanBeNull]
    [JsonProperty("agentid")]
    [JsonPropertyName("agentid")]
    public string? AgentId { get; set; }
    /// <summary>
    /// Nhóm thẻ được thêm
    /// </summary>
    [CanBeNull]
    [JsonProperty("tag")]
    [JsonPropertyName("tag")]
    public List<NewCropTag> Tag { get; }

    public WeChatWorkCreateCropTagRequest()
    {
        Tag = new List<NewCropTag>();
    }

    protected override void Validate()
    {
        if (GroupName.IsNullOrWhiteSpace() &&
            Tag.IsNullOrEmpty())
        {
            throw new ArgumentException("The name of the tag group or the tag list cannot be empty at the same time!");
        }
    }
}

public class NewCropTag
{
    /// <summary>
    /// Tên thẻ được thêm, tối đa 30 ký tự
    /// </summary>
    [NotNull]
    [JsonProperty("name")]
    [JsonPropertyName("name")]
    public string Name { get; }
    /// <summary>
    /// Giá trị thứ tự của thẻ. Giá trị order càng lớn càng xếp trước. Phạm vi giá trị hợp lệ là [0, 2^32)
    /// </summary>
    [CanBeNull]
    [JsonProperty("order")]
    [JsonPropertyName("order")]
    public int? Order { get; set; }
    public NewCropTag(string name, int? order = null)
    {
        Check.NotNullOrWhiteSpace(name, nameof(name), 30);

        Name = name;
        Order = order;
    }
}
