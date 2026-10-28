using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.Contacts.Departments.Response;
/// <summary>
/// Tham số phản hồi tạo phòng ban
/// </summary>
/// <remarks>
/// Chi tiết xem: <see href="https://developer.work.weixin.qq.com/document/path/90205" />
/// </remarks>
public class WeChatWorkCreateDepartmentResponse : WeChatWorkResponse
{
    /// <summary>
    /// id phòng ban đã tạo
    /// </summary>
    [NotNull]
    [JsonProperty("id")]
    [JsonPropertyName("id")]
    public int Id { get; set; }
}
