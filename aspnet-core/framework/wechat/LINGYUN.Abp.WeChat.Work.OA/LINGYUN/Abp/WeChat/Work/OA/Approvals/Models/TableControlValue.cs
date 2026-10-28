using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.OA.Approvals.Models;
/// <summary>
/// Giá trị điều khiển chi tiết
/// </summary>
public class TableControlValue : ControlValue
{
    /// <summary>
    /// Nội dung chi tiết, một điều khiển chi tiết có thể chứa nhiều chi tiết con
    /// </summary>
    [NotNull]
    [JsonProperty("children")]
    [JsonPropertyName("children")]
    public List<TableValue> Children { get; set; } = default!;
    public TableControlValue()
    {

    }

    public TableControlValue(List<TableValue> children)
    {
        Children = children;
    }
}

public class TableValue
{
    /// <summary>
    /// Danh sách chi tiết con, điền tại đây giá trị của tất cả các điều khiển con của chi tiết con, cấu trúc dữ liệu của điều khiển con giống như điều khiển thông thường.
    /// </summary>
    /// <remarks>
    /// Lưu ý: không được là mảng rỗng, ít nhất phải chứa một chi tiết con, chi tiết con phải bao gồm toàn bộ điều khiển con đã thiết lập trong mẫu, nếu chi tiết con rỗng thì cần đặt giá trị của tất cả các điều khiển con thành rỗng
    /// </remarks>
    [NotNull]
    [JsonProperty("list")]
    [JsonPropertyName("list")]
    public List<ControlData> List { get; set; } = default!;
    public TableValue()
    {

    }

    public TableValue(List<ControlData> list)
    {
        List = list;
    }
}