using JetBrains.Annotations;
using LINGYUN.Abp.WeChat.Work.Common.Members.Models;
using LINGYUN.Abp.WeChat.Work.Contacts.Members.Models;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.Contacts.Members.Response;
/// <summary>
/// Tham số phản hồi đọc thành viên
/// </summary>
/// <remarks>
/// Chi tiết xem: <see href="https://developer.work.weixin.qq.com/document/path/90196" />
/// </remarks>
public class WeChatWorkGetMemberResponse : WeChatWorkResponse
{
    /// <summary>
    /// Duy nhất toàn cục
    /// </summary>
    [NotNull]
    [JsonProperty("open_userid")]
    [JsonPropertyName("open_userid")]
    public string OpenUserId { get; set; } = default!;
    /// <summary>
    /// UserID của thành viên
    /// </summary>
    [NotNull]
    [JsonProperty("userid")]
    [JsonPropertyName("userid")]
    public string UserId { get; set; } = default!;
    /// <summary>
    /// Tên thành viên
    /// </summary>
    [NotNull]
    [JsonProperty("name")]
    [JsonPropertyName("name")]
    public string Name { get; set; } = default!;
    /// <summary>
    /// Số điện thoại di động
    /// </summary>
    [CanBeNull]
    [JsonProperty("mobile")]
    [JsonPropertyName("mobile")]
    public string? Mobile { get; set; }
    /// <summary>
    /// Danh sách id phòng ban mà thành viên thuộc về
    /// </summary>
    [NotNull]
    [JsonProperty("department")]
    [JsonPropertyName("department")]
    public int[] Department { get; set; } = default!;
    /// <summary>
    /// Phòng ban chính
    /// </summary>
    [CanBeNull]
    [JsonProperty("main_department")]
    [JsonPropertyName("main_department")]
    public int? MainDepartment { get; set; }
    /// <summary>
    /// Giá trị sắp xếp trong phòng ban, mặc định là 0. Số lượng phải khớp với department, giá trị càng lớn thì xếp càng trước. Phạm vi giá trị là [0, 2^32)
    /// </summary>
    [NotNull]
    [JsonProperty("order")]
    [JsonPropertyName("order")]
    public int[]? Order { get; set; }
    /// <summary>
    /// Mã QR cá nhân của nhân viên
    /// </summary>
    [CanBeNull]
    [JsonProperty("qr_code")]
    [JsonPropertyName("qr_code")]
    public string? QrCode { get; set; }
    /// <summary>
    /// Thông tin chức vụ
    /// </summary>
    [CanBeNull]
    [JsonProperty("position")]
    [JsonPropertyName("position")]
    public string? Position { get; set; }
    /// <summary>
    /// Giới tính
    /// </summary>
    [CanBeNull]
    [JsonProperty("gender")]
    [JsonPropertyName("gender")]
    public Gender? Gender { get; set; }
    /// <summary>
    /// Email
    /// </summary>
    [CanBeNull]
    [JsonProperty("email")]
    [JsonPropertyName("email")]
    public string? Email { get; set; }
    /// <summary>
    /// Email doanh nghiệp
    /// </summary>
    [CanBeNull]
    [JsonProperty("biz_mail")]
    [JsonPropertyName("biz_mail")]
    public string? BizEmail { get; set; }
    /// <summary>
    /// Cho biết trong phòng ban đang thuộc về có phải là người phụ trách phòng ban hay không, số lượng khớp với department
    /// </summary>
    [CanBeNull]
    [JsonProperty("is_leader_in_dept")]
    [JsonPropertyName("is_leader_in_dept")]
    public int[]? IsLeaderInDept { get; set; }
    /// <summary>
    /// UserID của cấp trên trực tiếp, trả về danh sách cấp trên trực tiếp trong phạm vi hiển thị của ứng dụng, tối đa có 1 cấp trên trực tiếp
    /// </summary>
    [CanBeNull]
    [JsonProperty("direct_leader")]
    [JsonPropertyName("direct_leader")]
    public string[]? DirectLeader { get; set; }
    /// <summary>
    /// URL ảnh đại diện
    /// </summary>
    [CanBeNull]
    [JsonProperty("avatar")]
    [JsonPropertyName("avatar")]
    public string? Avatar { get; set; }
    /// <summary>
    /// URL ảnh thu nhỏ của ảnh đại diện
    /// </summary>
    [CanBeNull]
    [JsonProperty("thumb_avatar")]
    [JsonPropertyName("thumb_avatar")]
    public string? ThumbAvatar { get; set; }
    /// <summary>
    /// Điện thoại bàn
    /// </summary>
    [CanBeNull]
    [JsonProperty("telephone")]
    [JsonPropertyName("telephone")]
    public string? TelePhone { get; set; }
    /// <summary>
    /// Bí danh
    /// </summary>
    [CanBeNull]
    [JsonProperty("alias")]
    [JsonPropertyName("alias")]
    public string? Alias { get; set; }
    /// <summary>
    /// Địa chỉ
    /// </summary>
    [CanBeNull]
    [JsonProperty("address")]
    [JsonPropertyName("address")]
    public string? Address { get; set; }
    /// <summary>
    /// Trạng thái kích hoạt
    /// </summary>
    [NotNull]
    [JsonProperty("status")]
    [JsonPropertyName("status")]
    public MemberStatus Status { get; set; }
    /// <summary>
    /// Thuộc tính mở rộng
    /// </summary>
    [CanBeNull]
    [JsonProperty("extattr")]
    [JsonPropertyName("extattr")]
    [Newtonsoft.Json.JsonConverter(typeof(Newtonsoft.Json.MemberExternalAttributeConverter))]
    [System.Text.Json.Serialization.JsonConverter(typeof(System.Text.Json.Serialization.MemberExternalAttributeConverter))]
    public MemberExternalAttribute? ExternalAttribute { get; set; }
    /// <summary>
    /// Chức vụ đối ngoại, nếu đã đặt giá trị này thì dùng nó làm chức vụ hiển thị ra bên ngoài, nếu không thì hiển thị bằng position.
    /// </summary>
    [CanBeNull]
    [JsonProperty("external_position")]
    [JsonPropertyName("external_position")]
    public string? ExternalPosition { get; set; }
}
