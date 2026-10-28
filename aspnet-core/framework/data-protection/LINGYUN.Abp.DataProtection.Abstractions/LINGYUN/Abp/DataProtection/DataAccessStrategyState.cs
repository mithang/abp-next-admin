using System;

namespace LINGYUN.Abp.DataProtection;

[Serializable]
public class DataAccessStrategyState
{
    /// <summary>
    /// Chủ thể quyền
    /// </summary>
    public string SubjectName { get; set; } = default!;

    /// <summary>
    /// Định danh chủ thể quyền
    /// </summary>
    public string[] SubjectKeys { get; set; } = default!;

    /// <summary>
    /// Chính sách quyền
    /// </summary>
    public DataAccessStrategy Strategy { get; set; }
    public DataAccessStrategyState()
    {

    }
    public DataAccessStrategyState(
        string subjectName,
        string[] subjectKeys,
        DataAccessStrategy strategy)
    {
        SubjectName = subjectName;
        SubjectKeys = subjectKeys;
        Strategy = strategy;
    }
}
