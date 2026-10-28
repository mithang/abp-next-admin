using LINGYUN.Abp.WeChat.Common.Messages;
using LINGYUN.Abp.WeChat.Work.Common.Messages;
using System.Xml.Serialization;
using Volo.Abp.EventBus;

namespace LINGYUN.Abp.WeChat.Work.ExternalContact.Messages.Models;
/// <summary>
/// Đẩy sự kiện thành viên vào nhóm khách hàng
/// </summary>
[EventName("external_chat_add_member")]
public class ExternalChatAddMemberEvent : ExternalChatChangeMemberEvent
{
    /// <summary>
    /// Có giá trị khi là thành viên vào nhóm. Biểu thị cách thức thành viên vào nhóm<br />
    /// 0 - Được thành viên mời vào nhóm (bao gồm mời trực tiếp vào nhóm và mời vào nhóm qua liên kết mời)<br />
    /// 3 - Vào nhóm bằng cách quét mã QR của nhóm<br />
    /// </summary>
    [XmlElement("JoinScene")]
    public ExternalChatMemberJoinScene JoinScene { get; set; }

    public override WeChatMessageEto ToEto()
    {
        return new WeChatWorkEventMessageEto<ExternalChatAddMemberEvent>(this);
    }
}
