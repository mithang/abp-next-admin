using JetBrains.Annotations;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.Messages.Models;
/// <summary>
/// Thân tin nhắn thẻ mẫu thông báo văn bản Webhook
/// </summary>
public class WebhookTextNoticeCardMessage : WebhookTemplateCardMessage
{
    /// <summary>
    /// Văn bản thường cấp hai, nên không quá 112 ký tự. Tiêu đề cấp một main_title.title của nội dung chính thẻ mẫu và văn bản thường cấp hai sub_title_text phải điền ít nhất một mục
    /// </summary>
    [CanBeNull]
    [JsonProperty("sub_title_text")]
    [JsonPropertyName("sub_title_text")]
    public string? SubTitleText { get; set; }
    /// <summary>
    /// Kiểu dữ liệu quan trọng
    /// </summary>
    [CanBeNull]
    [JsonProperty("emphasis_content")]
    [JsonPropertyName("emphasis_content")]
    public WebhookTemplateCardEmphasisContent? EmphasisContent { get; set; }
    /// <summary>
    /// Tạo một Thân tin nhắn thẻ mẫu thông báo văn bản Webhook
    /// </summary>
    /// <param name="action">Sự kiện chuyển hướng khi nhấn vào toàn bộ thẻ</param>
    /// <param name="mainTitle">Nội dung chính của thẻ mẫu</param>
    /// <param name="subTitleText">Văn bản thường cấp hai</param>
    /// <param name="emphasisContent">Kiểu dữ liệu quan trọng</param>
    /// <param name="source">Thông tin kiểu nguồn của thẻ</param>
    /// <param name="quoteArea">Kiểu trích dẫn tài liệu</param>
    /// <param name="horizontalContents">Danh sách tiêu đề cấp hai + văn bản, độ dài danh sách không quá 6</param>
    /// <param name="jumps">Danh sách kiểu hướng dẫn chuyển hướng, độ dài danh sách không quá 3</param>
    /// <exception cref="ArgumentException"></exception>
    public WebhookTextNoticeCardMessage(
        WebhookTemplateCardAction action,
        WebhookTemplateCardMainTitle? mainTitle = null,
        string? subTitleText = null,
        WebhookTemplateCardEmphasisContent? emphasisContent = null,
        WebhookTemplateCardSource? source = null,
        WebhookTemplateCardQuoteArea? quoteArea = null,
        List<WebhookTemplateCardHorizontalContent>? horizontalContents = null,
        List<WebhookTemplateCardJump>? jumps = null) 
        : base("text_notice", action, mainTitle, source, quoteArea, horizontalContents, jumps)
    {
        MainTitle = mainTitle;
        SubTitleText = subTitleText;
        EmphasisContent = emphasisContent;
        Source = source;
        QuoteArea = quoteArea;
        HorizontalContents = horizontalContents;
        Jumps = jumps;

        if (mainTitle == null && subTitleText.IsNullOrWhiteSpace())
        {
            throw new ArgumentException("One of the primary title mainTitle and the secondary ordinary text subTitleText of the main content of the template card must be filled in!");
        }
    }
}
