using LINGYUN.Abp.WeChat.Work.Token.Models;
using System.Threading;
using System.Threading.Tasks;

namespace LINGYUN.Abp.WeChat.Work.Token;
/// <summary>
/// Giao diện AccessToken của WeChat Doanh nghiệp
/// </summary>
public interface IWeChatWorkTokenProvider
{
    /// <summary>
    /// Lấy Token ứng dụng
    /// </summary>
    /// <remarks>
    /// Tham khảo: https://developer.work.weixin.qq.com/document/path/91039
    /// </remarks>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<WeChatWorkToken> GetTokenAsync(CancellationToken cancellationToken = default);
    /// <summary>
    /// Lấy Token ứng dụng
    /// </summary>
    /// <remarks>
    /// Tham khảo: https://developer.work.weixin.qq.com/document/path/91039
    /// </remarks>
    /// <param name="corpId">Định danh doanh nghiệp</param>
    /// <param name="agentId">Định danh ứng dụng</param>
    /// <param name="secret">Khóa bí mật ứng dụng</param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<WeChatWorkToken> GetTokenAsync(string corpId, string agentId, string secret, CancellationToken cancellationToken = default);
}
