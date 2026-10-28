using LINGYUN.Abp.WeChat.Common.Messages;
using System.Xml.Serialization;
using Volo.Abp.EventBus;

namespace LINGYUN.Abp.WeChat.Work.Common.Messages.Models;
/// <summary>
/// Đẩy sự kiện menu góc trên bên phải của thẻ mẫu chung
/// </summary>
[EventName("template_card_menu_event")]
public class TemplateCardMenuPushEvent : WeChatWorkEventMessage
{
    /// <summary>
    /// Giống với task_id đã chỉ định khi gửi tin nhắn thẻ mẫu
    /// </summary>
    [XmlElement("TaskId")]
    public string TaskId { get; set; } = default!;
    /// <summary>
    /// Kiểu của thẻ mẫu chung,
    /// Các kiểu gồm
    /// "text_notice", 
    /// "news_notice", 
    /// "button_interaction"
    /// ba loại
    /// </summary>
    [XmlElement("CardType")]
    public string CardType { get; set; } = default!;
    /// <summary>
    /// ResponseCode dùng để gọi giao diện cập nhật thẻ
    /// </summary>
    [XmlElement("ResponseCode")]
    public string ResponseCode { get; set; } = default!;
    /// <summary>
    /// Giống với giá trị key của nút menu góc trên bên phải của thẻ mẫu đã gửi
    /// </summary>
    [XmlElement("EventKey")]
    public string EventKey { get; set; } = default!;
    public override WeChatMessageEto ToEto()
    {
        return new WeChatWorkEventMessageEto<TemplateCardMenuPushEvent>(this);
    }
}
