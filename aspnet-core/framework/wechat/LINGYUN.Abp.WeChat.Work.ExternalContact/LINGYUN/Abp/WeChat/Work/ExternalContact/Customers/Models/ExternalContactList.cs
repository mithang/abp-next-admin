using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.ExternalContact.Customers.Models;
/// <summary>
/// Danh sách liên hệ bên ngoài
/// </summary>
public class ExternalContactList
{
    /// <summary>
    /// Thông tin cơ bản của khách hàng
    /// </summary>
    [NotNull]
    [JsonProperty("external_contact")]
    [JsonPropertyName("external_contact")]
    public ExternalContactInfo ExternalContact { get; set; } = default!;
    /// <summary>
    /// Thông tin theo dõi khách hàng của thành viên doanh nghiệp
    /// </summary>
    [NotNull]
    [JsonProperty("follow_info")]
    [JsonPropertyName("follow_info")]
    public FollowUser FollowUser { get; set; } = default!;
}
