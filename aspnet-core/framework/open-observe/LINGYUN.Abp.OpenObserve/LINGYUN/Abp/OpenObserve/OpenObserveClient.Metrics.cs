using System.Threading;
using System.Threading.Tasks;

namespace LINGYUN.Abp.OpenObserve;

public partial class OpenObserveClient
{
    /// <summary>
    /// Chỉ số nội bộ (định dạng văn bản Prometheus)
    /// </summary>
    /// <remarks>
    /// GET /metrics, lưu ý endpoint này không nằm dưới tiền tố /api
    /// Cần bật ZO_PROMETHEUS_ENABLE=true ở phía server, nếu chưa bật sẽ trả về nội dung rỗng
    /// Tham khảo: https://openobserve.ai/docs/reference/api/metrics/
    /// </remarks>
    /// <returns>Nội dung định dạng văn bản Prometheus (text/plain; version=0.0.4)</returns>
    public async virtual Task<string> GetMetricsAsync(
        CancellationToken cancellationToken = default)
    {
        var httpResponse = await HttpClient.GetAsync("/metrics", cancellationToken);

        await EnsureSuccessStatusCode(httpResponse, null, cancellationToken);

        return await httpResponse.Content.ReadAsStringAsync(cancellationToken);
    }
}
