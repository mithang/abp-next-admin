using LINGYUN.Abp.WeChat.Work.OA.Schedules.Request;
using LINGYUN.Abp.WeChat.Work.OA.Schedules.Response;
using System.Threading;
using System.Threading.Tasks;

namespace LINGYUN.Abp.WeChat.Work.OA.Schedules;
/// <summary>
/// Quản lý lịch
/// </summary>
public interface IWeChatWorkCalendarProvider
{
    /// <summary>
    /// Tạo lịch
    /// </summary>
    /// <remarks>
    /// Xem chi tiết tại：<see href="https://developer.work.weixin.qq.com/document/path/93647" />
    /// </remarks>
    /// <param name="request">Tham số yêu cầu</param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<WeChatWorkCreateCalendarResponse> CreateCalendarAsync(
        WeChatWorkCreateCalendarRequest request,
        CancellationToken cancellationToken = default);
    /// <summary>
    /// Cập nhật lịch
    /// </summary>
    /// <remarks>
    /// Xem chi tiết tại：<see href="https://developer.work.weixin.qq.com/document/path/97716" />
    /// </remarks>
    /// <param name="request">Tham số yêu cầu</param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<WeChatWorkUpdateCalendarResponse> UpdateCalendarAsync(
        WeChatWorkUpdateCalendarRequest request,
        CancellationToken cancellationToken = default);
    /// <summary>
    /// Lấy chi tiết lịch
    /// </summary>
    /// <remarks>
    /// Xem chi tiết tại：<see href="https://developer.work.weixin.qq.com/document/path/97717" />
    /// </remarks>
    /// <param name="request">Tham số yêu cầu</param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<WeChatWorkGetCalendarListResponse> GetCalendarListAsync(
        WeChatWorkGetCalendarListRequest request,
        CancellationToken cancellationToken = default);
    /// <summary>
    /// Xóa lịch
    /// </summary>
    /// <remarks>
    /// Xem chi tiết tại：<see href="https://developer.work.weixin.qq.com/document/path/97718" />
    /// </remarks>
    /// <param name="request">Tham số yêu cầu</param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<WeChatWorkResponse> DeleteCalendarAsync(
        WeChatWorkDeleteCalendarRequest request,
        CancellationToken cancellationToken = default);
}
