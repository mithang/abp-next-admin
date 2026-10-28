using LINGYUN.Abp.WeChat.Common.Messages;
using LINGYUN.Abp.WeChat.Work.Common.Messages;
using System.Xml.Serialization;
using Volo.Abp.EventBus;

namespace LINGYUN.Abp.WeChat.Work.OA.Messages.Models;
/// <summary>
/// Xóa sự kiện lịch
/// </summary>
/// <remarks>
/// Khi quản trị viên lịch xóa lịch do API tạo, sự kiện này được kích hoạt.
/// </remarks>
[EventName("delete_calendar")]
public class DeleteCalendarEvent : WeChatWorkEventMessage
{
    /// <summary>
    /// ID lịch
    /// </summary>
    [XmlElement("CalId")]
    public string CalId { get; set; } = default!;

    public override WeChatMessageEto ToEto()
    {
        return new WeChatWorkEventMessageEto<DeleteCalendarEvent>(this);
    }
}
