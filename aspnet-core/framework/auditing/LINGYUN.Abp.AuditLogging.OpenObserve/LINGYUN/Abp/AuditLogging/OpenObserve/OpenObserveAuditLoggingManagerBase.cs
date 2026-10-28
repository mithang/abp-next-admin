using LINGYUN.Abp.OpenObserve;
using LINGYUN.Abp.OpenObserve.Models;
using LINGYUN.Abp.OpenObserve.Models.Search;
using LINGYUN.Abp.OpenObserve.Utils;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Volo.Abp.Timing;

namespace LINGYUN.Abp.AuditLogging.OpenObserve;

/// <summary>
/// Lớp cơ sở của trình quản lý nhật ký kiểm tra OpenObserve
/// </summary>
/// <remarks>
/// Một số ràng buộc của OpenObserve được xử lý thống nhất tại đây:
/// * Truy vấn phải chỉ định khoảng thời gian, và khoảng này áp dụng cho thời gian ghi (_timestamp), do đó thống nhất dùng cửa sổ rộng,
///   việc lọc theo thời gian nghiệp vụ được thực hiện bằng điều kiện SQL (tên cột viết thường, thời gian là chuỗi ISO 8601);
/// * Không hỗ trợ xóa theo bản ghi, giao diện xóa trực tiếp ném <see cref="NotSupportedException"/>;
/// * Tên cột luôn viết thường (OpenObserve sẽ viết thường hóa tên trường).
/// </remarks>
public abstract class OpenObserveAuditLoggingManagerBase
{
    /// <summary>
    /// Số bản ghi tối đa trả về trong một lần truy vấn
    /// </summary>
    public const int MaxSearchResultCount = 5000;

    protected IClock Clock { get; }
    protected OpenObserveClient Client { get; }
    protected AbpAuditLoggingOpenObserveOptions Options { get; }
    protected OpenObserveSqlBuilder SqlBuilder { get; }
    protected IOpenObserveStreamNameNormalizer StreamNameNormalizer { get; }
    protected ILogger Logger { get; }

    protected OpenObserveAuditLoggingManagerBase(
        IClock clock,
        OpenObserveClient client,
        AbpAuditLoggingOpenObserveOptions options,
        OpenObserveSqlBuilder sqlBuilder,
        IOpenObserveStreamNameNormalizer streamNameNormalizer,
        ILogger logger)
    {
        Clock = clock;
        Client = client;
        Options = options;
        SqlBuilder = sqlBuilder;
        StreamNameNormalizer = streamNameNormalizer;
        Logger = logger;
    }

    /// <summary>
    /// Lấy tên luồng dữ liệu nhật ký kiểm tra (theo tenant)
    /// </summary>
    protected virtual string GetAuditLogStream(Guid? tenantId = null)
    {
        return StreamNameNormalizer.NormalizeStream(Options.AuditLogStream, tenantId);
    }

    /// <summary>
    /// Lấy tên luồng dữ liệu nhật ký bảo mật (theo tenant)
    /// </summary>
    protected virtual string GetSecurityLogStream(Guid? tenantId = null)
    {
        return StreamNameNormalizer.NormalizeStream(Options.SecurityLogStream, tenantId);
    }

    /// <summary>
    /// Lấy tên luồng dữ liệu thay đổi thực thể (theo tenant)
    /// </summary>
    protected virtual string GetEntityChangeStream(Guid? tenantId = null)
    {
        return StreamNameNormalizer.NormalizeStream(Options.GetEntityChangeStream(), tenantId);
    }

    /// <summary>
    /// Lấy tên luồng dữ liệu thao tác (theo tenant)
    /// </summary>
    protected virtual string GetActionStream(Guid? tenantId = null)
    {
        return StreamNameNormalizer.NormalizeStream(Options.GetActionStream(), tenantId);
    }

    /// <summary>
    /// Thời gian bắt đầu của cửa sổ truy vấn
    /// </summary>
    /// <remarks>
    /// Phạm vi là thời gian ghi của bản ghi (_timestamp), thời gian nghiệp vụ vui lòng lọc bằng điều kiện SQL
    /// </remarks>
    protected virtual DateTime GetQueryStartTime()
    {
        return Clock.Now.AddDays(-Math.Abs(Options.DefaultQueryDays));
    }

    /// <summary>
    /// Thời gian kết thúc của cửa sổ truy vấn
    /// </summary>
    protected virtual DateTime GetQueryEndTime()
    {
        return Clock.Now.AddDays(1);
    }

