using LINGYUN.Abp.WeChat.Common.Messages;
using LINGYUN.Abp.WeChat.Work.Common.Messages;
using System.Xml.Serialization;
using Volo.Abp.EventBus;

namespace LINGYUN.Abp.WeChat.Work.ExternalContact.Messages.Models;
/// <summary>
/// Đẩy sự kiện thành viên rời nhóm khách hàng
/// </summary>
[EventName("external_chat_del_member")]
public class ExternalChaDelMemberEvent : ExternalChatChangeMemberEvent
{
    /// <summary>
    /// Có giá trị khi là thành viên rời nhóm. Biểu thị cách thức thành viên rời nhóm<br />
    /// 0 - Tự rời nhóm<br />
    /// 1 - Chủ nhóm/Quản trị viên nhóm loại ra<br />
    /// </summary>
    [XmlElement("QuitScene")]
    public ExternalChatMemberQuitScene QuitScene { get; set; }

    public override WeChatMessageEto ToEto()
    {
        return new WeChatWorkEventMessageEto<ExternalChaDelMemberEvent>(this);
    }
}
