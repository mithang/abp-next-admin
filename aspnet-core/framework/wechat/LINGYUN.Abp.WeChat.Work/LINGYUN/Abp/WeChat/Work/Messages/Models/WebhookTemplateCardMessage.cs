using JetBrains.Annotations;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;
using Volo.Abp;

namespace LINGYUN.Abp.WeChat.Work.Messages.Models;
/// <summary>
/// Thân tin nhắn thẻ mẫu Webhook
/// </summary>
public abstract class WebhookTemplateCardMessage
{
    /// <summary>
    /// Loại mẫu của thẻ mẫu
    /// </summary>
    [CanBeNull]
    [JsonProperty("card_type")]
    [JsonPropertyName("card_type")]
    public string? CardType { get; set; }
    /// <summary>
    /// Thông tin kiểu nguồn của thẻ, có thể bỏ trống nếu không cần kiểu nguồn
    /// </summary>
    [CanBeNull]
    [JsonProperty("source")]
    [JsonPropertyName("source")]
    public WebhookTemplateCardSource? Source { get; set; }
    /// <summary>
    /// Nội dung chính của thẻ mẫu, gồm tiêu đề cấp một và thông tin phụ của tiêu đề
    /// </summary>
    [CanBeNull]
    [JsonProperty("main_title")]
    [JsonPropertyName("main_title")]
    public WebhookTemplateCardMainTitle? MainTitle { get; set; }
    /// <summary>
    /// Kiểu trích dẫn tài liệu, khuyến nghị không dùng chung với dữ liệu quan trọng
    /// </summary>
    [CanBeNull]
    [JsonProperty("quote_area")]
    [JsonPropertyName("quote_area")]
    public WebhookTemplateCardQuoteArea? QuoteArea { get; set; }
    /// <summary>
    /// Danh sách tiêu đề cấp hai + văn bản, trường này có thể là mảng rỗng, nhưng nếu có dữ liệu cần xác nhận trường tương ứng có bắt buộc hay không, độ dài danh sách không vượt quá 6
    /// </summary>
    [CanBeNull]
    [JsonProperty("horizontal_content_list")]
    [JsonPropertyName("horizontal_content_list")]
    public List<WebhookTemplateCardHorizontalContent>? HorizontalContents { get; set; }
    /// <summary>
    /// Danh sách kiểu hướng dẫn chuyển hướng, trường này có thể là mảng rỗng, nhưng nếu có dữ liệu cần xác nhận trường tương ứng có bắt buộc hay không, độ dài danh sách không vượt quá 3
    /// </summary>
    [CanBeNull]
    [JsonProperty("jump_list")]
    [JsonPropertyName("jump_list")]
    public List<WebhookTemplateCardJump>? Jumps { get; set; }
    /// <summary>
    /// Sự kiện chuyển hướng khi nhấp vào toàn bộ thẻ, trường này là bắt buộc trong thẻ mẫu text_notice
    /// </summary>
    [CanBeNull]
    [JsonProperty("card_action")]
    [JsonPropertyName("card_action")]
    public WebhookTemplateCardAction? Action { get; set; }
    /// <summary>
    /// Tạo một thân tin nhắn thẻ mẫu Webhook
    /// </summary>
    /// <param name="cardType">Loại mẫu của thẻ mẫu</param>
    /// <param name="action">Sự kiện chuyển hướng khi nhấp vào toàn bộ thẻ</param>
    /// <param name="mainTitle">Nội dung chính của thẻ mẫu</param>
    /// <param name="source">Thông tin kiểu nguồn của thẻ</param>
    /// <param name="quoteArea">Kiểu trích dẫn tài liệu</param>
    /// <param name="horizontalContents">Danh sách tiêu đề cấp hai + văn bản, độ dài danh sách không vượt quá 6</param>
    /// <param name="jumps">Danh sách kiểu hướng dẫn chuyển hướng, độ dài danh sách không vượt quá 3</param>
    /// <exception cref="ArgumentException"></exception>
    protected WebhookTemplateCardMessage(
        string cardType,
        WebhookTemplateCardAction action,
        WebhookTemplateCardMainTitle? mainTitle = null,
        WebhookTemplateCardSource? source = null,
        WebhookTemplateCardQuoteArea? quoteArea = null,
        List<WebhookTemplateCardHorizontalContent>? horizontalContents = null,
        List<WebhookTemplateCardJump>? jumps = null)
    {
        CardType = Check.NotNullOrWhiteSpace(cardType, nameof(cardType));
        Action = Check.NotNull(action, nameof(action));

        MainTitle = mainTitle;
        Source = source;
        QuoteArea = quoteArea;
        HorizontalContents = horizontalContents;
        Jumps = jumps;

        if (horizontalContents != null && horizontalContents.Count > 6)
        {
            throw new ArgumentException("The length of the secondary title and the text list should not exceed 6!");
        }
        if (jumps != null && jumps.Count > 3)
        {
            throw new ArgumentException("The length of the list in the style of jump guidance should not exceed 3!");
        }
    }
}
