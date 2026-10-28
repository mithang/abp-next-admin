namespace LINGYUN.Abp.WeChat.Common.Security.Claims;

/// <summary>
/// Loại danh tính xác thực WeChat, có thể tự cấu hình giống như <see cref="Volo.Abp.Security.Claims.AbpClaimTypes"/>
/// <br />
/// See: <see cref="https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/Wechat_webpage_authorization.html"/>
/// </summary>
public class AbpWeChatClaimTypes
{
    /// <summary>
    /// Định danh duy nhất của người dùng
    /// </summary>
    public static string OpenId { get; set; } = "wx-openid"; // Có thể thay đổi
    /// <summary>
    /// Chỉ xuất hiện trường này sau khi người dùng liên kết tài khoản chính thức với tài khoản nền tảng mở WeChat.
    /// </summary>
    public static string UnionId { get; set; } = "wx-unionid"; //Có thể thay đổi
    /// <summary>
    /// Biệt danh của người dùng
    /// </summary>
    public static string NickName { get; set; } = "nickname";
    /// <summary>
    /// Giới tính của người dùng, giá trị 1 là nam, giá trị 2 là nữ, giá trị 0 là chưa xác định
    /// </summary>
    public static string Sex { get; set; } = "sex";
    /// <summary>
    /// Quốc gia, ví dụ Trung Quốc là CN
    /// </summary>
    public static string Country { get; set; } = "country";
    /// <summary>
    /// Tỉnh mà người dùng đã điền trong hồ sơ cá nhân
    /// </summary>
    public static string Province { get; set; } = "province";
    /// <summary>
    /// Thành phố mà người dùng thông thường đã điền trong hồ sơ cá nhân
    /// </summary>
    public static string City { get; set; } = "city";
    /// <summary>
    /// Ảnh đại diện của người dùng, giá trị cuối cùng biểu thị kích thước ảnh đại diện hình vuông (có thể chọn các giá trị 0, 46, 64, 96, 132; 0 biểu thị ảnh đại diện hình vuông 640*640), khi người dùng không có ảnh đại diện thì mục này để trống.
    /// Nếu người dùng đổi ảnh đại diện, URL ảnh đại diện cũ sẽ hết hiệu lực.
    /// </summary>
    public static string AvatarUrl { get; set; } = "avatar";
    /// <summary>
    /// Thông tin đặc quyền của người dùng, mảng json, ví dụ người dùng thẻ Wo của WeChat là (chinaunicom)
    /// </summary>
    public static string Privilege { get; set; } = "privilege";
}
