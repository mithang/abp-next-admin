using JetBrains.Annotations;
using LINGYUN.Abp.WeChat.Work.ExternalContact.Tags.Models;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.ExternalContact.Tags.Response;
/// <summary>
/// Tham số phản hồi lấy thẻ khách hàng doanh nghiệp thuộc nhóm quy tắc chỉ định
/// </summary>
/// <remarks>
/// Xem chi tiết tại: https://developer.work.weixin.qq.com/document/path/94882#%E8%8E%B7%E5%8F%96%E6%8C%87%E5%AE%9A%E8%A7%84%E5%88%99%E7%BB%84%E4%B8%8B%E7%9A%84%E4%BC%81%E4%B8%9A%E5%AE%A2%E6%88%B7%E6%A0%87%E7%AD%BE
/// </remarks>
public class WeChatWorkGetStrategyTagListResponse : WeChatWorkResponse
{
    /// <summary>
    /// Danh sách nhóm thẻ
    /// </summary>
    [NotNull]
    [JsonProperty("tag_group")]
    [JsonPropertyName("tag_group")]
    public StrategyTagGroup[] TagGroup { get; set; } = default!;
}
