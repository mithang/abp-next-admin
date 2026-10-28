namespace LINGYUN.Abp.OpenApi;

public class AppDescriptor
{
    /// <summary>
    /// Tên ứng dụng
    /// </summary>
    public string AppName { get; set; } = default!;
    /// <summary>
    /// Mã định danh ứng dụng
    /// </summary>
    public string AppKey { get; set; } = default!;
    /// <summary>
    /// Khóa bí mật ứng dụng
    /// </summary>
    public string AppSecret { get; set; } = default!;
    /// <summary>
    /// Token ứng dụng
    /// </summary>
    public string? AppToken { get; set; }
    /// <summary>
    /// Thời gian hiệu lực của chữ ký
    /// Đơn vị: s
    /// </summary>
    public int? SignLifetime { get; set; }

    public AppDescriptor() { }
    public AppDescriptor(
        string appName,
        string appKey,
        string appSecret,
        string? appToken = null,
        int? signLifeTime = null)
    {
        AppName = appName;
        AppKey = appKey;
        AppSecret = appSecret;
        AppToken = appToken;
        SignLifetime = signLifeTime;
    }
}
