using System;
using System.Collections.Generic;

namespace LINGYUN.Abp.DataProtection;

[Serializable]
public class DataAccessResource
{
    /// <summary>
    /// Chủ thể quyền
    /// </summary>
    public string SubjectName { get; set; } = default!;

    /// <summary>
    /// Định danh chủ thể quyền
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
    public List<string> AccessedProperties { get; set; }

    public DataAccessResource()
    {
        AccessedProperties = new List<string>();
    }

    public DataAccessResource(
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

        AccessedProperties = new List<string>();
    }
}
