using LINGYUN.Abp.WeChat.Work.Token.Models;
using System.Threading;
using System.Threading.Tasks;

namespace LINGYUN.Abp.WeChat.Work.Contacts.Token;
/// <summary>
/// Nhà cung cấp Token ứng dụng danh bạ
/// </summary>
/// <remarks>
/// Một số API của WeChat doanh nghiệp cần sử dụng Token ứng dụng danh bạ
/// </remarks>
public interface IWeChatWorkContactTokenProvider
{
    /// <summary>
    /// Lấy Token ứng dụng danh bạ
    /// </summary>
    /// <remarks>
    /// Tham khảo: https://developer.work.weixin.qq.com/document/path/91039
    /// </remarks>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<WeChatWorkToken> GetTokenAsync(CancellationToken cancellationToken = default);
}
