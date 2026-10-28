using LINGYUN.Abp.OpenObserve.Models.Search;
using LINGYUN.Abp.OpenObserve.Utils;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace LINGYUN.Abp.OpenObserve;

public partial class OpenObserveClient
{
    /// <summary>
    /// Lấy giá trị của trường truy vấn
    /// </summary>
    /// <remarks>
    /// GET /api/{organization}/{stream}/_values
    /// Tham khảo: https://openobserve.ai/docs/reference/api/search/
    /// </remarks>
    /// <param name="fields">Tập hợp tên trường, nối bằng dấu phẩy</param>
    /// <param name="size">Số lượng giá trị trả về, sắp xếp theo số lần xuất hiện</param>
    /// <param name="keyword">Lọc theo từ khóa giá trị</param>
    /// <param name="noCount">Khi là true thì không trả về số đếm mà sắp xếp trực tiếp theo giá trị</param>
    public async virtual Task<ValuesResponse> GetValuesAsync(
        string stream,
        IEnumerable<string> fields,
        DateTime startTime,
        DateTime endTime,
        long? size = null,
        string? keyword = null,
        bool? noCount = null,
        string? organization = null,
        CancellationToken cancellationToken = default)
    {
        var queryString = OpenObserveQueryString.Build(
            ("fields", string.Join(",", fields)),
            ("start_time", startTime.ToMicroseconds()),
            ("end_time", endTime.ToMicroseconds()),
            ("size", size),
            ("keyword", keyword),
            ("no_count", noCount));

        var requestUri = $"/api/{ResolveOrganization(organization)}/{Uri.EscapeDataString(stream)}/_values{queryString}";

        return (await GetAsync<ValuesResponse>(requestUri, cancellationToken: cancellationToken))!;
    }
}
