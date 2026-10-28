using JetBrains.Annotations;
using LINGYUN.Abp.WeChat.Work.Common.Members.Models;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.ExternalContact.Customers.Models;
/// <summary>
/// Thông tin liên hệ bên ngoài
/// </summary>
public class ExternalContactInfo
{
    /// <summary>
    /// userid của liên hệ bên ngoài
    /// </summary>
    [NotNull]
    [JsonProperty("external_userid")]
    [JsonPropertyName("external_userid")]
    public string ExternalUserId { get; set; } = default!;
    /// <summary>
    /// Tên của liên hệ bên ngoài
    /// </summary>
    /// <remarks>
    /// Nếu là người dùng WeChat, trả về biệt danh WeChat của họ.<br />
    /// Nếu là liên hệ WeChat doanh nghiệp, trả về bí danh hoặc tên thật mà họ đã đặt để hiển thị ra bên ngoài
    /// </remarks>
    [NotNull]
    [JsonProperty("name")]
    [JsonPropertyName("name")]
    public string Name { get; set; } = default!;
    /// <summary>
    /// Ảnh đại diện của liên hệ bên ngoài
    /// </summary>
    [CanBeNull]
    [JsonProperty("avatar")]
    [JsonPropertyName("avatar")]
    public string? Avatar { get; set; }
    /// <summary>
    /// Loại của liên hệ bên ngoài
    /// </summary>
    [NotNull]
    [JsonProperty("type")]
    [JsonPropertyName("type")]
    public ExternalContactType Type { get; set; }
    /// <summary>
    /// Giới tính của liên hệ bên ngoài
    /// </summary>
    [NotNull]
    [JsonProperty("gender")]
    [JsonPropertyName("gender")]
    public ExternalContactGender Gender { get; set; }
    /// <summary>
    /// Định danh duy nhất của liên hệ bên ngoài trên nền tảng mở WeChat (unionid WeChat), thông qua trường này doanh nghiệp có thể liên kết liên hệ bên ngoài với người dùng tài khoản công khai/tiểu trình.<br />
    /// Chỉ có trường này khi loại liên hệ là người dùng WeChat và doanh nghiệp đã liên kết ID nhà phát triển WeChat
    /// </summary>
    [CanBeNull]
    [JsonProperty("unionid")]
    [JsonPropertyName("unionid")]
    public string? UnionId { get; set; }
    /// <summary>
    /// Chức vụ của liên hệ bên ngoài; nếu doanh nghiệp hoặc người dùng bên ngoài chọn ẩn chức vụ thì không trả về, chỉ có trường này khi loại liên hệ là người dùng WeChat doanh nghiệp
    /// </summary>
    [CanBeNull]
    [JsonProperty("position")]
    [JsonPropertyName("position")]
    public string? Position { get; set; }
    /// <summary>
    /// Tên viết tắt của doanh nghiệp nơi liên hệ bên ngoài làm việc, chỉ có trường này khi loại liên hệ là người dùng WeChat doanh nghiệp
    /// </summary>
    [CanBeNull]
    [JsonProperty("corp_name")]
    [JsonPropertyName("corp_name")]
    public string? CorpName { get; set; }
    /// <summary>
    /// Tên chủ thể của doanh nghiệp nơi liên hệ bên ngoài làm việc, chỉ có trường này khi loại liên hệ là người dùng WeChat doanh nghiệp<br />
    /// Chỉ ứng dụng tự xây dựng của doanh nghiệp mới lấy được
    /// </summary>
    [CanBeNull]
    [JsonProperty("corp_full_name")]
    [JsonPropertyName("corp_full_name")]
    public string? CorpFullName { get; set; }
    /// <summary>
    /// Thông tin hiển thị tùy chỉnh của liên hệ bên ngoài
    /// </summary>
    [CanBeNull]
    [JsonProperty("external_profile")]
    [JsonPropertyName("external_profile")]
    public ExternalProfile? ExternalProfile { get; set; }
}
