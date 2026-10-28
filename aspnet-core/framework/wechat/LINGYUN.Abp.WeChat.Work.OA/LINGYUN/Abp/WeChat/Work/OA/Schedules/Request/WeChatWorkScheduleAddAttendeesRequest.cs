namespace LINGYUN.Abp.WeChat.Work.OA.Schedules.Request;
/// <summary>
/// Tham số yêu cầu thêm người tham gia lịch trình
/// </summary>
/// <remarks>
/// Xem chi tiết tại: <see href="https://developer.work.weixin.qq.com/document/path/97721"/>
/// </remarks>
public class WeChatWorkScheduleAddAttendeesRequest : WeChatWorkScheduleChangeAttendeesRequest
{
    public WeChatWorkScheduleAddAttendeesRequest(string scheduleId) : base(scheduleId)
    {
    }
}
