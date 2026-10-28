using System.Threading;
using System.Threading.Tasks;

namespace LINGYUN.Abp.Account.Security;
/// <summary>
/// Giao diện gửi mã bảo mật SMS
/// </summary>
public interface IAccountSmsSecurityCodeSender
{
    /// <summary>
    /// Gửi mã xác minh SMS
    /// </summary>
    /// <param name="phone">Số điện thoại di động</param>
    /// <param name="code">Mã xác minh SMS</param>
    /// <param name="templateCode">Mẫu xác minh SMS</param>
    /// <param name="cancellation"></param>
    /// <returns></returns>
    Task SendAsync(
        string phone,
        string code,
        string templateCode,
        CancellationToken cancellation = default);
}
