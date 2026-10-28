using LINGYUN.Abp.WeChat.Common.Messages;
using LINGYUN.Abp.WeChat.Work.Common.Messages;
using System.Xml.Serialization;
using Volo.Abp.EventBus;

namespace LINGYUN.Abp.WeChat.Work.Contacts.Messages.Models;
/// <summary>
/// Sự kiện thay đổi thành viên của nhãn
/// </summary>
[EventName("update_tag")]
public class UserTagChangeEvent : WeChatWorkEventMessage
{
    /// <summary>
    /// Id nhãn
    /// </summary>
    [XmlElement("TagId")]
    public string TagId { get; set; } = default!;
    /// <summary>
    /// Danh sách userid của thành viên mới thêm vào nhãn, phân tách bằng dấu phẩy
    /// </summary>
    [XmlElement("AddUserItems", IsNullable = true)]
    public string? AddUserItems { get; set; }
    /// <summary>
    /// Danh sách userid của thành viên bị xoá khỏi nhãn, phân tách bằng dấu phẩy
    /// </summary>
    [XmlElement("DelUserItems", IsNullable = true)]
    public string? DelUserItems { get; set; }
    /// <summary>
    /// Danh sách id phòng ban mới thêm vào nhãn, phân tách bằng dấu phẩy
    /// </summary>
    [XmlElement("AddPartyItems", IsNullable = true)]
    public string? AddPartyItems { get; set; }
    /// <summary>
    /// Danh sách id phòng ban bị xoá khỏi nhãn, phân tách bằng dấu phẩy
    /// </summary>
    [XmlElement("DelPartyItems", IsNullable = true)]
    public string? DelPartyItems { get; set; }
    public override WeChatMessageEto ToEto()
    {
        return new WeChatWorkEventMessageEto<UserTagChangeEvent>(this);
    }
}
