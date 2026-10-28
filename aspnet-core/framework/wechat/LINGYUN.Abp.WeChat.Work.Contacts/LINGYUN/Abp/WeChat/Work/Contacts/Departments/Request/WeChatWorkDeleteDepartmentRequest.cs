using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.Contacts.Departments.Request;
/// <summary>
/// Tham số yêu cầu xóa phòng ban
/// </summary>
/// <remarks>
/// Chi tiết xem: <see href="https://developer.work.weixin.qq.com/document/path/90207" />
/// </remarks>
public class WeChatWorkDeleteDepartmentRequest : WeChatWorkRequest
{
    /// <summary>
    /// Id phòng ban
    /// </summary>
    [NotNull]
    [JsonProperty("id")]
    [JsonPropertyName("id")]
    public int Id { get; }
    public WeChatWorkDeleteDepartmentRequest(int id)
    {
        Id = id;
    }
}
