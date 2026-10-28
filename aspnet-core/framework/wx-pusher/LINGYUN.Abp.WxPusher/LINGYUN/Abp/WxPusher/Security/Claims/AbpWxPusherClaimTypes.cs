namespace LINGYUN.Abp.WxPusher.Security.Claims;

public static class AbpWxPusherClaimTypes
{
    /// <summary>
    /// Định danh duy nhất của người dùng
    /// </summary>
    public static string Uid { get; set; } = "wxp-uid";
    /// <summary>
    /// Topic mà người dùng đăng ký
    /// </summary>
    public static string Topic { get; set; } = "wxp-topic";
}
