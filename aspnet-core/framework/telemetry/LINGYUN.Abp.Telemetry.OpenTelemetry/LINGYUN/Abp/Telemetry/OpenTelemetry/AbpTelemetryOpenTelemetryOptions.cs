using System;
using System.Collections.Generic;
using System.Linq;

namespace LINGYUN.Abp.Telemetry.OpenTelemetry;
public class AbpTelemetryOpenTelemetryOptions
{
    /// <summary>
    /// Có bỏ qua yêu cầu bảng điều khiển CAP hay không, mặc định: true
    /// </summary>
    public bool IgnoreCapDashboardUrls { get; set; }
    /// <summary>
    /// Có bỏ qua yêu cầu ES hay không, mặc định: true
    /// </summary>
    public bool IgnoreElasticsearchUrls { get; set; }
    /// <summary>
    /// Đường dẫn yêu cầu nội bộ bị bỏ qua
    /// </summary>
    public List<string> IgnoreLocalRequestUrls { get; set; }
    /// <summary>
    /// Đường dẫn yêu cầu từ xa bị bỏ qua
    /// </summary>
    public List<string> IgnoreRemoteRequestUrls { get; set; }

    public AbpTelemetryOpenTelemetryOptions()
    {
        IgnoreLocalRequestUrls = new List<string>
        {
             "/healthz",    // Yêu cầu kiểm tra tình trạng dịch vụ không được ghi lại
        };
        IgnoreRemoteRequestUrls = new List<string>();
        IgnoreCapDashboardUrls = true;
        IgnoreElasticsearchUrls = true;
    }

    public bool IsIgnureLocalRequestUrl(string url)
    {
        // Bỏ qua yêu cầu bảng điều khiển CAP
        if (IgnoreCapDashboardUrls && url.StartsWith("/cap"))
        {
            return true;
        }

        return IgnoreLocalRequestUrls.Any(localUrl => url.Equals(localUrl, StringComparison.InvariantCultureIgnoreCase));
    }

    public bool IsIgnureRemoteRequestUrl(string url)
    {
        // Bỏ qua yêu cầu đẩy dữ liệu tới es
        if (IgnoreElasticsearchUrls && url.EndsWith("/_bulk"))
        {
            return true;
        }

        return IgnoreRemoteRequestUrls.Any(remoteUrl => url.Equals(remoteUrl, StringComparison.InvariantCultureIgnoreCase));
    }
}

