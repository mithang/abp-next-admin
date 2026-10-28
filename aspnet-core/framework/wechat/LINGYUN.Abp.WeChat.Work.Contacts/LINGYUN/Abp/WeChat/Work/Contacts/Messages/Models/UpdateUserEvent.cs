using LINGYUN.Abp.WeChat.Common.Messages;
using LINGYUN.Abp.WeChat.Work.Common.Messages;
using System.Xml.Serialization;
using Volo.Abp.EventBus;

namespace LINGYUN.Abp.WeChat.Work.Contacts.Messages.Models;
/// <summary>
/// Sự kiện cập nhật thành viên
/// </summary>
[EventName("update_user")]
public class UpdateUserEvent : UserChangeEvent
{
    /// <summary>
    /// UserID mới, được đẩy khi thay đổi (khi userid do hệ thống tạo thì có thể thay đổi một lần)
    /// </summary>
    [XmlElement("NewUserID")]
    public string NewUserId { get; set; } = default!;

    public override WeChatMessageEto ToEto()
    {
        return new WeChatWorkEventMessageEto<UpdateUserEvent>(this);
    }
}
