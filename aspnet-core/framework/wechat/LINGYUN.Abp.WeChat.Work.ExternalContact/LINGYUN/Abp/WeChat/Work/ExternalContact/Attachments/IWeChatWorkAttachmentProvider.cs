using LINGYUN.Abp.WeChat.Work.ExternalContact.Attachments.Request;
using LINGYUN.Abp.WeChat.Work.ExternalContact.Attachments.Response;
using System.Threading;
using System.Threading.Tasks;

namespace LINGYUN.Abp.WeChat.Work.ExternalContact.Attachments;
/// <summary>
/// API tài nguyên tệp đính kèm
/// </summary>
public interface IWeChatWorkAttachmentProvider
{
    /// <summary>
    /// Tải lên tài nguyên tệp đính kèm
    /// </summary>
    /// <remarks>
    /// Xem chi tiết tại: <see href="https://developer.work.weixin.qq.com/document/path/90253"/>
    /// </remarks>
    /// <param name="request">Tham số yêu cầu</param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<WeChatWorkUploadAttachmentResponse> UploadAsync(
        WeChatWorkUploadAttachmentRequest request,
        CancellationToken cancellationToken = default);
}
