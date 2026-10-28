using JetBrains.Annotations;
using Newtonsoft.Json;
using System;
using System.Text.Json.Serialization;
using Volo.Abp;

namespace LINGYUN.Abp.WeChat.Work.OA.Schedules.Models;

public abstract class CreateOrUpdateCalendar
{
    /// <summary>
    /// Tiêu đề lịch. 1 ~ 128 ký tự
    /// </summary>
    [NotNull]
    [JsonProperty("summary")]
    [JsonPropertyName("summary")]
    public string Summary { get; }
    /// <summary>
    /// Màu hiển thị của lịch trên thiết bị đầu cuối, biểu diễn bằng mã hex của mã màu RGB, ví dụ: "#0000FF" biểu thị màu xanh dương thuần
    /// </summary>
    [NotNull]
    [JsonProperty("color")]
    [JsonPropertyName("color")]
    public string Color { get; }
    /// <summary>
    /// Mô tả lịch. 0 ~ 512 ký tự
    /// </summary>
    [CanBeNull]
    [JsonProperty("description")]
    [JsonPropertyName("description")]
    public string? Description { get; set; }
    /// <summary>
    /// Danh sách userid quản trị viên của lịch
    /// </summary>
    [CanBeNull]
    [JsonProperty("admins")]
    [JsonPropertyName("admins")]
    public string[]? Admins { get; set; }
    /// <summary>
    /// Có đặt lịch này làm lịch mặc định của ứng dụng tương ứng với access_token hay không.
    /// </summary>
    [NotNull]
    [JsonProperty("set_as_default")]
    [JsonPropertyName("set_as_default")]
    [Newtonsoft.Json.JsonConverter(typeof(IntToBoolConverter))]
    [System.Text.Json.Serialization.JsonConverter(typeof(IntToBoolConverter))]
    public bool SetAsDefault { get; set; }
    /// <summary>
    /// Có phải lịch công khai hay không. 0-Không; 1-Có
    /// </summary>
    [NotNull]
    [JsonProperty("is_public")]
    [JsonPropertyName("is_public")]
    [Newtonsoft.Json.JsonConverter(typeof(IntToBoolConverter))]
    [System.Text.Json.Serialization.JsonConverter(typeof(IntToBoolConverter))]
    public bool IsPublic { get; private set; }
    /// <summary>
    /// Phạm vi công khai. Chỉ có hiệu lực khi là lịch công khai
    /// </summary>
    [CanBeNull]
    [JsonProperty("public_range")]
    [JsonPropertyName("public_range")]
    public CalendarPublicRange? PublicRange { get; private set; }
    /// <summary>
    /// Có phải lịch toàn viên hay không. 0-Không; 1-Có
    /// </summary>
    [NotNull]
    [JsonProperty("is_corp_calendar")]
    [JsonPropertyName("is_corp_calendar")]
    [Newtonsoft.Json.JsonConverter(typeof(IntToBoolConverter))]
    [System.Text.Json.Serialization.JsonConverter(typeof(IntToBoolConverter))]
    public bool IsCorpCalendar { get; private set; }
    /// <summary>
    /// Danh sách thành viên trong phạm vi thông báo của lịch. Tối đa 2000 người
    /// </summary>
    [CanBeNull]
    [JsonProperty("shares")]
    [JsonPropertyName("shares")]
    public CalendarShare[]? Shares { get; private set; }
    protected CreateOrUpdateCalendar(string summary, string color, string? description)
    {
        Summary = Check.NotNullOrWhiteSpace(summary, nameof(summary), 128, 1);
        Color = Check.NotNullOrWhiteSpace(color, nameof(color));
        Description = Check.Length(description, nameof(description), 512);
    }
    /// <summary>
    /// Đặt phạm vi công khai
    /// </summary>
    /// <param name="publicRange"></param>
    public void WithPublic(CalendarPublicRange publicRange)
    {
        IsPublic = true;
        PublicRange = publicRange;
    }
    /// <summary>
    /// Đặt lịch toàn viên
    /// </summary>
    /// <param name="shares"></param>
    public void WithCorpCalendar(CalendarShare[] shares)
    {
        IsCorpCalendar = true;
        Shares = shares;
    }
    /// <summary>
    /// Xác thực dữ liệu đầu vào
    /// </summary>
    /// <exception cref="ArgumentException"></exception>
    public void Validate()
    {
        Check.Length(Description, nameof(Description), 512);

        if (IsPublic && PublicRange == null)
        {
            throw new ArgumentException("The public range of the public calendar cannot be null!", nameof(PublicRange));
        }
        if (IsCorpCalendar)
        {
            if (Shares == null)
            {
                throw new ArgumentException("The shares of the corp calendar cannot be null!", nameof(IsCorpCalendar));
            }
            if (Shares.Length > 2000)
            {
                throw new ArgumentException("Calendar shares member list. Up to 2,000!", nameof(Shares));
            }
        }
    }
}
