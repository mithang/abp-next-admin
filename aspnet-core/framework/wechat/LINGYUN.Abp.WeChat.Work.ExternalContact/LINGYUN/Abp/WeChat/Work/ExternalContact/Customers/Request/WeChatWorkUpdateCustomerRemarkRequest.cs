using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using Volo.Abp;

namespace LINGYUN.Abp.WeChat.Work.ExternalContact.Customers.Request;
/// <summary>
/// Tham số yêu cầu sửa thông tin ghi chú của khách hàng
/// </summary>
/// <remarks>
/// Chi tiết xem tại: <see href="https://developer.work.weixin.qq.com/document/path/92115" />
/// </remarks>
public class WeChatWorkUpdateCustomerRemarkRequest : WeChatWorkRequest
{
    /// <summary>
    /// userid của thành viên doanh nghiệp
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
    /// Ghi chú của người dùng này đối với liên hệ bên ngoài, tối đa 20 ký tự
    /// </summary>
    [CanBeNull]
    [StringLength(20)]
    [JsonProperty("remark")]
    [JsonPropertyName("remark")]
    public string? Remark { get; }
    /// <summary>
    /// Mô tả của người dùng này đối với liên hệ bên ngoài, tối đa 150 ký tự
    /// </summary>
    [CanBeNull]
    [StringLength(150)]
    [JsonProperty("description")]
    [JsonPropertyName("description")]
    public string? Description { get; }
    /// <summary>
    /// Tên công ty sở hữu ghi chú của người dùng này đối với liên hệ bên ngoài, tối đa 20 ký tự
    /// </summary>
    [CanBeNull]
    [StringLength(20)]
    [JsonProperty("remark_company")]
    [JsonPropertyName("remark_company")]
    public string? RemarkCompany { get; }
    /// <summary>
    /// Số điện thoại di động trong ghi chú của người dùng này đối với liên hệ bên ngoài
    /// </summary>
    [CanBeNull]
    [JsonProperty("remark_mobiles")]
    [JsonPropertyName("remark_mobiles")]
    public List<string>? RemarkMobiles { get; }
    /// <summary>
    /// mediaid của ảnh ghi chú
    /// </summary>
    [CanBeNull]
    [JsonProperty("remark_pic_mediaid")]
    [JsonPropertyName("remark_pic_mediaid")]
    public string? RemarkPictureMediaId { get; }
    public WeChatWorkUpdateCustomerRemarkRequest(
        string userId, 
        string externalUserId, 
        string? remark = null, 
        string? description = null, 
        string? remarkCompany = null,
        List<string>? remarkMobiles = null, 
        string? remarkPictureMediaId = null)
    {
        UserId = Check.NotNullOrWhiteSpace(userId, nameof(userId));
        ExternalUserId = Check.NotNullOrWhiteSpace(externalUserId, nameof(externalUserId));
        Remark = Check.Length(remark, nameof(remark), 20);
        Description = Check.Length(description, nameof(description), 150);
        RemarkCompany = Check.Length(remarkCompany, nameof(remarkCompany), 20);
        RemarkMobiles = remarkMobiles;
        RemarkPictureMediaId = remarkPictureMediaId;
    }
}
