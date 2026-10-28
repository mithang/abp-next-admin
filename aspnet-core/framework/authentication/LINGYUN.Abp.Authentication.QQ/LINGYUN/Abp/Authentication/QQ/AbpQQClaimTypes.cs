namespace LINGYUN.Abp.Authentication.QQ;

/// <summary>
/// Loại claim của QQ Connect, có thể tự cấu hình như <see cref="Volo.Abp.Security.Claims.AbpClaimTypes"/>
/// <br />
/// See: <see cref="https://wiki.connect.qq.com/get_user_info"/>
/// </summary>
public class AbpQQClaimTypes
{
    /// <summary>
    /// Định danh duy nhất của người dùng
    /// </summary>
    public static string OpenId { get; set; } = "qq-openid"; // Có thể thay đổi
    /// <summary>
    /// Biệt danh của người dùng
    /// </summary>
    public static string NickName { get; set; } = "nickname";
    /// <summary>
    /// Giới tính. Nếu không lấy được thì mặc định trả về "Nam"
    /// </summary>
    public static string Gender { get; set; } = "gender";
    /// <summary>
    /// Ảnh đại diện của người dùng, lấy từ trường: figureurl_qq_1
    /// </summary>
    /// <remarks>
    /// Theo tài liệu QQ Connect, ảnh đại diện 40x40 chắc chắn tồn tại, chỉ lấy ảnh đại diện 40x40
    /// see: https://wiki.connect.qq.com/get_user_info
    /// </remarks>
    public static string AvatarUrl { get; set; } = "avatar";
}