    /// <summary>
    /// Thực thi truy vấn SQL
    /// </summary>
    /// <remarks>
    /// Khi luồng dữ liệu chưa tồn tại, OpenObserve trả về lỗi (chưa từng ghi dữ liệu), tại đây xử lý như kết quả rỗng;
    /// các lỗi khác (thông tin xác thực, cú pháp, ngoại lệ dịch vụ) tiếp tục được ném lên trên
    /// </remarks>
    protected async virtual Task<SearchResponse<THit>> SearchAsync<THit>(
        string sql,
        int skipCount = 0,
        int maxResultCount = 50,
        CancellationToken cancellationToken = default)
    {
        var query = new SearchQuery(
            sql,
            GetQueryStartTime(),
            GetQueryEndTime(),
            skipCount,
            maxResultCount);

        try
        {
            return await Client.SearchAsync<THit>(
                Options.Organization,
                query,
                cancellationToken: cancellationToken);
        }
        catch (OpenObserveException exception) when (IsStreamNotFound(exception))
        {
            Logger.LogWarning(
                "The OpenObserve stream does not exist yet (no data has been ingested), an empty result is returned. {Message}",
                exception.Message);

            return new SearchResponse<THit>();
        }
    }

    /// <summary>
    /// Có phải lỗi "luồng dữ liệu không tồn tại" hay không
    /// </summary>
    /// <remarks>
    /// Khi OpenObserve chưa từng ghi dữ liệu thì luồng dữ liệu chưa được tạo, trả về mã 20002 và
    /// thông báo <c>Search stream not found: {stream}</c>
    /// </remarks>
    protected virtual bool IsStreamNotFound(OpenObserveException exception)
    {
        return exception.Message.Contains("stream not found", StringComparison.OrdinalIgnoreCase);
    }

    /// <summary>
    /// Thực thi truy vấn SQL và trả về toàn bộ kết quả khớp
    /// </summary>
    protected async virtual Task<List<THit>> SearchAllAsync<THit>(
        string sql,
        int maxResultCount = MaxSearchResultCount,
        CancellationToken cancellationToken = default)
    {
        var response = await SearchAsync<THit>(sql, 0, maxResultCount, cancellationToken);

        return response.Hits.ToList();
    }

    /// <summary>
    /// Đếm số bản ghi thỏa mãn điều kiện
    /// </summary>
    protected async virtual Task<long> GetTotalAsync(
        string stream,
        string condition,
        CancellationToken cancellationToken = default)
    {
        var sql = $"select count(*) as total from {stream} where {condition}";

        var response = await SearchAsync<OpenObserveCount>(sql, 0, 1, cancellationToken);

        return response.Hits.Length == 0 ? 0 : response.Hits[0].Total;
    }

    /// <summary>
    /// Xây dựng điều kiện
    /// </summary>
    protected virtual string BuildCondition(IEnumerable<Condition> conditions)
    {
        return SqlBuilder.Build(conditions);
    }

    /// <summary>
    /// Xây dựng điều kiện khoảng thời gian
    /// </summary>
    /// <remarks>
    /// Cột thời gian được lưu dưới dạng chuỗi ISO 8601, so sánh theo cùng định dạng
    /// </remarks>
    protected virtual string BuildTimeCondition(string field, DateTime? startTime, DateTime? endTime)
    {
        var parts = new List<string>();

        if (startTime.HasValue)
        {
            parts.Add($"{field} >= {SqlBuilder.FormatDateTime(startTime.Value)}");
        }
        if (endTime.HasValue)
        {
            parts.Add($"{field} <= {SqlBuilder.FormatDateTime(endTime.Value)}");
        }

        return string.Join(" AND ", parts);
    }

    /// <summary>
    /// Kết hợp các điều kiện
    /// </summary>
    protected virtual string Combine(params string[] conditions)
    {
        var parts = conditions
            .Where(condition => !condition.IsNullOrWhiteSpace())
            .ToList();

        return parts.Count == 0 ? "1 = 1" : string.Join(" AND ", parts);
    }

    /// <summary>
    /// Chuẩn hóa trường sắp xếp (tên thành viên biểu thức -> tên cột luồng dữ liệu)
    /// </summary>
    protected virtual string NormalizeSorting(string? sorting, string defaultSorting)
    {
        var value = sorting.IsNullOrWhiteSpace() ? defaultSorting : sorting!;

        var parts = value.Split(' ', StringSplitOptions.RemoveEmptyEntries);
        if (parts.Length > 0)
        {
            parts[0] = SqlBuilder.GetMappedField(parts[0]);
        }

        return string.Join(' ', parts);
    }

    /// <summary>
    /// Thoát chuỗi
    /// </summary>
    protected virtual string Escape(string? value)
    {
        return SqlBuilder.Escape(value ?? string.Empty);
    }
}
