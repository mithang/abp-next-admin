using LINGYUN.Abp.WeChat.Common.Messages;
using LINGYUN.Abp.WeChat.Work.Common.Messages;
using System.Xml.Serialization;
using Volo.Abp.EventBus;

namespace LINGYUN.Abp.WeChat.Work.OA.Messages.Models;
/// <summary>
/// Sự kiện phản hồi lịch trình
/// </summary>
/// <remarks>
/// Khi người tham gia thực hiện thao tác phản hồi (chấp nhận, chờ xác nhận, từ chối) đối với lịch trình do ứng dụng tạo, sự kiện này sẽ được kích hoạt.
/// </remarks>
[EventName("respond_schedule")]
public class RespondScheduleEvent : WeChatWorkEventMessage
{
    /// <summary>
    /// ID lịch
    /// </summary>
    [XmlElement("CalId")]
    public string? CalId { get; set; }
    /// <summary>
    /// ID lịch trình
    /// </summary>
    [XmlElement("ScheduleId")]
    public string ScheduleId { get; set; } = default!;

    public override WeChatMessageEto ToEto()
    {
        return new WeChatWorkEventMessageEto<RespondScheduleEvent>(this);
    }
}