using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.Messages.Models;
/// <summary>
/// Nút thao tác thêm ở góc trên bên phải của thẻ
/// </summary>
public class TemplateCardActionMenu
{
    /// <summary>
    /// Mô tả văn bản phụ trợ tương tác phụ của thẻ
    /// </summary>
    [CanBeNull]
    [JsonProperty("desc")]
    [JsonPropertyName("desc")]
    public string? Description { get; set; }
    /// <summary>
    /// Danh sách thao tác, độ dài danh sách có giá trị trong khoảng [1, 3]
    /// </summary>
    [NotNull]
    [JsonProperty("action_list")]
    [JsonPropertyName("action_list")]
    public List<TemplateCardAction> Actions { get; set;}

    [Newtonsoft.Json.JsonConstructor]
    [System.Text.Json.Serialization.JsonConstructor]
    public TemplateCardActionMenu(List<TemplateCardAction> actions, string description = "")
    {
        Actions = actions;
        Description = description;
    }
}
