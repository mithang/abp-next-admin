using LINGYUN.Abp.WeChat.Common.Messages;
using LINGYUN.Abp.WeChat.Work.Common.Messages;
using System.Xml.Serialization;
using Volo.Abp.EventBus;

namespace LINGYUN.Abp.WeChat.Work.OA.Messages.Models;
/// <summary>
/// Sự kiện hủy đặt phòng họp
/// </summary>
/// <remarks>
/// Khi người dùng hủy đặt phòng họp trong WeChat Work, sự kiện này sẽ được gọi lại cho ứng dụng hệ thống phòng họp; nếu phòng họp này được đặt bởi ứng dụng tự xây dựng, ngoài ứng dụng hệ thống phòng họp ra, sự kiện cũng sẽ được gọi lại cho ứng dụng tự xây dựng tương ứng.
/// </remarks>
[EventName("cancel_meeting_room")]
public class CancelMeetingRoomEvent : WeChatWorkEventMessage
{
    /// <summary>
    /// Id phòng họp
    /// </summary>
    [XmlElement("MeetingRoomId")]
    public int MeetingRoomId { get; set; }
    /// <summary>
    /// Id đặt phòng, có thể truy vấn tình trạng đặt cuộc họp cụ thể theo ID này
    /// </summary>
    [XmlElement("BookingId")]
    public string BookingId { get; set; } = default!;

    public override WeChatMessageEto ToEto()
    {
        return new WeChatWorkEventMessageEto<CancelMeetingRoomEvent>(this);
    }
}
