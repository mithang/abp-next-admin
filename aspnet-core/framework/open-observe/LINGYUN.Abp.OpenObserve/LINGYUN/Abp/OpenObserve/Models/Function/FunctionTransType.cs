using System.Collections.Generic;
using System.Text.Json;
using System.Text.Json.Nodes;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.OpenObserve.Models.Function;

/// <summary>
/// Kiểu ngôn ngữ của hàm
/// </summary>
/// <remarks>
/// Trường transType trong thân yêu cầu, 0 = VRL, 1 = JavaScript
/// </remarks>
public enum FunctionTransType
{
    Vrl = 0,
    JavaScript = 1,
}
