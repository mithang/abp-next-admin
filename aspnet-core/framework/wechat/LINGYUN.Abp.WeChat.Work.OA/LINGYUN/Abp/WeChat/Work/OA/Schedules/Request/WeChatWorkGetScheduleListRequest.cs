using JetBrains.Annotations;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;
using Volo.Abp;

namespace LINGYUN.Abp.WeChat.Work.OA.Schedules.Request;
/// <summary>
/// Tham số yêu cầu lấy chi tiết lịch trình
/// </summary>
/// <remarks>
/// Chi tiết xem tại: <see href="https://developer.work.weixin.qq.com/document/path/97724"/>
/// </remarks>
public class WeChatWorkGetScheduleListRequest : WeChatWorkRequest
{
    private List<string> _scheduleIdList = new List<string>();
    /// <summary>
    /// Danh sách ID lịch trình. Tối đa 1000 mục mỗi lần lấy
    /// </summary>
    [NotNull]
    [JsonProperty("schedule_id_list")]
    [JsonPropertyName("schedule_id_list")]
    public string[] ScheduleIdList => _scheduleIdList.ToArray();
    public WeChatWorkGetScheduleListRequest(string[] calIdList)
    {
        Check.NotNullOrEmpty(calIdList, nameof(calIdList));

        _scheduleIdList.AddIfNotContains(calIdList);
    }
    /// <summary>
    /// Thêm Id lịch
    /// </summary>
    /// <param name="calIdList"></param>
    public void WithCalId(params string[] calIdList)
    {
        _scheduleIdList.AddIfNotContains(calIdList);
    }

    protected override void Validate()
    {
        if (ScheduleIdList.Length > 2000)
        {
            throw new ArgumentException("A single schedule query can obtain up to 1,000 entries at most!", nameof(ScheduleIdList));
        }
    }
}
