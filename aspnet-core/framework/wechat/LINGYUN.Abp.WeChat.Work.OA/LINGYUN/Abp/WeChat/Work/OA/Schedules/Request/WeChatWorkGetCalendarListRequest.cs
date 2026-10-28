using JetBrains.Annotations;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;
using Volo.Abp;

namespace LINGYUN.Abp.WeChat.Work.OA.Schedules.Request;
/// <summary>
/// Tham số yêu cầu lấy chi tiết lịch
/// </summary>
/// <remarks>
/// Chi tiết xem tại: <see href="https://developer.work.weixin.qq.com/document/path/97717"/>
/// </remarks>
public class WeChatWorkGetCalendarListRequest : WeChatWorkRequest
{
    private List<string> _calIdList = new List<string>();
    /// <summary>
    /// Danh sách ID lịch, thu được sau khi gọi API tạo lịch. Tối đa 1000 mục mỗi lần
    /// </summary>
    [NotNull]
    [JsonProperty("cal_id_list")]
    [JsonPropertyName("cal_id_list")]
    public string[] CalIdList => _calIdList.ToArray();
    public WeChatWorkGetCalendarListRequest(string[] calIdList)
    {
        Check.NotNullOrEmpty(calIdList, nameof(calIdList));

        _calIdList.AddIfNotContains(calIdList);
    }
    /// <summary>
    /// Thêm Id lịch
    /// </summary>
    /// <param name="calIdList"></param>
    public void WithCalId(params string[] calIdList)
    {
        _calIdList.AddIfNotContains(calIdList);
    }

    protected override void Validate()
    {
        if (CalIdList.Length > 2000)
        {
            throw new ArgumentException("A single calendar query can obtain up to 1,000 entries at most!", nameof(CalIdList));
        }
    }
}
