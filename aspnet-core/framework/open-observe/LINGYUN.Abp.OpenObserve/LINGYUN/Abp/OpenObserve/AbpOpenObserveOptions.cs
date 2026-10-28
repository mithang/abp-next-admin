using LINGYUN.Abp.OpenObserve.Models;
using System;
using System.Net.Http.Headers;
using System.Text;

namespace LINGYUN.Abp.OpenObserve;

public class AbpOpenObserveOptions
{
    /// <summary>
    /// Địa chỉ dịch vụ
    /// </summary>
    /// <remarks>
    /// Mặc định: http://localhost:5080
    /// </remarks>
    public string Endpoint { get; set; }
    /// <summary>
    /// Tên tổ chức mặc định
    /// </summary>
    /// <remarks>
    /// Mặc định: default, được dùng khi gọi giao diện mà không chỉ định rõ tổ chức
    /// </remarks>
    public string Organization { get; set; }
    /// <summary>
    /// Tên người dùng
    /// </summary>
    public string? UserName { get; set; }
    /// <summary>
    /// Mật khẩu
    /// </summary>
    public string? Password { get; set; }
    /// <summary>
    /// Thông tin đầy đủ của header ủy quyền
    /// </summary>
    /// <remarks>
    /// Ví dụ: "Basic YWRtaW5AYWJwLmlvOnd3MVo1TCU2"
    /// Sau khi cấu hình sẽ được ưu tiên hơn UserName/Password
    /// </remarks>
    public string? AccessToken { get; set; }
    /// <summary>
    /// Thời gian chờ yêu cầu (giây)
    /// </summary>
    /// <remarks>
    /// Mặc định: 600
    /// </remarks>
    public int TimeoutSeconds { get; set; }

    public AbpOpenObserveOptions()
    {
        Endpoint = OpenObserveConstants.DefaultEndpoint;
        Organization = OpenObserveConstants.DefaultOrganization;
        TimeoutSeconds = OpenObserveConstants.DefaultTimeoutSeconds;
    }

    /// <summary>
    /// Tạo header ủy quyền
    /// </summary>
    /// <returns>Trả về null khi chưa cấu hình thông tin xác thực</returns>
    public virtual AuthenticationHeaderValue? CreateAuthorizationHeader()
    {
        if (!AccessToken.IsNullOrWhiteSpace() &&
            AuthenticationHeaderValue.TryParse(AccessToken, out var authenticationHeader))
        {
            return authenticationHeader;
        }

        if (!UserName.IsNullOrWhiteSpace() && !Password.IsNullOrWhiteSpace())
        {
            var token = Convert.ToBase64String(Encoding.UTF8.GetBytes($"{UserName}:{Password}"));

            return new AuthenticationHeaderValue("Basic", token);
        }

        return null;
    }
}
