using JetBrains.Annotations;
using LINGYUN.Abp.WeChat.Work.ExternalContact.Attachments.Models;
using Volo.Abp;
using Volo.Abp.Content;

namespace LINGYUN.Abp.WeChat.Work.ExternalContact.Attachments.Request;
/// <summary>
/// Tham số yêu cầu tải lên tài nguyên tệp đính kèm
/// </summary>
/// <remarks>
/// Chi tiết xem tại: <see href="https://developer.work.weixin.qq.com/document/path/95098" />
/// </remarks>
public class WeChatWorkUploadAttachmentRequest : WeChatWorkRequest
{
    /// <summary>
    /// Loại tệp phương tiện
    /// </summary>
    [NotNull]
    public MediaType MediaType { get; }
    /// <summary>
    /// Loại tệp đính kèm
    /// </summary>
    [NotNull]
    public AttachmentType AttachmentType { get; }
    /// <summary>
    /// Tệp phương tiện
    /// </summary>
    [NotNull]
    public IRemoteStreamContent Content { get; }
    public WeChatWorkUploadAttachmentRequest(
        MediaType mediaType, 
        AttachmentType attachmentType,
        IRemoteStreamContent content)
    {
        Check.NotNull(content, nameof(content));

        MediaType = mediaType;
        AttachmentType = attachmentType;
        Content = content;
    }
}
