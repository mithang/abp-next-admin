using JetBrains.Annotations;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;
using Volo.Abp;

namespace LINGYUN.Abp.WeChat.Work.Messages.Models;
/// <summary>
/// Thân tin nhắn thẻ mẫu hiển thị hình ảnh và văn bản của Webhook
/// </summary>
public class WebhookNewsNoticeCardMessage : WebhookTemplateCardMessage
{
    /// <summary>
    /// Kiểu hình ảnh
    /// </summary>
    [NotNull]
    [JsonProperty("aspect_ratio")]
    [JsonPropertyName("aspect_ratio")]
    public WebhookTemplateCardImage CardImage { get; set; }
    /// <summary>
    /// Kiểu hình ảnh bên trái, văn bản bên phải
    /// </summary>
    [CanBeNull]
    [JsonProperty("image_text_area")]
    [JsonPropertyName("image_text_area")]
    public WebhookTemplateCardImageTextArea? ImageTextArea { get; set; }
    /// <summary>
    /// Nội dung dọc cấp hai của thẻ, trường này có thể là mảng rỗng, nhưng nếu có dữ liệu thì cần xác nhận trường tương ứng có bắt buộc hay không, độ dài danh sách không vượt quá 4
    /// </summary>
    [CanBeNull]
    [JsonProperty("vertical_content_list")]
    [JsonPropertyName("vertical_content_list")]
    public List<WebhookTemplateCardVerticalContent>? VerticalContents { get; set; }
    /// <summary>
    /// Tạo một thân tin nhắn thẻ mẫu hiển thị hình ảnh và văn bản của Webhook
    /// </summary>
    /// <param name="cardImage">Kiểu hình ảnh</param>
    /// <param name="action">Sự kiện chuyển hướng khi nhấn vào toàn bộ thẻ</param>
    /// <param name="mainTitle">Nội dung chính của thẻ mẫu</param>
    /// <param name="imageTextArea">Kiểu hình ảnh bên trái, văn bản bên phải</param>
    /// <param name="source">Thông tin kiểu nguồn của thẻ</param>
    /// <param name="quoteArea">Kiểu trích dẫn tài liệu</param>
    /// <param name="horizontalContents">Danh sách tiêu đề cấp hai + văn bản, độ dài danh sách không vượt quá 6</param>
    /// <param name="verticalContents">Nội dung dọc cấp hai của thẻ, độ dài danh sách không vượt quá 4</param>
    /// <param name="jumps">Danh sách kiểu hướng dẫn chuyển hướng, độ dài danh sách không vượt quá 3</param>
    /// <exception cref="ArgumentException"></exception>
    public WebhookNewsNoticeCardMessage(
        WebhookTemplateCardImage cardImage,
        WebhookTemplateCardAction action,
        WebhookTemplateCardMainTitle mainTitle,
        WebhookTemplateCardImageTextArea? imageTextArea = null,
        WebhookTemplateCardSource? source = null,
        WebhookTemplateCardQuoteArea? quoteArea = null, 
        List<WebhookTemplateCardHorizontalContent>? horizontalContents = null,
        List<WebhookTemplateCardVerticalContent>? verticalContents = null,
        List<WebhookTemplateCardJump>? jumps = null) 
        : base("news_notice", action, mainTitle, source, quoteArea, horizontalContents, jumps)
    {
        Check.NotNull(mainTitle, nameof(mainTitle));
        Check.NotNull(cardImage, nameof(cardImage));

        CardImage = cardImage;
        ImageTextArea = imageTextArea;
        VerticalContents = verticalContents;

        if (verticalContents != null && verticalContents.Count > 4)
        {
            throw new ArgumentException("The length of the secondary vertical content list on the card cannot exceed 4!");
        }
    }
}
