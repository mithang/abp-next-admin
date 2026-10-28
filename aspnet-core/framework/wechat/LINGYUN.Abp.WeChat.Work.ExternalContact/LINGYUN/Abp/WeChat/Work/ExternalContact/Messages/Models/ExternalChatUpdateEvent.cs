using System.Xml.Serialization;

namespace LINGYUN.Abp.WeChat.Work.ExternalContact.Messages.Models;
/// <summary>
/// Đẩy sự kiện thay đổi nhóm khách hàng
/// </summary>
public abstract class ExternalChatUpdateEvent : ExternalChatChangeEvent
{
    /// <summary>
    /// Chi tiết thay đổi. Hiện có các loại sau:<br />
    /// add_member : Thành viên vào nhóm<br />
    /// del_member : Thành viên rời nhóm<br />
    /// change_owner : Thay đổi chủ nhóm<br />
    /// change_name : Thay đổi tên nhóm<br />
    /// change_notice : Thay đổi thông báo nhóm
    /// </summary>
    [XmlElement("UpdateDetail")]
    public string UpdateDetail { get; set; } = default!;
}
