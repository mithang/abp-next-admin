using LINGYUN.Abp.WeChat.Work.Security.Models;
using System.Threading;
using System.Threading.Tasks;

namespace LINGYUN.Abp.WeChat.Work.Security;
public interface IWeChatWorkServerProvider
{
    /// <summary>
    /// Lấy thông tin IP tên miền WeChat Work
    /// </summary>
    /// <remarks>
    /// Tham khảo：https://developer.work.weixin.qq.com/document/path/100079
    /// </remarks>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<WeChatServerDomainResponse> GetWeChatServerAsync(CancellationToken cancellationToken = default);
}
