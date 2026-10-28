namespace LINGYUN.Abp.AspNetCore.Mvc.Client;

public class AbpAspNetCoreMvcClientCacheOptions
{
    /// <summary>
    /// Thời gian hết hạn bộ nhớ đệm của người dùng, đơn vị: giây
    /// Mặc định: 300
    /// </summary>
    public int UserCacheExpirationSeconds { get; set; } = 300;
    /// <summary>
    /// Thời gian hết hạn bộ nhớ đệm của người dùng ẩn danh, đơn vị: giây
    /// Mặc định: 300
    /// </summary>
    public int AnonymousCacheExpirationSeconds { get; set; } = 300;
}
