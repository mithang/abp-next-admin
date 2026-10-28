using System;

namespace LINGYUN.Abp.OpenApi;

public class AbpOpenApiOptions
{
    /// <summary>
    /// Bật kiểm tra chữ ký Api
    /// </summary>
    /// <remarks>
    /// Mặc định: true
    /// </remarks>
    public bool IsEnabled { get; set; }
    /// <summary>
    /// Thời gian hết hạn số ngẫu nhiên của yêu cầu
    /// </summary>
    /// <remarks>
    /// Mặc định: 10 phút
    /// </remarks>
    public TimeSpan RequestNonceExpireIn { get; set; }

    public AbpOpenApiOptions()
    {
        IsEnabled = true;

        RequestNonceExpireIn = TimeSpan.FromMinutes(10);
    }
}
