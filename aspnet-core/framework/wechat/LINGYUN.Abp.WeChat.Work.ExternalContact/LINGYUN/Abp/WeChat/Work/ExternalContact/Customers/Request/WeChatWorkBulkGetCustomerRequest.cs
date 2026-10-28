using JetBrains.Annotations;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;
using Volo.Abp;

namespace LINGYUN.Abp.WeChat.Work.ExternalContact.Customers.Request;
/// <summary>
/// Tham số yêu cầu tạo nhóm quy tắc mới
/// </summary>
/// <remarks>
/// Chi tiết xem tại: <see href="https://developer.work.weixin.qq.com/document/path/94883#%E5%88%9B%E5%BB%BA%E6%96%B0%E7%9A%84%E8%A7%84%E5%88%99%E7%BB%84" />
/// </remarks>
public class WeChatWorkBulkGetCustomerRequest : WeChatWorkRequest
{
    /// <summary>
    /// Danh sách userid của thành viên doanh nghiệp, kiểu chuỗi, hỗ trợ tối đa 100 mục
    /// </summary>
    [NotNull]
    [JsonProperty("userid_list")]
    [JsonPropertyName("userid_list")]
    public List<string> UserIds { get; }
    /// <summary>
    /// Con trỏ dùng cho truy vấn phân trang, kiểu chuỗi, do lần gọi trước trả về, lần gọi đầu tiên có thể không điền
    /// </summary>
    [CanBeNull]
    [JsonProperty("cursor")]
    [JsonPropertyName("cursor")]
    public string? Cursor { get; }
    /// <summary>
    /// Số bản ghi tối đa trả về, kiểu số nguyên, giá trị lớn nhất là 100, giá trị mặc định là 50, khi vượt quá giá trị lớn nhất sẽ lấy giá trị lớn nhất
    /// </summary>
    [CanBeNull]
    [JsonProperty("limit")]
    [JsonPropertyName("limit")]
    public int Limit { get; }
    public WeChatWorkBulkGetCustomerRequest(
        List<string> userIds, 
        string? cursor = null, 
        int limit = 50)
    {
        Check.NotNullOrEmpty(userIds, nameof(userIds));
        Check.Range(limit, nameof(limit), 1, 100);

        if (userIds.Count > 100)
        {
            throw new ArgumentException("The maximum number of userIds allowed in the list is only 100!");
        }

        UserIds = userIds;
        Cursor = cursor;
        Limit = limit;
    }
}
