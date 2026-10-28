using JetBrains.Annotations;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;
using Volo.Abp;

namespace LINGYUN.Abp.WeChat.Work.Contacts.Tags.Request;
/// <summary>
/// Tham số yêu cầu thay đổi thành viên thẻ
/// </summary>
public class WeChatWorkTagChangeMemberRequest : WeChatWorkRequest
{
    /// <summary>
    /// id thẻ, số nguyên không âm; khi chỉ định tham số này, thẻ mới thêm sẽ tạo ra id thẻ tương ứng, nếu không chỉ định thì tự tăng từ id lớn nhất hiện tại.
    /// </summary>
    [NotNull]
    [JsonProperty("tagid")]
    [JsonPropertyName("tagid")]
    public int TagId { get; set; }
    /// <summary>
    /// Danh sách ID thành viên doanh nghiệp, lưu ý: userlist, partylist không được đồng thời rỗng, số lượng mỗi lần yêu cầu không vượt quá 1000
    /// </summary>
    [CanBeNull]
    [JsonProperty("userlist")]
    [JsonPropertyName("userlist")]
    public List<string>? Users { get; set; }
    /// <summary>
    /// 	Danh sách ID phòng ban doanh nghiệp, lưu ý: userlist, partylist không được đồng thời rỗng, số lượng mỗi lần yêu cầu không vượt quá 100
    /// </summary>
    [CanBeNull]
    [JsonProperty("partylist")]
    [JsonPropertyName("partylist")]
    public List<int>? Parts { get; set; }
    public WeChatWorkTagChangeMemberRequest(
        int tagId,
        List<string>? users = null,
        List<int>? parts = null)
    {
        TagId = Check.Positive(tagId, nameof(tagId));
        Users = users;
        Parts = parts;

        if (users == null && parts == null)
        {
            throw new ArgumentNullException("users/parts", "userlist, partylist không được đồng thời rỗng!");
        }
        if (users?.Count > 1000)
        {
            throw new ArgumentOutOfRangeException(nameof(users), "Danh sách ID thành viên doanh nghiệp mỗi lần yêu cầu không vượt quá 1000!");
        }
        if (parts?.Count > 100)
        {
            throw new ArgumentOutOfRangeException(nameof(users), "Danh sách ID phòng ban doanh nghiệp mỗi lần yêu cầu không vượt quá 100!");
        }
    }
}
