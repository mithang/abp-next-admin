namespace LINGYUN.Abp.Tencent.QQ;

public class AbpTencentQQOptions
{
    /// <summary>
    /// AppId đăng ký trên nền tảng liên kết QQ
    /// </summary>
    /// <remarks>
    /// see: https://wiki.connect.qq.com/%e5%87%86%e5%a4%87%e5%b7%a5%e4%bd%9c_oauth2-0
    /// </remarks>
    public string AppId { get; set; } = default!;
    /// <summary>
    /// AppKey đăng ký trên nền tảng liên kết QQ
    /// </summary>
    /// <remarks>
    /// see: https://wiki.connect.qq.com/%e5%87%86%e5%a4%87%e5%b7%a5%e4%bd%9c_oauth2-0
    /// </remarks>
    public string AppKey { get; set; } = default!;
    /// <summary>
    /// Có phải kiểu di động hay không
    /// </summary>
    public bool IsMobile { get; set; }
}
