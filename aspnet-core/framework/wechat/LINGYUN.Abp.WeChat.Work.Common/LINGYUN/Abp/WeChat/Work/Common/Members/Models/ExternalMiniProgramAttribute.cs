using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.Common.Members.Models;
/// <summary>
/// Thuộc tính loại ứng dụng nhỏ
/// </summary>
public class ExternalMiniProgramAttribute : ExternalAttribute
{
    /// <summary>
    /// Ứng dụng nhỏ
    /// </summary>
    [NotNull]
    [JsonProperty("miniprogram")]
    [JsonPropertyName("miniprogram")]
    public ExternalMiniProgramModel MiniProgram { get; set; } = default!;
}

public class ExternalMiniProgramModel
{
    /// <summary>
    /// Appid của ứng dụng nhỏ, phải là ứng dụng nhỏ đã được cài đặt và ủy quyền trong doanh nghiệp này, nếu không sẽ bị bỏ qua
    /// </summary>
    [NotNull]
    [JsonProperty("appid")]
    [JsonPropertyName("appid")]
    public string AppId { get; set; } = default!;
    /// <summary>
    /// Tiêu đề hiển thị của ứng dụng nhỏ, giới hạn độ dài 12 ký tự UTF8
    /// </summary>
    [NotNull]
    [JsonProperty("title")]
    [JsonPropertyName("title")]
    public string Title { get; set; } = default!;
    /// <summary>
    /// Đường dẫn trang của ứng dụng nhỏ
    /// </summary>
    [NotNull]
    [JsonProperty("pagepath")]
    [JsonPropertyName("pagepath")]
    public string PagePath { get; set; } = default!;
}
