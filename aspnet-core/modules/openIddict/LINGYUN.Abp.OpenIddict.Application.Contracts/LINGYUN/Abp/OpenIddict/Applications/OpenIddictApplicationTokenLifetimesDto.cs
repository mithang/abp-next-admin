using Volo.Abp.Validation;

namespace LINGYUN.Abp.OpenIddict.Applications;
public class OpenIddictApplicationTokenLifetimesDto
{
    /// <summary>
    /// Vòng đời token truy cập (s)
    /// </summary>
    [DynamicRange(
        typeof(OpenIddictApplicationTokenLifetimeConsts),
        typeof(long),
        nameof(OpenIddictApplicationTokenLifetimeConsts.MinAccessTokenValue),
        nameof(OpenIddictApplicationTokenLifetimeConsts.MaxAccessTokenValue))]
    public long? AccessToken { get; set; }
    /// <summary>
    /// Vòng đời mã ủy quyền (s)
    /// </summary>
    [DynamicRange(
        typeof(OpenIddictApplicationTokenLifetimeConsts),
        typeof(long),
        nameof(OpenIddictApplicationTokenLifetimeConsts.MinAuthorizationCodeValue),
        nameof(OpenIddictApplicationTokenLifetimeConsts.MaxAuthorizationCodeValue))]
    public long? AuthorizationCode { get; set; }
    /// <summary>
    /// Vòng đời mã thiết bị (s)
    /// </summary>
    [DynamicRange(
        typeof(OpenIddictApplicationTokenLifetimeConsts),
        typeof(long),
        nameof(OpenIddictApplicationTokenLifetimeConsts.MinDeviceCodeValue),
        nameof(OpenIddictApplicationTokenLifetimeConsts.MaxDeviceCodeValue))]
    public long? DeviceCode { get; set; }
    /// <summary>
    /// Vòng đời token danh tính (s)
    /// </summary>
    [DynamicRange(
        typeof(OpenIddictApplicationTokenLifetimeConsts),
        typeof(long),
        nameof(OpenIddictApplicationTokenLifetimeConsts.MinIdentityTokenValue),
        nameof(OpenIddictApplicationTokenLifetimeConsts.MaxIdentityTokenValue))]
    public long? IdentityToken { get; set; }
    /// <summary>
    /// Vòng đời token làm mới (s)
    /// </summary>
    [DynamicRange(
        typeof(OpenIddictApplicationTokenLifetimeConsts),
        typeof(long),
        nameof(OpenIddictApplicationTokenLifetimeConsts.MinRefreshTokenValue),
        nameof(OpenIddictApplicationTokenLifetimeConsts.MaxRefreshTokenValue))]
    public long? RefreshToken { get; set; }
    /// <summary>
    /// Vòng đời mã người dùng (s)
    /// </summary>
    [DynamicRange(
        typeof(OpenIddictApplicationTokenLifetimeConsts),
        typeof(long),
        nameof(OpenIddictApplicationTokenLifetimeConsts.MinUserCodeValue),
        nameof(OpenIddictApplicationTokenLifetimeConsts.MaxUserCodeValue))]
    public long? UserCode { get; set; }
}
