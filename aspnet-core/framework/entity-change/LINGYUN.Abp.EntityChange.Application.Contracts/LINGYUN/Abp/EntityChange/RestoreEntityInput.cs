using System;
using System.ComponentModel.DataAnnotations;

namespace LINGYUN.Abp.EntityChange;

public class RestoreEntityInput
{
    /// <summary>
    /// Định danh thực thể
    /// </summary>
    [Required]
    public string EntityId { get; set; } = default!;
    /// <summary>
    /// Khôi phục về một định danh phiên bản
    /// </summary>
    /// <remarks>
    /// Lưu ý: khi truyền giá trị này, sẽ khôi phục về NewValue của phiên bản đã chỉ định
    /// Ngược lại, khôi phục về OriginalValue của phiên bản gần nhất
    /// </remarks>
    public Guid? EntityChangeId { get; set; }
}
