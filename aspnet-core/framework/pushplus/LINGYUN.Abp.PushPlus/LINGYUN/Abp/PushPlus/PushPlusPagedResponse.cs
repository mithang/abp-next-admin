using Newtonsoft.Json;
using System.Collections.Generic;

namespace LINGYUN.Abp.PushPlus;

public class PushPlusPagedResponse<T>
{
    /// <summary>
    /// Số trang hiện tại
    /// </summary>
    [JsonProperty("pageNum")]
    public int PageNum { get; set; }
    /// <summary>
    /// Kích thước trang
    /// </summary>
    [JsonProperty("pageSize")]
    public int PageSize { get; set; }
    /// <summary>
    /// Tổng số dòng
    /// </summary>
    [JsonProperty("total")]
    public int Total { get; set; }
    /// <summary>
    /// Tổng số trang
    /// </summary>
    [JsonProperty("pages")]
    public int Pages { get; set; }
    /// <summary>
    /// Danh sách tin nhắn
    /// </summary>
    [JsonProperty("list")]
    public List<T> Items { get; set; }

    public PushPlusPagedResponse()
    {
        Items = new List<T>();
    }
}
