using System.Collections.Generic;
using System.Text.Json;
using System.Text.Json.Nodes;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.OpenObserve.Models.Function;

/// <summary>
/// Phản hồi danh sách hàm
/// </summary>
public class FunctionListResponse
{
    [JsonPropertyName("list")]
    public FunctionInfo[] List { get; set; } = [];
}
