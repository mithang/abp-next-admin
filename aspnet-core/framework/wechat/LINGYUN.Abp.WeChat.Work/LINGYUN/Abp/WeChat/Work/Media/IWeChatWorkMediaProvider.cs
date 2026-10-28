using LINGYUN.Abp.WeChat.Work.Media.Models;
using System.Threading;
using System.Threading.Tasks;
using Volo.Abp.Content;

namespace LINGYUN.Abp.WeChat.Work.Media;
/// <summary>
/// Giao diện quản lý tài liệu
/// </summary>
/// <remarks>
/// API: <see href="https://developer.work.weixin.qq.com/document/path/91054"/>
/// </remarks>
public interface IWeChatWorkMediaProvider
{
    /// <summary>
    /// Tải lên tài liệu tạm thời
    /// </summary>
    /// <remarks>
    /// API: <see href="https://developer.work.weixin.qq.com/document/path/90253"/>
    /// </remarks>
    /// <param name="type">Loại tệp phương tiện</param>
    /// <param name="media">Tệp chờ tải lên</param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<WeChatWorkMediaResponse> UploadAsync(
        string type,
        IRemoteStreamContent media,
        CancellationToken cancellationToken = default);
    /// <summary>
    /// Lấy tài liệu tạm thời
    /// </summary>
    /// <remarks>
    /// API: <see href="https://developer.work.weixin.qq.com/document/path/90254"/>
    /// </remarks>
    /// <param name="mediaId">Id tệp phương tiện</param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    /// 
    Task<IRemoteStreamContent> GetAsync(
        string mediaId,
        CancellationToken cancellationToken = default);
    /// <summary>
    /// Tải lên hình ảnh
    /// </summary>
    /// <remarks>
    /// API: <see href="https://developer.work.weixin.qq.com/document/path/90256"/>
    /// </remarks>
    /// <param name="image">Hình ảnh chờ tải lên</param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<WeChatWorkImageResponse> UploadImageAsync(
        IRemoteStreamContent image,
        CancellationToken cancellationToken = default);
}
