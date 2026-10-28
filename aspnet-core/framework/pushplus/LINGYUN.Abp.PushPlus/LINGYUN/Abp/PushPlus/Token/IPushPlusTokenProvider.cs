using System.Threading;
using System.Threading.Tasks;

namespace LINGYUN.Abp.PushPlus.Token;
/// <summary>
/// Lấy AccessKey
/// </summary>
public interface IPushPlusTokenProvider
{
    /// <summary>
    ///  Lấy Token khả dụng toàn cục
    /// </summary>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<PushPlusToken> GetTokenAsync(CancellationToken cancellationToken = default);
}
