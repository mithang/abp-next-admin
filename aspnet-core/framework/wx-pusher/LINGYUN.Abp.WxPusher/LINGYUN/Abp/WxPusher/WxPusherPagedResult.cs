using Newtonsoft.Json;
using System;
using System.Collections.Generic;

namespace LINGYUN.Abp.WxPusher;

[Serializable]
public class WxPusherPagedResult<T>
{
    /// <summary>
    /// Tổng số
    /// </summary>
    [JsonProperty("total")]
    public int Total { get; set; }
    /// <summary>
    /// Số trang hiện tại
    /// </summary>
    [JsonProperty("page")]
    public int Page { get; set; }
    /// <summary>
    /// Kích thước trang
    /// </summary>
    [JsonProperty("pageSize")]
    public int PageSize { get; set; }
    /// <summary>
    /// Danh sách bản ghi
    /// </summary>
    [JsonProperty("records")]
    public List<T> Records { get; set; } = new List<T>();
}
