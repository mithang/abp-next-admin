using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.OA.Approvals.Models;
/// <summary>
/// Cấu hình control văn bản hướng dẫn
/// </summary>
public class TipsControlConfig : ControlConfig
{
    /// <summary>
    /// Control văn bản hướng dẫn
    /// </summary>
    [NotNull]
    [JsonProperty("tips")]
    [JsonPropertyName("tips")]
    public TipsConfig Tips { get; set; } = default!;
    public TipsControlConfig()
    {

    }

    public TipsControlConfig(TipsConfig tips)
    {
        Tips = tips;
    }
}

public class TipsConfig
{
    /// <summary>
    /// Mảng văn bản hướng dẫn, mỗi phần tử là văn bản hướng dẫn dạng rich text của một ngôn ngữ khác nhau
    /// </summary>
    [NotNull]
    [JsonProperty("tips_content")]
    [JsonPropertyName("tips_content")]
    public List<TipsContent> TipsContents { get; set; } = default!;
    public TipsConfig()
    {

    }

    public TipsConfig(List<TipsContent> tipsContents)
    {
        TipsContents = tipsContents;
    }
}

public class TipsContent
{
    /// <summary>
    /// Văn bản hướng dẫn dạng rich text của một ngôn ngữ
    /// </summary>
    [NotNull]
    [JsonProperty("text")]
    [JsonPropertyName("text")]
    public TipsContentText Text { get; set; } = default!;
    /// <summary>
    /// Tên đa ngôn ngữ
    /// </summary>
    [NotNull]
    [JsonProperty("lang")]
    [JsonPropertyName("lang")]
    public string Lang { get; set; } = default!;
    public TipsContent()
    {

    }

    public TipsContent(TipsContentText text, string lang = "zh_CN")
    {
        Text = text;
        Lang = lang;
    }
}

public class TipsContentText
{
    /// <summary>
    /// Đoạn văn bản hướng dẫn
    /// </summary>
    [NotNull]
    [JsonProperty("sub_text")]
    [JsonPropertyName("sub_text")]
    public List<TipsContentSubText> SubText { get; set; } = default!;
    public TipsContentText()
    {

    }

    public TipsContentText(List<TipsContentSubText> subText)
    {
        SubText = subText;
    }
}

public class TipsContentSubText
{
    /// <summary>
    /// Loại văn bản 1: văn bản thuần túy 2: liên kết, mỗi văn bản hướng dẫn chỉ hỗ trợ chứa một liên kết
    /// </summary>
    [NotNull]
    [JsonProperty("type")]
    [JsonPropertyName("type")]
    public byte Type { get; set; }
    /// <summary>
    /// Nội dung
    /// </summary>
    [NotNull]
    [JsonProperty("content")]
    [JsonPropertyName("content")]
    public SubTextContent Content { get; set; } = default!;
    public TipsContentSubText()
    {

    }

    private TipsContentSubText(byte type, SubTextContent content)
    {
        Type = type;
        Content = content;
    }

    public static TipsContentSubText Text(TipsContentPlainText content)
    {
        return new TipsContentSubText(1, content);
    }

    public static TipsContentSubText Link(TipsContentLinkText content)
    {
        return new TipsContentSubText(2, content);
    }
}

public abstract class SubTextContent
{
}

public class TipsContentPlainText : SubTextContent
{
    /// <summary>
    /// Văn bản thuần túy
    /// </summary>
    [NotNull]
    [JsonProperty("content")]
    [JsonPropertyName("content")]
    public string Content { get; set; } = default!;
}

public class TipsContentLinkText : SubTextContent
{
    /// <summary>
    /// Tiêu đề liên kết
    /// </summary>
    [NotNull]
    [JsonProperty("title")]
    [JsonPropertyName("title")]
    public string Title { get; set; } = default!;
    /// <summary>
    /// URL liên kết, không được vượt quá 600 ký tự
    /// </summary>
    [NotNull]
    [StringLength(600)]
    [JsonProperty("url")]
    [JsonPropertyName("url")]
    public string Url { get; set; } = default!;
}