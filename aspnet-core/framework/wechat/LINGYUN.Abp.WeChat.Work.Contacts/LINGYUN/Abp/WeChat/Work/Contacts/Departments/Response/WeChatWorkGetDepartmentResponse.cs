using JetBrains.Annotations;
using LINGYUN.Abp.WeChat.Work.Contacts.Departments.Models;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.Contacts.Departments.Response;
/// <summary>
/// Tham số phản hồi lấy chi tiết một phòng ban
/// </summary>
/// <remarks>
/// Chi tiết xem: <see href="https://developer.work.weixin.qq.com/document/path/95351" />
/// </remarks>
public class WeChatWorkGetDepartmentResponse : WeChatWorkResponse
{
    /// <summary>
    /// Chi tiết phòng ban
    /// </summary>
    [NotNull]
    [JsonProperty("department")]
    [JsonPropertyName("department")]
    public DepartmentInfo Department { get; set; } = default!;
}
