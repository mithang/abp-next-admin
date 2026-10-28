using LINGYUN.Abp.OpenObserve.Models.Search;
using LINGYUN.Abp.OpenObserve.Models.Stream;
using LINGYUN.Abp.OpenObserve.Utils;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace LINGYUN.Abp.OpenObserve;

public partial class OpenObserveClient
{
    /// <summary>
    /// Truy vấn dữ liệu trước và sau một bản ghi
    /// </summary>
    /// <remarks>
    /// GET /api/{organization}/{stream}/_around
    /// Lấy bản ghi tương ứng với key (_timestamp) làm trung tâm, truy vấn trong phạm vi 5 phút trước và sau
    /// Tham khảo: https://openobserve.ai/docs/reference/api/search/
    /// </remarks>
    /// <param name="key">_timestamp (micro giây) của bản ghi trung tâm</param>
    /// <param name="size">Số bản ghi trả về</param>
    public async virtual Task<SearchResponse<THint>> AroundAsync<THint>(
        string stream,
        long key,
        long? size = null,
        StreamType? type = null,
        int? timeout = null,
        string? organization = null,
        CancellationToken cancellationToken = default)
    {
        var queryString = OpenObserveQueryString.Build(
            ("key", key),
            ("size", size),
            ("type", type?.AsString()),
            ("timeout", timeout));

        var requestUri = $"/api/{ResolveOrganization(organization)}/{Uri.EscapeDataString(stream)}/_around{queryString}";

        return (await GetAsync<SearchResponse<THint>>(requestUri, cancellationToken: cancellationToken))!;
    }
}
