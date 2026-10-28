using System;

namespace LINGYUN.Abp.Identity.Session;

[Serializable]
public class IdentitySessionCacheItem
{
    private const string CacheKeyFormat = "s:{0}";
    /// <summary>
    /// Thiết bị đăng nhập
    /// </summary>
    public string Device { get; set; } = default!;
    /// <summary>
    /// Mô tả thiết bị
    /// </summary>
    public string? DeviceInfo { get; set; }
    /// <summary>
    /// Id người dùng
    /// </summary>
    public Guid UserId { get; set; }
    /// <summary>
    /// Id phiên
    /// </summary>
    public string SessionId { get; set; } = default!;
    /// <summary>
    /// Id máy khách
    /// </summary>
    public string? ClientId { get; set; }
    /// <summary>
    /// Địa chỉ IP
    /// </summary>
    public string? IpAddresses { get; set; }
    /// <summary>
    /// Vùng thuộc IP
    /// </summary>
    public string? IpRegion { get; set; }
    /// <summary>
    /// Thời gian đăng nhập
    /// </summary>
    public DateTime SignedIn { get; set; }
    /// <summary>
    /// Thời gian truy cập lần cuối
    /// </summary>
    public DateTime? LastAccessed { get; set; }
    /// <summary>
    /// Thời gian hết hạn (ms)
    /// </summary>
    public double? ExpiraIn { get; set; }

    public IdentitySessionCacheItem()
    {
    }

    public IdentitySessionCacheItem(
        string device,
        string? deviceInfo,
        Guid userId,
        string sessionId,
        string? clientId,
        string? ipAddresses,
        DateTime signedIn,
        DateTime? lastAccessed = null,
        string? ipRegion = null,
        double? expiraIn = null)
    {
        Device = device;
        DeviceInfo = deviceInfo;
        UserId = userId;
        SessionId = sessionId;
        ClientId = clientId;
        IpAddresses = ipAddresses;
        IpRegion = ipRegion;
        SignedIn = signedIn;
        LastAccessed = lastAccessed;
        ExpiraIn = expiraIn;
    }

    public static string CalculateCacheKey(string sessionId)
    {
        return string.Format(CacheKeyFormat, sessionId);
    }
}