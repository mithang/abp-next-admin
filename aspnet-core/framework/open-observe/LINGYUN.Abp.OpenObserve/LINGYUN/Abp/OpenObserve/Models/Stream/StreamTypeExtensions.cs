using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.OpenObserve.Models.Stream;

public static class StreamTypeExtensions
{
    /// <summary>
    /// Chuyển đổi thành giá trị chuỗi mà API yêu cầu
    /// </summary>
    public static string AsString(this StreamType streamType)
    {
        return streamType switch
        {
            StreamType.Metrics => OpenObserveConstants.StreamTypes.Metrics,
            StreamType.Traces => OpenObserveConstants.StreamTypes.Traces,
            _ => OpenObserveConstants.StreamTypes.Logs,
        };
    }
}
