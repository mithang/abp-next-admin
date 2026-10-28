using System;
using Volo.Abp.Caching;

namespace LINGYUN.Abp.DataProtection.Stores;

[Serializable]
[CacheName("AbpDataProtectionStrategyStates")]
public class DataAccessStrategyStateCacheItem
{
    private const string CacheKeyFormat = "sn:{0};si:{1}";
    /// <summary>
    /// Chủ thể quyền
    /// </summary>
    public string SubjectName { get; set; } = default!;

    /// <summary>
    /// Định danh chủ thể quyền
    /// </summary>
    public string SubjectId { get; set; } = default!;

    /// <summary>
    /// Chính sách quyền
    /// </summary>
    public DataAccessStrategy Strategy { get; set; }
    public DataAccessStrategyStateCacheItem()
    {

    }

    public DataAccessStrategyStateCacheItem(
        string subjectName, 
        string subjectId, 
        DataAccessStrategy strategy)
    {
        SubjectName = subjectName;
        SubjectId = subjectId;
        Strategy = strategy;
    }

    public static string CalculateCacheKey(string subjectName, string subjectId)
    {
        return string.Format(CacheKeyFormat, subjectName, subjectId);
    }
}
