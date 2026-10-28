using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;
using Volo.Abp;

namespace LINGYUN.Abp.WeChat.Work.Contacts.Members.Request;
/// <summary>
/// Tham số yêu cầu lấy danh sách ID thành viên
/// </summary>
/// <remarks>
/// Xem chi tiết tại: <see href="https://developer.work.weixin.qq.com/document/path/96067" />
/// </remarks>
public class WeChatWorkGetUserIdListRequest : WeChatWorkRequest
{
    /// <summary>
    /// Con trỏ dùng cho truy vấn phân trang, kiểu chuỗi, do lần gọi trước trả về, lần gọi đầu tiên không điền
    /// </summary>
    [CanBeNull]
    [JsonProperty("cursor")]
    [JsonPropertyName("cursor")]
    public string? Cursor { get; set; }
    /// <summary>
    /// Phân trang, lượng dữ liệu dự kiến yêu cầu, phạm vi giá trị 1 ~ 10000
    /// </summary>
    [CanBeNull]
    [JsonProperty("limit")]
    [JsonPropertyName("limit")]
    public int? Limit { get; set; }
    public WeChatWorkGetUserIdListRequest(string? cursor = null, int? limit = 100)
    {
        Cursor = cursor;
        Limit = limit;
    }

    protected override void Validate()
    {
        if (Limit.HasValue)
        {
            Check.Range(Limit.Value, nameof(Limit), 1, 10000);
        }
    }
}
