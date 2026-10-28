using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.ExternalContact.Contacts.Request;
/// <summary>
/// Tham số yêu cầu lấy danh sách liên hệ bên ngoài đã phục vụ
/// </summary>
/// <remarks>
/// Chi tiết xem tại: <see href="https://developer.work.weixin.qq.com/document/path/99434" />
/// </remarks>
public class WeChatWorkGetExternalContactListRequest : WeChatWorkRequest
{
    /// <summary>
    /// Con trỏ dùng cho truy vấn phân trang, kiểu chuỗi, do lần gọi trước trả về, lần gọi đầu tiên có thể không điền
    /// </summary>
    /// <remarks>
    /// Cursor có thời hạn hiệu lực, không sử dụng sau khi đã lưu vào bộ nhớ đệm
    /// </remarks>
    [CanBeNull]
    [JsonProperty("cursor")]
    [JsonPropertyName("cursor")]
    public string? Cursor { get; }
    /// <summary>
    /// Số bản ghi tối đa trả về, kiểu số nguyên, mặc định là 1000
    /// </summary>
    [CanBeNull]
    [JsonProperty("limit")]
    [JsonPropertyName("limit")]
    public int? Limit { get; }
    public WeChatWorkGetExternalContactListRequest(string? cursor = null, int? limit = 1000)
    {
        Cursor = cursor;
        Limit = limit;
    }
}
