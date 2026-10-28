using System;
using System.Collections.Generic;
using Volo.Abp.Caching;

namespace LINGYUN.Abp.DataProtection.Stores;

[Serializable]
[CacheName("AbpDataProtectionResources")]
public class DataProtectedResourceCacheItem
{
    private const string CacheKeyFormat = "sn:{0};si:{1},e:{2},o:{3}";
    /// <summary>
    /// Chủ thể quyền
    /// </summary>
    public string SubjectName { get; set; } = default!;

    /// <summary>
    /// Mã định danh chủ thể quyền
    /// </summary>
    public string SubjectId { get; set; } = default!;

    /// <summary>
    /// Tên đầy đủ của loại thực thể
    /// </summary>
    public string EntityTypeFullName { get; set; } = default!;

    /// <summary>
    /// Thao tác quyền dữ liệu
    /// </summary>
    public DataAccessOperation Operation { get; set; }

    /// <summary>
    /// Lấy hoặc đặt quy tắc lọc dữ liệu
    /// </summary>
    public DataAccessFilterGroup? FilterGroup { get; set; }

    /// <summary>
    /// Danh sách thuộc tính được phép thao tác
    /// </summary>
    public List<string> AccessdProperties { get; set; }
    public DataProtectedResourceCacheItem()
    {
        AccessdProperties = new List<string>();
    }

    public DataProtectedResourceCacheItem(
        string subjectName, 
        string subjectId, 
        string entityTypeFullName,
        DataAccessOperation operation, 
        DataAccessFilterGroup? filterGroup = null)
    {
        SubjectName = subjectName;
        SubjectId = subjectId;
        EntityTypeFullName = entityTypeFullName;
        Operation = operation;
        FilterGroup = filterGroup;
        AccessdProperties = new List<string>();
    }

    public static string CalculateCacheKey(string subjectName, string subjectId, string entityTypeFullName, DataAccessOperation operation = DataAccessOperation.Read)
    {
        return string.Format(CacheKeyFormat, subjectName, subjectId, entityTypeFullName, operation.ToString());
    }
}
