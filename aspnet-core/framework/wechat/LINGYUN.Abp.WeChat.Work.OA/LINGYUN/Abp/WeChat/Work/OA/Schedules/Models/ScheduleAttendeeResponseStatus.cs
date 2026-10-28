using System.ComponentModel;

namespace LINGYUN.Abp.WeChat.Work.OA.Schedules.Models;
/// <summary>
/// Trạng thái chấp nhận của người tham gia lịch trình
/// </summary>
[Description("Trạng thái chấp nhận của người tham gia lịch trình")]
public enum ScheduleAttendeeResponseStatus : uint
{
    /// <summary>
    /// Chưa xử lý
    /// </summary>
    [Description("Chưa xử lý")]
    UnProcessed = 0,
    /// <summary>
    /// Đang chờ quyết định
    /// </summary>
    [Description("Đang chờ quyết định")]
    Determined = 1,
    /// <summary>
    /// Chấp nhận toàn bộ
    /// </summary>
    [Description("Chấp nhận toàn bộ")]
    AcceptAll = 2,
    /// <summary>
    /// Chỉ chấp nhận một lần
    /// </summary>
    [Description("Chỉ chấp nhận một lần")]
    AcceptedOnce = 3,
    /// <summary>
    /// Từ chối
    /// </summary>
    [Description("Từ chối")]
    Refuse = 4,
}
