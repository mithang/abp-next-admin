using LINGYUN.Abp.WeChat.Work.Token.Models;
using System.Threading;
using System.Threading.Tasks;

namespace LINGYUN.Abp.WeChat.Work.ExternalContact.Token;
/// <summary>
/// Nhà cung cấp Token ứng dụng liên hệ khách hàng
/// </summary>
/// <remarks>
/// Một số API của WeChat doanh nghiệp cần sử dụng Token ứng dụng liên hệ khách hàng
/// </remarks>
public interface IWeChatWorkExternalContactTokenProvider
{
    /// <summary>
    /// Lấy Token ứng dụng liên hệ khách hàng
    /// </summary>
    /// <remarks>
    /// Tham khảo: https://developer.work.weixin.qq.com/document/path/91039
    /// </remarks>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<WeChatWorkToken> GetTokenAsync(CancellationToken cancellationToken = default);
}
