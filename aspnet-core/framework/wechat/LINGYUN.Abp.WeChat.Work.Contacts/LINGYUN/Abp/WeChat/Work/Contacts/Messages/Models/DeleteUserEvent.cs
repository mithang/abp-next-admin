using LINGYUN.Abp.WeChat.Common.Messages;
using LINGYUN.Abp.WeChat.Work.Common.Messages;
using System.Xml.Serialization;
using Volo.Abp.EventBus;

namespace LINGYUN.Abp.WeChat.Work.Contacts.Messages.Models;
/// <summary>
/// Sự kiện xóa thành viên
/// </summary>
[EventName("delete_user")]
public class DeleteUserEvent : WeChatWorkEventMessage
{
    /// <summary>
    /// UserID của thành viên có thông tin thay đổi
    /// </summary>
    [XmlElement("UserID")]
    public string UserId { get; set; } = default!;

    public override WeChatMessageEto ToEto()
    {
        return new WeChatWorkEventMessageEto<DeleteUserEvent>(this);
    }
}
