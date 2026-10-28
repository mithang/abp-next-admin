using LINGYUN.Abp.WeChat.Official.Account.Models;
using System.IO;
using System.Threading;
using System.Threading.Tasks;

namespace LINGYUN.Abp.WeChat.Official.Account;
/// <summary>
/// Giao diện tạo mã QR có tham số
/// </summary>
/// <remarks>
/// Chi tiết xem: https://developers.weixin.qq.com/doc/offiaccount/Account_Management/Generating_a_Parametric_QR_Code.html
/// </remarks>
public interface IParametricQrCodeGenerator
{
    /// <summary>
    /// Tạo ticket mã QR
    /// </summary>
    /// <param name="model"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<TicketModel> CreateTicketAsync(CreateTicketModel model, CancellationToken cancellationToken = default);
    /// <summary>
    /// Đổi ticket lấy mã QR
    /// </summary>
    /// <param name="ticket"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<Stream> ShowQrCodeAsync(string ticket, CancellationToken cancellationToken = default);
}
