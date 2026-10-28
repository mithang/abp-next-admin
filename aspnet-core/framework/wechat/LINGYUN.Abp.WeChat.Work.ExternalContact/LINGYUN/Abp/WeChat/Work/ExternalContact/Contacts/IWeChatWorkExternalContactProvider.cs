using LINGYUN.Abp.WeChat.Work.ExternalContact.Contacts.Request;
using LINGYUN.Abp.WeChat.Work.ExternalContact.Contacts.Response;
using System.Threading;
using System.Threading.Tasks;

namespace LINGYUN.Abp.WeChat.Work.ExternalContact.Contacts;
/// <summary>
/// API liên hệ bên ngoài
/// </summary>
public interface IWeChatWorkExternalContactProvider
{
    /// <summary>
    /// Lấy liên hệ bên ngoài đã phục vụ
    /// </summary>
    /// <remarks>
    /// Xem chi tiết tại: <see href="https://developer.work.weixin.qq.com/document/path/99434" />
    /// </remarks>
    /// <param name="request">Tham số yêu cầu</param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<WeChatWorkGetExternalContactListResponse> GetExternalContactListAsync(
        WeChatWorkGetExternalContactListRequest request,
        CancellationToken cancellationToken = default);
}
