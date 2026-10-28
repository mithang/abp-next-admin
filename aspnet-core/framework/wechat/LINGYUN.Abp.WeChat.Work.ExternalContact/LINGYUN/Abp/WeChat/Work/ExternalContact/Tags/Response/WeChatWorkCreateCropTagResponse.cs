using JetBrains.Annotations;
using LINGYUN.Abp.WeChat.Work.ExternalContact.Tags.Models;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.ExternalContact.Tags.Response;
/// <summary>
/// Tham số phản hồi thêm thẻ khách hàng doanh nghiệp
/// </summary>
/// <remarks>
/// Xem chi tiết tại: <see href="https://developer.work.weixin.qq.com/document/path/92117#%E6%B7%BB%E5%8A%A0%E4%BC%81%E4%B8%9A%E5%AE%A2%E6%88%B7%E6%A0%87%E7%AD%BE" />
/// </remarks>
public class WeChatWorkCreateCropTagResponse : WeChatWorkResponse
{
    /// <summary>
    /// Nhóm thẻ
    /// </summary>
    [NotNull]
    [JsonProperty("tag_group")]
    [JsonPropertyName("tag_group")]
    public CropTagGroup TagGroup { get; set; } = default!;
}
