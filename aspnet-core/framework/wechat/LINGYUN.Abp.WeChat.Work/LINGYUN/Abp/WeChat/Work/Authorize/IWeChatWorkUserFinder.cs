using LINGYUN.Abp.WeChat.Work.Authorize.Models;
using System.Threading;
using System.Threading.Tasks;

namespace LINGYUN.Abp.WeChat.Work.Authorize;
/// <summary>
/// Giao diện truy vấn thông tin người dùng WeChat doanh nghiệp
/// </summary>
public interface IWeChatWorkUserFinder
{
    Task<WeChatWorkUserInfo> GetUserInfoAsync(
        string code,
        CancellationToken cancellationToken = default);

    Task<WeChatWorkCode2Session> GetCode2SessionAsync(
        string code,
        CancellationToken cancellationToken = default);

    Task<WeChatWorkUserDetail> GetUserDetailAsync(
        string userTicket,
        CancellationToken cancellationToken = default);
}
