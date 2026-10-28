namespace LINGYUN.Abp.WeChat.Work.OA.Schedules.Request;
/// <summary>
/// Xóa người tham gia lịch trình
/// </summary>
/// <remarks>
/// Xem chi tiết tại: <see href="https://developer.work.weixin.qq.com/document/path/97722"/>
/// </remarks>
public class WeChatWorkScheduleDeleteAttendeesRequest : WeChatWorkScheduleChangeAttendeesRequest
{
    public WeChatWorkScheduleDeleteAttendeesRequest(string scheduleId) : base(scheduleId)
    {
    }
}
