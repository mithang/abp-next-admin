namespace LINGYUN.Linq.Dynamic.Queryable;
public enum DynamicComparison
{
    /// <summary>
    /// Bằng
    /// </summary>
    Equal = 0,
    /// <summary>
    /// Không bằng
    /// </summary>
    NotEqual = 1,
    /// <summary>
    /// Nhỏ hơn
    /// </summary>
    LessThan = 2,
    /// <summary>
    /// Nhỏ hơn hoặc bằng
    /// </summary>
    LessThanOrEqual = 3,
    /// <summary>
    /// Lớn hơn
    /// </summary>
    GreaterThan = 4,
    /// <summary>
    /// Lớn hơn hoặc bằng
    /// </summary>
    GreaterThanOrEqual = 5,
    /// <summary>
    /// Bắt đầu bằng
    /// </summary>
    StartsWith = 6,
    /// <summary>
    /// Không bắt đầu bằng
    /// </summary>
    NotStartsWith = 7,
    /// <summary>
    /// Kết thúc bằng
    /// </summary>
    EndsWith = 8,
    /// <summary>
    /// Không kết thúc bằng
    /// </summary>
    NotEndsWith = 9,
    /// <summary>
    /// Chứa
    /// </summary>
    Contains = 10,
    /// <summary>
    /// Không chứa
    /// </summary>
    NotContains = 11,
    /// <summary>
    /// Giá trị rỗng
    /// </summary>
    Null = 12,
    /// <summary>
    /// Khác rỗng
    /// </summary>
    NotNull = 13
}

