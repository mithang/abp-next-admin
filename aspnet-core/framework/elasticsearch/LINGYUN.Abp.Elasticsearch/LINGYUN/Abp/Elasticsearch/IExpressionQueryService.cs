using Elastic.Clients.Elasticsearch;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading;
using System.Threading.Tasks;

namespace LINGYUN.Abp.Elasticsearch;

public interface IExpressionQueryService
{
    /// <summary>
    /// Truy vấn số lượng tài liệu thỏa mãn điều kiện
    /// </summary>
    /// <typeparam name="TDocument">Loại tài liệu</typeparam>
    /// <param name="indexName">Chỉ mục tài liệu</param>
    /// <param name="expression">Cây biểu thức truy vấn</param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<long> GetCountAsync<TDocument>(
        string indexName, 
        Expression<Func<TDocument, bool>> expression,
        CancellationToken cancellationToken = default) where TDocument : class;
    /// <summary>
    /// Truy vấn danh sách tài liệu thỏa mãn điều kiện
    /// </summary>
    /// <typeparam name="TDocument">Loại tài liệu</typeparam>
    /// <param name="indexName">Chỉ mục tài liệu</param>
    /// <param name="expression">Cây biểu thức truy vấn</param>
    /// <param name="sorting">Trường sắp xếp</param>
    /// <param name="maxResultCount">Kích thước dữ liệu tối đa trả về</param>
    /// <param name="skipCount">Kích thước dữ liệu bỏ qua</param>
    /// <param name="sourceExcludes">Trường bao gồm</param>
    /// <param name="sourceIncludes">Trường bỏ qua</param>
    /// <param name="beginMarker">Trường bắt đầu sắp xếp</param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<List<TDocument>> GetListAsync<TDocument>(
        string indexName,
        Expression<Func<TDocument, bool>> expression,
        string? sorting = null,
        int maxResultCount = 50,
        int skipCount = 0,
        Fields? sourceExcludes = null,
        Fields? sourceIncludes = null,
        object[]? beginMarker = null,
        CancellationToken cancellationToken = default) where TDocument : class;
}
