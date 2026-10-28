using System;

namespace LINGYUN.Abp.Gdpr;
/// <summary>
/// Tùy chọn đồng ý AbpCookie
/// See: https://abp.io/docs/latest/modules/gdpr#abpcookieconsentoptions
/// </summary>
public class AbpCookieConsentOptions
{
    /// <summary>
    /// Bật hoặc tắt tính năng Cookie Consent
    /// </summary>
    public bool IsEnabled { get; set; }
    /// <summary>
    /// Định nghĩa URL trang chính sách Cookie.<br />
    /// Sau khi thiết lập, URL trang "Chính sách Cookie" sẽ tự động được thêm vào tuyên bố đồng ý Cookie.<br />
    /// Do đó, người dùng có thể kiểm tra chính sách cookie trước khi chấp nhận đồng ý cookie.<br />
    /// Bạn có thể đặt nó thành địa chỉ cục bộ hoặc URL đầy đủ, ví dụ:<br />
    /// /CookiePolicy<br />
    /// https://example.com/cookie-policy
    /// </summary>
    public string CookiePolicyUrl { get; set; }
    /// <summary>
    /// Định nghĩa URL trang chính sách quyền riêng tư.<br />
    /// Sau khi thiết lập, URL trang "Chính sách quyền riêng tư" sẽ tự động được thêm vào tuyên bố đồng ý Cookie.<br />
    /// Do đó, người dùng có thể xem chính sách quyền riêng tư trước khi chấp nhận đồng ý cookie.<br />
    /// Bạn có thể đặt nó thành địa chỉ cục bộ hoặc URL đầy đủ, ví dụ:<br />
    /// /PrivacyPolicy<br />
    /// https://example.com/privacy-policy
    /// </summary>
    public string PrivacyPolicyUrl { get; set; }
    /// <summary>
    /// Định nghĩa thời gian hết hạn của Cookie đồng ý Cookie.<br />
    /// Theo mặc định, khi chấp nhận đồng ý Cookie, nó sẽ đặt Cookie có hiệu lực trong 6 tháng.
    /// </summary>
    public TimeSpan Expiration { get; set; }
    public AbpCookieConsentOptions()
    {
        IsEnabled = true;
        CookiePolicyUrl = "/CookiePolicy";
        PrivacyPolicyUrl = "/PrivacyPolicy";
        Expiration = TimeSpan.FromDays(180);
    }
}
