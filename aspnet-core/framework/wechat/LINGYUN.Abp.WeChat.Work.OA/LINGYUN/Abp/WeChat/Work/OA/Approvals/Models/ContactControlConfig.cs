using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.OA.Approvals.Models;
/// <summary>
/// Cấu hình điều khiển thành viên
/// </summary>
public class ContactControlConfig : ControlConfig
{
    /// <summary>
    /// Điều khiển thành viên, phòng ban
    /// </summary>
    [NotNull]
    [JsonProperty("contact")]
    [JsonPropertyName("contact")]
    public ContactConfig Contact { get; set; } = default!;
    public ContactControlConfig()
    {

    }

    public ContactControlConfig(ContactConfig contact)
    {
        Contact = contact;
    }
}

public class ContactConfig
{
    /// <summary>
    /// single-Chọn một, multi-Chọn nhiều
    /// </summary>
    [NotNull]
    [JsonProperty("type")]
    [JsonPropertyName("type")]
    public string Type { get; set; } = default!;
    /// <summary>
    /// user-Thành viên, department-Phòng ban
    /// </summary>
    [NotNull]
    [JsonProperty("mode")]
    [JsonPropertyName("mode")]
    public string Mode { get; set; } = default!;
    public ContactConfig()
    {

    }

    private ContactConfig(string type, string mode)
    {
        Type = type;
        Mode = mode;
    }

    public static ContactConfig SingleUser()
    {
        return new ContactConfig("single", "user");
    }

    public static ContactConfig SingleDepartment()
    {
        return new ContactConfig("single", "department");
    }

    public static ContactConfig MultipleUser()
    {
        return new ContactConfig("multi", "user");
    }

    public static ContactConfig MultipleDepartment()
    {
        return new ContactConfig("multi", "department");
    }
}
