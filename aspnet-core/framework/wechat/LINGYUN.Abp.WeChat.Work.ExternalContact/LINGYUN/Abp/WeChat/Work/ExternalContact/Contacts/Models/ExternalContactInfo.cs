using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.ExternalContact.Contacts.Models;
/// <summary>
/// Liên hệ bên ngoài
/// </summary>
public class ExternalContactInfo
{
    /// <summary>
    /// Có được thành viên đánh dấu là khách hàng hay không
    /// </summary>
    [NotNull]
    [JsonProperty("is_customer")]
    [JsonPropertyName("is_customer")]
    public bool IsCustomer { get; set; }
    /// <summary>
    /// ID tạm thời của liên hệ bên ngoài
    /// </summary>
    /// <remarks>
    /// 
    /// Id tạm thời của liên hệ bên ngoài là định danh duy nhất của một liên hệ bên ngoài, doanh nghiệp có thể dựa vào id này để thống kê khử trùng lặp liên hệ bên ngoài.<br />
    /// Tuy nhiên id tạm thời của liên hệ bên ngoài chỉ duy nhất trong một vòng truy vấn duyệt (từ truy vấn phân trang đầu tiên đến khi truy vấn phân trang cuối cùng hoàn tất);<br />
    /// Mỗi khi yêu cầu trang dữ liệu đầu tiên (cursor trống), id tạm thời của liên hệ bên ngoài và next_cursor trả về sẽ thay đổi.
    /// </remarks>
    [NotNull]
    [JsonProperty("tmp_openid")]
    [JsonPropertyName("tmp_openid")]
    public string TmpOpenId { get; set; } = default!;
    /// <summary>
    /// Externaluserid của liên hệ bên ngoài (chỉ trả về nếu là khách hàng)
    /// </summary>
    [CanBeNull]
    [JsonProperty("external_userid")]
    [JsonPropertyName("external_userid")]
    public string? ExternalUserId { get; set; }
    /// <summary>
    /// Biệt danh đã khử nhạy cảm của liên hệ bên ngoài (chỉ trả về nếu là liên hệ bên ngoài khác)
    /// </summary>
    [CanBeNull]
    [JsonProperty("name")]
    [JsonPropertyName("name")]
    public string? Name { get; set; }
    /// <summary>
    /// Userid của thành viên doanh nghiệp đã thêm liên hệ bên ngoài này hoặc của chủ nhóm trong nhóm chat chứa liên hệ bên ngoài
    /// </summary>
    [CanBeNull]
    [JsonProperty("follow_userid")]
    [JsonPropertyName("follow_userid")]
    public string? FollowUserId { get; set; }
    /// <summary>
    /// ID nhóm chat chứa liên hệ bên ngoài (chỉ trả về nếu nhóm chat được thành viên đánh dấu là nhóm khách hàng)
    /// </summary>
    [CanBeNull]
    [JsonProperty("chat_id")]
    [JsonPropertyName("chat_id")]
    public string? ChatId { get; set; }
    /// <summary>
    /// Tên nhóm chat chứa liên hệ bên ngoài (chỉ trả về nếu nhóm chat chưa được thành viên đánh dấu là nhóm khách hàng)
    /// </summary>
    [CanBeNull]
    [JsonProperty("chat_name")]
    [JsonPropertyName("chat_name")]
    public string? ChatName { get; set; }
    /// <summary>
    /// Thời gian liên hệ bên ngoài được thêm / vào nhóm lần đầu
    /// </summary>
    [NotNull]
    [JsonProperty("add_time")]
    [JsonPropertyName("add_time")]
    public long AddTime { get; set; }
}
