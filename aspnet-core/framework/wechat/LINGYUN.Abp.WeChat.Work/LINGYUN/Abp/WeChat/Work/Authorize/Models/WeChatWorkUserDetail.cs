using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.Authorize.Models;
/// <summary>
/// Chi tiết người dùng WeChat Work
/// </summary>
public class WeChatWorkUserDetail
{
    /// <summary>
    /// UserID của thành viên
    /// </summary>
    [NotNull]
    [JsonProperty("userid")]
    [JsonPropertyName("userid")]
    public string UserId { get; set; } = default!;
    /// <summary>
    /// Giới tính.
    /// 0 nghĩa là chưa xác định,
    /// 1 nghĩa là nam,
    /// 2 nghĩa là nữ.
    /// Chỉ trả về giá trị thật khi người dùng đồng ý ủy quyền snsapi_privateinfo, nếu không sẽ trả về 0
    /// </summary>
    [CanBeNull]
    [JsonProperty("gender")]
    [JsonPropertyName("gender")]
    public WeChatWorkGender Gender { get; set; }
    /// <summary>
    /// URL ảnh đại diện.
    /// Chỉ trả về ảnh đại diện thật khi người dùng đồng ý ủy quyền snsapi_privateinfo, nếu không sẽ trả về ảnh đại diện mặc định
    /// </summary>
    [CanBeNull]
    [JsonProperty("avatar")]
    [JsonPropertyName("avatar")]
    public string? Avatar { get; set; }
    /// <summary>
    /// Mã QR cá nhân của nhân viên (quét để thêm làm liên hệ bên ngoài)
    /// Chỉ trả về khi người dùng đồng ý ủy quyền snsapi_privateinfo
    /// </summary>
    [CanBeNull]
    [JsonProperty("qr_code")]
    [JsonPropertyName("qr_code")]
    public string? QrCode { get; set; }
    /// <summary>
    /// Số điện thoại di động
    /// Chỉ trả về khi người dùng đồng ý ủy quyền snsapi_privateinfo, ứng dụng bên thứ ba không thể lấy được
    /// </summary>
    [CanBeNull]
    [JsonProperty("mobile")]
    [JsonPropertyName("mobile")]
    public string? Mobile { get; set; }
    /// <summary>
    /// Email
    /// Chỉ trả về khi người dùng đồng ý ủy quyền snsapi_privateinfo, ứng dụng bên thứ ba không thể lấy được
    /// </summary>
    [CanBeNull]
    [JsonProperty("email")]
    [JsonPropertyName("email")]
    public string? Email { get; set; }
    /// <summary>
    /// Email doanh nghiệp
    /// Chỉ trả về khi người dùng đồng ý ủy quyền snsapi_privateinfo, ứng dụng bên thứ ba không thể lấy được
    /// </summary>
    [CanBeNull]
    [JsonProperty("biz_mail")]
    [JsonPropertyName("biz_mail")]
    public string? WorkEmail { get; set; }
    /// <summary>
    /// Địa chỉ
    /// Chỉ trả về khi người dùng đồng ý ủy quyền snsapi_privateinfo, ứng dụng bên thứ ba không thể lấy được
    /// </summary>
    [CanBeNull]
    [JsonProperty("address")]
    [JsonPropertyName("address")]
    public string? Address { get; set; }
}
