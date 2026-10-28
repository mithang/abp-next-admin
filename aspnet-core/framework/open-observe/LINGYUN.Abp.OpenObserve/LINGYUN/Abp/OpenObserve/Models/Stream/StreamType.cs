using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.OpenObserve.Models.Stream;

/// <summary>
/// Loại luồng dữ liệu
/// </summary>
public enum StreamType
{
    Logs = 0,
    Metrics = 1,
    Traces = 2,
}
