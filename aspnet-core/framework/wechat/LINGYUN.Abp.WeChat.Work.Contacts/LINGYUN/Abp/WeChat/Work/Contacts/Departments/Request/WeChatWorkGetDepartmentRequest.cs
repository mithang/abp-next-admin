using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.Contacts.Departments.Request;
/// <summary>
/// Tham số yêu cầu lấy chi tiết một phòng ban
/// </summary>
/// <remarks>
/// Xem chi tiết tại: <see href="https://developer.work.weixin.qq.com/document/path/90207" />
/// </remarks>
public class WeChatWorkGetDepartmentRequest : WeChatWorkRequest
{
    /// <summary>
    /// Id phòng ban
    /// </summary>
    [NotNull]
    [JsonProperty("id")]
    [JsonPropertyName("id")]
    public int Id { get; }
    public WeChatWorkGetDepartmentRequest(int id)
    {
        Id = id;
    }
}
