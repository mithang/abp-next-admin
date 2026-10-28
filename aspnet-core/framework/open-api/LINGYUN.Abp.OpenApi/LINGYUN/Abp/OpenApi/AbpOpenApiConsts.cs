namespace LINGYUN.Abp.OpenApi;

public static class AbpOpenApiConsts
{
    public const string SecurityChecking = "_AbpOpenApiSecurityChecking";

    public const string HEADER_APP_KEY = "X-API-APPKEY";
    public const string HEADER_SIGNATURE = "X-API-SIGN";
    public const string HEADER_NONCE = "X-API-NONCE";
    public const string HEADER_TIMESTAMP = "X-API-TIMESTAMP";

    public const string KeyPrefix = "AbpOpenApi";
    /// <summary>
    /// Định danh ứng dụng không hợp lệ {AppKey}.
    /// </summary>
    public const string InvalidAccessWithAppKey = KeyPrefix + ":9100";
    /// <summary>
    /// Không mang theo định danh ứng dụng (appKey).
    /// </summary>
    public const string InvalidAccessWithAppKeyNotFound = KeyPrefix + ":9101";

    /// <summary>
    /// Chữ ký sign không hợp lệ.
    /// </summary>
    public const string InvalidAccessWithSign = KeyPrefix + ":9110";
    /// <summary>
    /// Không mang theo chữ ký (sign).
    /// </summary>
    public const string InvalidAccessWithSignNotFound = KeyPrefix + ":9111";

    /// <summary>
    /// Yêu cầu đã hết thời gian chờ hoặc phiên đã hết hạn.
    /// </summary>
    public const string InvalidAccessWithTimestamp = KeyPrefix + ":9210";
    /// <summary>
    /// Không mang theo định danh dấu thời gian.
    /// </summary>
    public const string InvalidAccessWithTimestampNotFound = KeyPrefix + ":9211";

    /// <summary>
    /// Yêu cầu được gửi lặp lại.
    /// </summary>
    public const string InvalidAccessWithNonceRepeated = KeyPrefix + ":9220";
    /// <summary>
    /// Không mang theo số ngẫu nhiên.
    /// </summary>
    public const string InvalidAccessWithNonceNotFound = KeyPrefix + ":9221";

    /// <summary>
    /// Máy khách không nằm trong phạm vi cho phép.
    /// </summary>
    public const string InvalidAccessWithClientId = KeyPrefix + ":9300";
    /// <summary>
    /// IP máy khách không nằm trong phạm vi cho phép.
    /// </summary>
    public const string InvalidAccessWithIpAddress = KeyPrefix + ":9400";
}
