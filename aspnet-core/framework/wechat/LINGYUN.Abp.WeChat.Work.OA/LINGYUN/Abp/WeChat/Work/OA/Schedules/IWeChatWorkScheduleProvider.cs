using LINGYUN.Abp.WeChat.Work.OA.Schedules.Request;
using LINGYUN.Abp.WeChat.Work.OA.Schedules.Response;
using System.Threading;
using System.Threading.Tasks;

namespace LINGYUN.Abp.WeChat.Work.OA.Schedules;
/// <summary>
/// Quản lý lịch trình
/// </summary>
public interface IWeChatWorkScheduleProvider
{
    /// <summary>
    /// Tạo lịch trình
    /// </summary>
    /// <remarks>
    /// Xem chi tiết tại:<see href="https://developer.work.weixin.qq.com/document/path/93648" />
    /// </remarks>
    /// <param name="request">Tham số yêu cầu</param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<WeChatWorkCreateScheduleResponse> CreateScheduleAsync(
        WeChatWorkCreateScheduleRequest request,
        CancellationToken cancellationToken = default);
    /// <summary>
    /// Cập nhật lịch trình
    /// </summary>
    /// <remarks>
    /// Xem chi tiết tại:<see href="https://developer.work.weixin.qq.com/document/path/97720" />
    /// </remarks>
    /// <param name="request">Tham số yêu cầu</param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<WeChatWorkUpdateScheduleResponse> UpdateScheduleAsync(
        WeChatWorkUpdateScheduleRequest request,
        CancellationToken cancellationToken = default);
    /// <summary>
    /// Thêm người tham gia lịch trình
    /// </summary>
    /// <remarks>
    /// Xem chi tiết tại:<see href="https://developer.work.weixin.qq.com/document/path/97721" />
    /// </remarks>
    /// <param name="request">Tham số yêu cầu</param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<WeChatWorkResponse> AddAttendeesAsync(
        WeChatWorkScheduleAddAttendeesRequest request,
        CancellationToken cancellationToken = default);
    /// <summary>
    /// Xóa người tham gia lịch trình
    /// </summary>
    /// <remarks>
    /// Xem chi tiết tại:<see href="https://developer.work.weixin.qq.com/document/path/97722" />
    /// </remarks>
    /// <param name="request">Tham số yêu cầu</param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<WeChatWorkResponse> DeleteAttendeesAsync(
        WeChatWorkScheduleDeleteAttendeesRequest request,
        CancellationToken cancellationToken = default);
    /// <summary>
    /// Lấy danh sách lịch trình trong lịch
    /// </summary>
    /// <remarks>
    /// Xem chi tiết tại:<see href="https://developer.work.weixin.qq.com/document/path/97723" />
    /// </remarks>
    /// <param name="request">Tham số yêu cầu</param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<WeChatWorkGetScheduleListByCalendarResponse> GetScheduleListByCalendarAsync(
        WeChatWorkGetScheduleListByCalendarRequest request,
        CancellationToken cancellationToken = default);
    /// <summary>
    /// Lấy chi tiết lịch trình
    /// </summary>
    /// <remarks>
    /// Xem chi tiết tại:<see href="https://developer.work.weixin.qq.com/document/path/97724" />
    /// </remarks>
    /// <param name="request">Tham số yêu cầu</param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<WeChatWorkGetScheduleListResponse> GetScheduleListAsync(
        WeChatWorkGetScheduleListRequest request,
        CancellationToken cancellationToken = default);
    /// <summary>
    /// Hủy lịch trình
    /// </summary>
    /// <remarks>
    /// Xem chi tiết tại:<see href="https://developer.work.weixin.qq.com/document/path/97725" />
    /// </remarks>
    /// <param name="request">Tham số yêu cầu</param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<WeChatWorkResponse> DeleteScheduleAsync(
        WeChatWorkDeleteScheduleRequest request,
        CancellationToken cancellationToken = default);
}
