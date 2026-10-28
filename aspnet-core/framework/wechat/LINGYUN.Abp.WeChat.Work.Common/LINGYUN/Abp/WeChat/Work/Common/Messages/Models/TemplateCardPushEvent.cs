using LINGYUN.Abp.WeChat.Common.Messages;
using System.Collections.Generic;
using System.Xml.Serialization;
using Volo.Abp.EventBus;

namespace LINGYUN.Abp.WeChat.Work.Common.Messages.Models;
/// <summary>
/// Đẩy sự kiện thẻ mẫu
/// </summary>
[EventName("template_card_event")]
public class TemplateCardPushEvent : WeChatWorkEventMessage
{
    /// <summary>
    /// Giống với task_id đã chỉ định khi gửi tin nhắn thẻ mẫu
    /// </summary>
    [XmlElement("TaskId")]
    public string TaskId { get; set; } = default!;
    /// <summary>
    /// Loại thẻ mẫu chung, các loại gồm
    /// "text_notice", 
    /// "news_notice",
    /// "button_interaction",
    /// "vote_interaction", 
    /// "multiple_interaction"
    /// năm loại
    /// </summary>
    [XmlElement("CardType")]
    public string CardType { get; set; } = default!;
    /// <summary>
    /// ResponseCode dùng để gọi API cập nhật thẻ, có hiệu lực trong 72 giờ và chỉ được sử dụng một lần
    /// </summary>
    [XmlElement("ResponseCode")]
    public string ResponseCode { get; set; } = default!;
    /// <summary>
    /// Giống với giá trị btn:key của nút đã chỉ định khi gửi tin nhắn thẻ mẫu
    /// </summary>
    [XmlElement("EventKey")]
    public string EventKey { get; set; } = default!;
    /// <summary>
    /// Giá trị KEY của sự kiện
    /// </summary>
    [XmlElement("SelectedItems")]
    public TemplateCardQuestionInfo QuestionInfo { get; set; } = default!;
    public override WeChatMessageEto ToEto()
    {
        return new WeChatWorkEventMessageEto<TemplateCardPushEvent>(this);
    }
}

public class TemplateCardQuestionInfo
{
    /// <summary>
    /// Giá trị KEY của sự kiện
    /// </summary>
    [XmlElement("SelectedItem")]
    public List<TemplateCardQuestion>? Items { get; set; }
}

public class TemplateCardQuestion
{
    /// <summary>
    /// Giá trị key của câu hỏi
    /// </summary>
    [XmlElement("QuestionKey")]
    public string QuestionKey { get; set; } = default!;
    /// <summary>
    /// Giá trị key của câu hỏi
    /// </summary>
    [XmlArray("OptionIds")]
    public List<TemplateCardQuestionOption>? OptionIds { get; set; }
}

public class TemplateCardQuestionOption
{
    /// <summary>
    /// Giá trị key của câu hỏi
    /// </summary>
    [XmlElement("OpitonId")]
    public List<string>? Items { get; set; }
}
