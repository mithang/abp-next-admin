using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.Messages.Models;
/// <summary>
/// Tin nhắn thẻ mẫu văn bản
/// </summary>
public class TextTemplateCard : TemplateCard
{
    [Newtonsoft.Json.JsonConstructor]
    [System.Text.Json.Serialization.JsonConstructor]
    public TextTemplateCard(TemplateCardCardAction cardAction, string taskId = "")
        : base("template_card", taskId)
    {
        CardAction = cardAction;
    }

    /// <summary>
    /// Thông tin kiểu nguồn của thẻ, nếu không cần kiểu nguồn có thể không điền
    /// </summary>
    [CanBeNull]
    [JsonProperty("source")]
    [JsonPropertyName("source")]
    public TemplateCardSource? Source { get; set; }
    /// <summary>
    /// Nút thao tác thêm ở góc trên bên phải của thẻ
    /// </summary>
    [CanBeNull]
    [JsonProperty("action_menu")]
    [JsonPropertyName("action_menu")]
    public TemplateCardActionMenu? ActionMenu { get; set; }
    /// <summary>
    /// Tiêu đề cấp một
    /// </summary>
    [CanBeNull]
    [JsonProperty("main_title")]
    [JsonPropertyName("main_title")]
    public TemplateCardMainTitle? MainTitle { get; set; }
    /// <summary>
    /// Văn bản thường cấp hai, nên không quá 160 ký tự (hỗ trợ chuyển đổi id)
    /// </summary>
    [CanBeNull]
    [JsonProperty("sub_title_text")]
    [JsonPropertyName("sub_title_text")]
    public string? SubTitle { get; set; }
    /// <summary>
    /// Kiểu trích dẫn tài liệu
    /// </summary>
    [CanBeNull]
    [JsonProperty("quote_area")]
    [JsonPropertyName("quote_area")]
    public TemplateCardQuoteArea? QuoteArea { get; set; }
    /// <summary>
    /// Kiểu dữ liệu quan trọng
    /// </summary>
    [CanBeNull]
    [JsonProperty("emphasis_content")]
    [JsonPropertyName("emphasis_content")]
    public TemplateCardEmphasisContent? EmphasisContent { get; set; }
    /// <summary>
    /// Danh sách tiêu đề cấp hai + văn bản, trường này có thể là mảng rỗng, nhưng nếu có dữ liệu cần xác nhận trường tương ứng có bắt buộc hay không, độ dài danh sách không quá 6
    /// </summary>
    [CanBeNull]
    [JsonProperty("horizontal_content_list")]
    [JsonPropertyName("horizontal_content_list")]
    public List<TemplateCardHorizontalContent>? HorizontalContents { get; set; }
    /// <summary>
    /// Danh sách kiểu hướng dẫn chuyển hướng, trường này có thể là mảng rỗng, nhưng nếu có dữ liệu cần xác nhận trường tương ứng có bắt buộc hay không, độ dài danh sách không quá 3
    /// </summary>
    [CanBeNull]
    [JsonProperty("jump_list")]
    [JsonPropertyName("jump_list")]
    public List<TemplateCardJump>? Jumps { get; set; }
    /// <summary>
    /// Sự kiện chuyển hướng khi nhấp vào toàn bộ thẻ, text_notice bắt buộc phải có trường này
    /// </summary>
    [NotNull]
    [JsonProperty("TemplateCardCardAction")]
    [JsonPropertyName("TemplateCardCardAction")]
    public TemplateCardCardAction CardAction { get; set; } = default!;
}
