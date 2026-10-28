using System;

namespace LINGYUN.Abp.Identity;

/// <summary>
/// Bộ nhớ đệm xác thực mã thông báo bảo mật
/// </summary>
public class SecurityTokenCacheItem
{
    /// <summary>
    /// Token dùng để xác thực
    /// </summary>
    public string Token { get; set; } = default!;
    /// <summary>
    /// Id người dùng dùng để xác thực
    /// </summary>
    public Guid UserId { get; set; }
    /// <summary>
    /// Mã thông báo bảo mật dùng để xác thực
    /// </summary>
    public string SecurityToken { get; set; } = default!;

    public SecurityTokenCacheItem()
    {

    }

    public SecurityTokenCacheItem(string token, Guid userId, string securityToken)
    {
        Token = token;
        UserId = userId;
        SecurityToken = securityToken;
    }

    /// <summary>
    /// Tạo khóa truy vấn
    /// </summary>
    /// <param name="phoneNumber">Số điện thoại di động</param>
    /// <param name="purpose">Mục đích sử dụng mã thông báo bảo mật</param>
    /// <returns></returns>
    public static string CalculateSmsCacheKey(string phoneNumber, string purpose)
    {
        return "Totp:" + purpose + ";p:" + phoneNumber;
    }

    /// <summary>
    /// Tạo khóa truy vấn
    /// </summary>
    /// <param name="email">Địa chỉ email</param>
    /// <param name="purpose">Mục đích sử dụng mã thông báo bảo mật</param>
    /// <returns></returns>
    public static string CalculateEmailCacheKey(string email, string purpose)
    {
        return "Totp:" + purpose + ";e:" + email;
    }
}
