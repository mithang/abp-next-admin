using JetBrains.Annotations;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.Contacts.Members.Request;
/// <summary>
/// Tham số yêu cầu xóa hàng loạt thành viên
/// </summary>
/// <remarks>
/// Xem chi tiết tại: <see href="https://developer.work.weixin.qq.com/document/path/90199" />
/// </remarks>
public class WeChatWorkBulkDeleteMemberRequest : WeChatWorkRequest
{
    /// <summary>
    /// Danh sách UserID thành viên. Tương ứng với tài khoản ở phía quản trị. Hỗ trợ tối đa 200 tài khoản. Nếu tồn tại UserID không hợp lệ, trả về lỗi trực tiếp
    /// </summary>
    [NotNull]
    [JsonProperty("useridlist")]
    [JsonPropertyName("useridlist")]
    public List<string> UserIdList {  get; }
    public WeChatWorkBulkDeleteMemberRequest() :this([])
    {
    }

    public WeChatWorkBulkDeleteMemberRequest(List<string> userIdList)
    {
        UserIdList = userIdList;
    }

    protected override void Validate()
    {
        if (UserIdList.Count > 100)
        {
            throw new ArgumentException("The maximum number of member ids that can be deleted simultaneously is only 200!");
        }
    }
}
